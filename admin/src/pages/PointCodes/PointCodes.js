import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function apiFetch(path, token, opts = {}) {
  return fetch(`${API_BASE}/api${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts.headers },
  }).then(r => r.json());
}

const emptyForm = { code: '', points: '', maxUses: '', expiresAt: '' };

export default function PointCodes() {
  const { token } = useAdminAuth();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    const d = await apiFetch('/point-codes', token);
    if (d.success) setCodes(d.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      code: form.code.toUpperCase().trim(),
      points: parseInt(form.points),
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };
    const d = await apiFetch('/point-codes', token, { method: 'POST', body: JSON.stringify(body) });
    if (d.success) {
      showAlert('success', 'Kod oluşturuldu.');
      setForm(emptyForm);
      load();
    } else {
      showAlert('error', d.error || 'Hata oluştu.');
    }
    setSaving(false);
  };

  const handleToggle = async (id) => {
    await apiFetch(`/point-codes/${id}/toggle`, token, { method: 'PUT' });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kodu silmek istediğinize emin misiniz?')) return;
    await apiFetch(`/point-codes/${id}`, token, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Puan Kodları</h1>
      </div>

      {alert && <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>{alert.text}</div>}

      {/* Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginBottom: 16 }}>Yeni Kod Oluştur</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Kod</label>
              <input
                type="text"
                placeholder="ÖRNEK2024"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                maxLength={32}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Puan Miktarı</label>
              <input
                type="number"
                placeholder="100"
                value={form.points}
                onChange={e => setForm({ ...form, points: e.target.value })}
                required
                min={1}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Maks. Kullanım (boş = sınırsız)</label>
              <input
                type="number"
                placeholder="Sınırsız"
                value={form.maxUses}
                onChange={e => setForm({ ...form, maxUses: e.target.value })}
                min={1}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Son Kullanma Tarihi (opsiyonel)</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : '+ Kod Oluştur'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kod</th>
                <th>Puan</th>
                <th>Kullanım</th>
                <th>Maks.</th>
                <th>Son Tarih</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Henüz kod yok.</td></tr>
              )}
              {codes.map(c => (
                <tr key={c.id}>
                  <td>
                    <code style={{ background: 'var(--bg-3)', padding: '3px 8px', borderRadius: 6, fontSize: 13, color: 'var(--gold)', letterSpacing: 1 }}>
                      {c.code}
                    </code>
                  </td>
                  <td style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>{c.points}</td>
                  <td>{c.usedCount}</td>
                  <td>{c.maxUses ?? '∞'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td>
                    <span className={`badge badge--${c.isActive ? 'success' : 'danger'}`}>
                      {c.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-secondary btn-sm" onClick={() => handleToggle(c.id)}>
                      {c.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Kullanım detayları */}
      {codes.some(c => c.redemptions?.length > 0) && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginBottom: 16 }}>Kod Kullanım Geçmişi</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Kod</th><th>Kullanıcı</th><th>Tarih</th></tr>
            </thead>
            <tbody>
              {codes.flatMap(c =>
                (c.redemptions || []).map(r => (
                  <tr key={r.id}>
                    <td><code style={{ color: 'var(--gold)', fontSize: 12 }}>{c.code}</code></td>
                    <td>{r.user?.username || r.userId}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{new Date(r.createdAt).toLocaleString('tr-TR')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
