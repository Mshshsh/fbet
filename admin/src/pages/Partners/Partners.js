import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPartnersApi, createPartnerApi, updatePartnerApi, deletePartnerApi, uploadImageApi } from '../../api';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const empty = { name: '', websiteUrl: '', logoUrl: '', bonusInfo: '', description: '', order: 0, isActive: true };

const Partners = () => {
  const qc = useQueryClient();
  const [alert, setAlert] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const { data, isLoading } = useQuery({ queryKey: ['admin-partners'], queryFn: getPartnersApi });
  const partners = data?.data?.data || [];

  const createMut = useMutation({
    mutationFn: (d) => createPartnerApi(d),
    onSuccess: () => { showAlert('✅ Partner oluşturuldu.'); qc.invalidateQueries(['admin-partners']); setShowForm(false); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updatePartnerApi(id, data),
    onSuccess: () => { showAlert('✅ Güncellendi.'); qc.invalidateQueries(['admin-partners']); setShowForm(false); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deletePartnerApi(id),
    onSuccess: () => { showAlert('✅ Silindi.'); qc.invalidateQueries(['admin-partners']); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadImageApi(fd);
      setForm(p => ({ ...p, logoUrl: res.data?.data?.url || '' }));
      showAlert('✅ Logo yüklendi.');
    } catch {
      showAlert('❌ Logo yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name || '', websiteUrl: p.websiteUrl || '', logoUrl: p.logoUrl || '',
      bonusInfo: p.bonusInfo || '', description: p.description || '', order: p.order || 0, isActive: !!p.isActive });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  const logoSrc = (url) => url?.startsWith('http') ? url : url ? `${API_BASE}${url}` : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Partnerler</h1>
        <button className="btn-primary" onClick={handleOpenCreate}>+ Yeni Partner</button>
      </div>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>{editing ? 'Partner Düzenle' : 'Yeni Partner'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label>İsim *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Web Sitesi URL</label>
                <input type="text" value={form.websiteUrl} onChange={e => setForm(p => ({ ...p, websiteUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Bonus Bilgisi</label>
                <input type="text" value={form.bonusInfo} onChange={e => setForm(p => ({ ...p, bonusInfo: e.target.value }))} placeholder="örn: %100 Hoş Geldin Bonusu" />
              </div>
              <div className="form-group">
                <label>Sıralama</label>
                <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 4 }}>
              <label>Açıklama</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>

            {/* Logo yükleme */}
            <div className="form-group" style={{ marginTop: 4 }}>
              <label>Logo</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={form.logoUrl}
                  onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))}
                  placeholder="/uploads/... veya https://..."
                  style={{ flex: 1, minWidth: 180 }}
                />
                <label style={{
                  background: '#1e1a10', border: '1px solid #3a3020', color: '#c9a84c',
                  borderRadius: 7, padding: '8px 14px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {uploading ? 'Yükleniyor...' : '📁 Logo Yükle'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} disabled={uploading} />
                </label>
              </div>
              {form.logoUrl && logoSrc(form.logoUrl) && (
                <div style={{ marginTop: 10, padding: 12, background: '#111', borderRadius: 8, display: 'inline-block' }}>
                  <img src={logoSrc(form.logoUrl)} alt="Logo" style={{ maxHeight: 60, maxWidth: 160, objectFit: 'contain' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
              <label htmlFor="isActive" style={{ fontSize: 13, color: '#c0c4d0', cursor: 'pointer' }}>Aktif</label>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button type="submit" className="btn-primary" disabled={createMut.isPending || updateMut.isPending}>
                {editing ? 'Güncelle' : 'Kaydet'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Partner Listesi */}
      {isLoading ? <div className="loading">Yükleniyor...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {partners.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#8a8fa8', padding: 40 }}>Partner yok.</div>
          ) : partners.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 14 }}>
              <div style={{ width: 80, height: 50, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                {p.logoUrl ? (
                  <img src={logoSrc(p.logoUrl)} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 11, color: '#5a4e38' }}>Logo yok</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <strong style={{ fontSize: 14, color: '#e8dcc8' }}>{p.name}</strong>
                  <span style={{ fontSize: 11, color: '#5a4e38' }}>#{p.order}</span>
                  <span className={`badge badge--${p.isActive ? 'success' : 'warning'}`}>{p.isActive ? 'Aktif' : 'Pasif'}</span>
                </div>
                {p.bonusInfo && <p style={{ fontSize: 12, color: '#c9a84c', margin: 0 }}>{p.bonusInfo}</p>}
                {p.websiteUrl && <p style={{ fontSize: 11, color: '#5a4e38', margin: 0 }}>{p.websiteUrl}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn-secondary btn-sm" onClick={() => handleEdit(p)}>Düzenle</button>
                <button className="btn-danger btn-sm" onClick={() => window.confirm('Silinsin mi?') && deleteMut.mutate(p.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Partners;
