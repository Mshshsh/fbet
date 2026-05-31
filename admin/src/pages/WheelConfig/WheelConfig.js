import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function apiFetch(path, token, opts = {}) {
  return fetch(`${API_BASE}/api${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts.headers },
  }).then(r => r.json());
}

const emptyForm = { label: '', points: '', weight: '10', color: '#2a2008', textColor: '#c9a84c', sortOrder: '0', isActive: true };

const COLOR_PRESETS = ['#2a2008', '#1e1608', '#3d2d0e', '#5a3d10', '#8a6820', '#c9a84c', '#ffd700', '#080808', '#0a0a0a'];
const TEXT_PRESETS  = ['#c9a84c', '#ffd700', '#e8c567', '#080808', '#e8dcc8'];

export default function WheelConfig() {
  const { token } = useAdminAuth();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [alert, setAlert]       = useState(null);

  const load = async () => {
    setLoading(true);
    const d = await apiFetch('/wheel/segments', token);
    if (d.success) setSegments(d.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3000);
  };

  const totalWeight = segments.filter(s => s.isActive).reduce((a, s) => a + s.weight, 0);

  const startEdit = (seg) => {
    setEditId(seg.id);
    setForm({
      label:     seg.label,
      points:    String(seg.points),
      weight:    String(seg.weight),
      color:     seg.color,
      textColor: seg.textColor,
      sortOrder: String(seg.sortOrder),
      isActive:  seg.isActive,
    });
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      label:     form.label,
      points:    parseInt(form.points),
      weight:    parseInt(form.weight),
      color:     form.color,
      textColor: form.textColor,
      sortOrder: parseInt(form.sortOrder),
      isActive:  form.isActive,
    };

    let d;
    if (editId) {
      d = await apiFetch(`/wheel/segments/${editId}`, token, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      d = await apiFetch('/wheel/segments', token, { method: 'POST', body: JSON.stringify(body) });
    }

    if (d.success) {
      showAlert('success', editId ? 'Segment güncellendi.' : 'Segment eklendi.');
      setEditId(null);
      setForm(emptyForm);
      load();
    } else {
      showAlert('error', d.error || 'Hata oluştu.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu segmenti silmek istediğinize emin misiniz?')) return;
    const d = await apiFetch(`/wheel/segments/${id}`, token, { method: 'DELETE' });
    if (d.success) { showAlert('success', 'Silindi.'); load(); }
    else showAlert('error', d.error);
  };

  const handleToggle = async (seg) => {
    await apiFetch(`/wheel/segments/${seg.id}`, token, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !seg.isActive }),
    });
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Çark Ayarları</h1>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Toplam ağırlık (aktif): <strong style={{ color: 'var(--gold)' }}>{totalWeight}</strong>
        </span>
      </div>

      {alert && <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>{alert.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* ── Segment Listesi ── */}
        <div className="card">
          {loading ? <div className="loading">Yükleniyor...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Önizleme</th>
                  <th>Label</th>
                  <th>Puan</th>
                  <th>Ağırlık</th>
                  <th>Olasılık</th>
                  <th>Sıra</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {segments.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Segment yok.</td></tr>
                )}
                {segments.map(seg => {
                  const prob = totalWeight > 0 ? ((seg.weight / totalWeight) * 100).toFixed(1) : 0;
                  return (
                    <tr key={seg.id} style={{ opacity: seg.isActive ? 1 : 0.45 }}>
                      <td>
                        <div style={{
                          width: 48, height: 28, borderRadius: 6,
                          background: seg.color,
                          border: `1px solid ${seg.textColor}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: seg.textColor,
                        }}>
                          {seg.label.replace(' Puan', '')}
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>{seg.label}</td>
                      <td style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>{seg.points}</td>
                      <td>{seg.weight}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>%{prob}</td>
                      <td>{seg.sortOrder}</td>
                      <td>
                        <span className={`badge badge--${seg.isActive ? 'success' : 'danger'}`}>
                          {seg.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-secondary btn-sm" onClick={() => startEdit(seg)}>Düzenle</button>
                          <button className="btn-secondary btn-sm" onClick={() => handleToggle(seg)}>
                            {seg.isActive ? 'Pasif' : 'Aktif'}
                          </button>
                          <button className="btn-danger btn-sm" onClick={() => handleDelete(seg.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Form ── */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginBottom: 18 }}>
            {editId ? 'Segmenti Düzenle' : 'Yeni Segment Ekle'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Label</label>
              <input type="text" placeholder="örn: 100 Puan" value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })} required maxLength={50} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label>Puan</label>
                <input type="number" placeholder="100" value={form.points} min={0}
                  onChange={e => setForm({ ...form, points: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ağırlık</label>
                <input type="number" placeholder="10" value={form.weight} min={1}
                  onChange={e => setForm({ ...form, weight: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label>Arka Plan Rengi</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {COLOR_PRESETS.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, color: c })}
                    style={{
                      width: 24, height: 24, borderRadius: 4, background: c, cursor: 'pointer',
                      border: form.color === c ? '2px solid #ffd700' : '1px solid #444',
                    }} />
                ))}
              </div>
              <input type="text" value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })} placeholder="#2a2008" />
            </div>

            <div className="form-group">
              <label>Metin Rengi</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {TEXT_PRESETS.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, textColor: c })}
                    style={{
                      width: 24, height: 24, borderRadius: 4, background: c, cursor: 'pointer',
                      border: form.textColor === c ? '2px solid #ffd700' : '1px solid #444',
                    }} />
                ))}
              </div>
              <input type="text" value={form.textColor}
                onChange={e => setForm({ ...form, textColor: e.target.value })} placeholder="#c9a84c" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label>Sıralama</label>
                <input type="number" value={form.sortOrder} min={0}
                  onChange={e => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end', paddingTop: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: 16, height: 16 }} />
                  Aktif
                </label>
              </div>
            </div>

            {/* Önizleme */}
            <div style={{
              margin: '12px 0 16px',
              height: 40, borderRadius: 8,
              background: form.color,
              border: `1px solid ${form.textColor}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: form.textColor,
            }}>
              {form.label || 'Önizleme'}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? '...' : editId ? 'Güncelle' : 'Ekle'}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>İptal</button>
              )}
            </div>
          </form>
        </div>

      </div>

      {/* Ağırlık açıklaması */}
      <div className="card" style={{ marginTop: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-2)' }}>Ağırlık nasıl çalışır?</strong><br />
          Her segmentin çıkma olasılığı = o segmentin ağırlığı ÷ tüm aktif segmentlerin toplam ağırlığı.<br />
          Örnek: 8 segment, toplam ağırlık 135 → ağırlığı 10 olan segment %7.4 ihtimalle çıkar.
        </p>
      </div>
    </div>
  );
}
