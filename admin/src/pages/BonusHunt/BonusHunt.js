import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBonusHuntsApi, getBonusHuntApi, createBonusHuntApi, updateBonusHuntApi, addBonusHuntSlotApi } from '../../api';

const BonusHunt = () => {
  const qc = useQueryClient();
  const [alert, setAlert] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', startBalance: 0 });
  const [slotForm, setSlotForm] = useState({ gameName: '', provider: '', betAmount: 0, resultAmount: 0, multiplier: 0 });

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const { data: listData, isLoading } = useQuery({ queryKey: ['admin-bonus-hunts'], queryFn: getBonusHuntsApi });
  const sessions = listData?.data?.data || [];

  const { data: detailData } = useQuery({
    queryKey: ['admin-bonus-hunt', selectedId],
    queryFn: () => getBonusHuntApi(selectedId),
    enabled: !!selectedId,
  });
  const detail = detailData?.data?.data;

  const createMut = useMutation({
    mutationFn: (data) => createBonusHuntApi(data),
    onSuccess: () => { showAlert('✅ Oturum oluşturuldu.'); qc.invalidateQueries(['admin-bonus-hunts']); setShowCreate(false); setCreateForm({ title: '', startBalance: 0 }); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateBonusHuntApi(id, data),
    onSuccess: () => { showAlert('✅ Güncellendi.'); qc.invalidateQueries(['admin-bonus-hunts']); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const slotMut = useMutation({
    mutationFn: ({ id, data }) => addBonusHuntSlotApi(id, data),
    onSuccess: () => {
      showAlert('✅ Slot eklendi.');
      qc.invalidateQueries(['admin-bonus-hunt', selectedId]);
      setShowSlotForm(false);
      setSlotForm({ gameName: '', provider: '', betAmount: 0, resultAmount: 0, multiplier: 0 });
    },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bonus Hunt Oturumları</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Yeni Oturum</button>
      </div>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      {showCreate && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Yeni Oturum Oluştur</h3>
          <div className="form-group">
            <label>Başlık *</label>
            <input type="text" value={createForm.title} onChange={(e) => setCreateForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Başlangıç Bakiyesi</label>
            <input type="number" value={createForm.startBalance} onChange={(e) => setCreateForm(p => ({ ...p, startBalance: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={() => createMut.mutate(createForm)} disabled={!createForm.title}>Oluştur</button>
            <button className="btn-secondary" onClick={() => setShowCreate(false)}>İptal</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 2fr' : '1fr', gap: 24 }}>
        {/* Sessions List */}
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Başlık</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32 }}>Yükleniyor...</td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#8a8fa8', padding: 32 }}>Oturum yok.</td></tr>
              ) : sessions.map((s) => (
                <tr key={s.id} style={{ background: selectedId === s.id ? 'rgba(0,226,87,0.05)' : '' }}>
                  <td>{s.id}</td>
                  <td>{s.title}</td>
                  <td>
                    <span className={`badge badge--${s.status === 'active' ? 'success' : s.status === 'hunting' ? 'info' : 'warning'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-secondary btn-sm" onClick={() => setSelectedId(s.id)}>Detay</button>
                      {s.status === 'active' && (
                        <button className="btn-primary btn-sm" onClick={() => updateMut.mutate({ id: s.id, data: { status: 'hunting' } })}>Başlat</button>
                      )}
                      {s.status === 'hunting' && (
                        <button className="btn-danger btn-sm" onClick={() => updateMut.mutate({ id: s.id, data: { status: 'finished' } })}>Bitir</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Session Detail */}
        {selectedId && detail && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{detail.title} — Slotlar</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary btn-sm" onClick={() => setShowSlotForm(!showSlotForm)}>+ Slot Ekle</button>
                  <button className="btn-secondary btn-sm" onClick={() => setSelectedId(null)}>Kapat</button>
                </div>
              </div>
              {showSlotForm && (
                <div style={{ background: '#1a1e2a', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>Oyun Adı *</label>
                      <input type="text" value={slotForm.gameName} onChange={(e) => setSlotForm(p => ({ ...p, gameName: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Sağlayıcı</label>
                      <input type="text" value={slotForm.provider} onChange={(e) => setSlotForm(p => ({ ...p, provider: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Bahis</label>
                      <input type="number" value={slotForm.betAmount} onChange={(e) => setSlotForm(p => ({ ...p, betAmount: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Sonuç</label>
                      <input type="number" value={slotForm.resultAmount} onChange={(e) => setSlotForm(p => ({ ...p, resultAmount: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Çarpan</label>
                      <input type="number" value={slotForm.multiplier} onChange={(e) => setSlotForm(p => ({ ...p, multiplier: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn-primary btn-sm" onClick={() => slotMut.mutate({ id: selectedId, data: slotForm })} disabled={!slotForm.gameName}>Ekle</button>
                    <button className="btn-secondary btn-sm" onClick={() => setShowSlotForm(false)}>İptal</button>
                  </div>
                </div>
              )}
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Oyun</th><th>Sağlayıcı</th><th>Bahis</th><th>Sonuç</th><th>Çarpan</th></tr>
                  </thead>
                  <tbody>
                    {(detail.slots || []).length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8a8fa8', padding: 24 }}>Slot yok.</td></tr>
                    ) : (detail.slots || []).map((slot) => (
                      <tr key={slot.id}>
                        <td>{slot.gameName}</td>
                        <td>{slot.provider}</td>
                        <td>{slot.betAmount}x</td>
                        <td style={{ color: '#00e257' }}>{slot.resultAmount} ₺</td>
                        <td style={{ color: '#ffc107', fontWeight: 700 }}>{slot.multiplier}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusHunt;
