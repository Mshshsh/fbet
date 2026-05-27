import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHeroSlidesApi, createHeroSlideApi, updateHeroSlideApi, deleteHeroSlideApi, uploadImageApi } from '../../api';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const empty = { title: '', subtitle: '', imageUrl: '', buttonText: '', buttonLink: '', order: 0, isActive: true };

const HeroSlides = () => {
  const qc = useQueryClient();
  const [alert, setAlert] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3500); };

  const { data, isLoading } = useQuery({ queryKey: ['admin-hero-slides'], queryFn: getHeroSlidesApi });
  const slides = data?.data?.data || [];

  const createMut = useMutation({
    mutationFn: (d) => createHeroSlideApi(d),
    onSuccess: () => { showAlert('✅ Slayt oluşturuldu.'); qc.invalidateQueries(['admin-hero-slides']); setShowForm(false); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateHeroSlideApi(id, data),
    onSuccess: () => { showAlert('✅ Güncellendi.'); qc.invalidateQueries(['admin-hero-slides']); setShowForm(false); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deleteHeroSlideApi(id),
    onSuccess: () => { showAlert('✅ Silindi.'); qc.invalidateQueries(['admin-hero-slides']); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadImageApi(fd);
      setForm(p => ({ ...p, imageUrl: res.data?.data?.url || '' }));
      showAlert('✅ Görsel yüklendi.');
    } catch {
      showAlert('❌ Görsel yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const handleEdit = (s) => {
    setEditing(s);
    setForm({ title: s.title || '', subtitle: s.subtitle || '', imageUrl: s.imageUrl || '',
      buttonText: s.buttonText || '', buttonLink: s.buttonLink || '', order: s.order || 0, isActive: !!s.isActive });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  const imgSrc = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hero Slider Yönetimi</h1>
        <button className="btn-primary" onClick={handleOpenCreate}>+ Yeni Slayt</button>
      </div>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>{editing ? 'Slayt Düzenle' : 'Yeni Slayt Ekle'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label>Başlık</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Büyük başlık metni" />
              </div>
              <div className="form-group">
                <label>Alt Başlık</label>
                <input type="text" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="Açıklama / kısa metin" />
              </div>
              <div className="form-group">
                <label>Buton Metni</label>
                <input type="text" value={form.buttonText} onChange={e => setForm(p => ({ ...p, buttonText: e.target.value }))} placeholder="örn: Hemen Katıl" />
              </div>
              <div className="form-group">
                <label>Buton Linki</label>
                <input type="text" value={form.buttonLink} onChange={e => setForm(p => ({ ...p, buttonLink: e.target.value }))} placeholder="/gorevler veya https://..." />
              </div>
              <div className="form-group">
                <label>Sıra</label>
                <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
                <label htmlFor="isActive" style={{ fontSize: 13, color: '#c0c4d0', cursor: 'pointer' }}>Aktif</label>
              </div>
            </div>

            {/* Görsel yükleme */}
            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Arkaplan Görseli</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="/uploads/... veya https://..."
                  style={{ flex: 1, minWidth: 200 }}
                />
                <label style={{
                  background: '#1e1a10', border: '1px solid #3a3020', color: '#c9a84c',
                  borderRadius: 7, padding: '8px 14px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {uploading ? 'Yükleniyor...' : '📁 Dosya Yükle'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {form.imageUrl && (
                <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', maxHeight: 140, background: '#0a0a08' }}>
                  <img
                    src={imgSrc(form.imageUrl)}
                    alt="Önizleme"
                    style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
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

      {/* Slayt Listesi */}
      {isLoading ? <div className="loading">Yükleniyor...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slides.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#8a8fa8', padding: 40 }}>Henüz slayt yok.</div>
          ) : slides.map((s) => (
            <div key={s.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 14 }}>
              {/* Küçük önizleme */}
              <div style={{ width: 120, height: 68, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#0a0a08' }}>
                <img
                  src={imgSrc(s.imageUrl)}
                  alt={s.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = `${API_BASE}/uploads/logos.png`; }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#5a4e38', fontWeight: 600 }}>#{s.order}</span>
                  <strong style={{ fontSize: 14, color: '#e8dcc8' }}>{s.title || '(Başlıksız)'}</strong>
                  <span className={`badge badge--${s.isActive ? 'success' : 'warning'}`} style={{ marginLeft: 4 }}>
                    {s.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                {s.subtitle && <p style={{ fontSize: 12, color: '#5a4e38', marginBottom: 4 }}>{s.subtitle}</p>}
                {s.buttonText && (
                  <span style={{ fontSize: 11, color: '#c9a84c' }}>Buton: {s.buttonText} → {s.buttonLink}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn-secondary btn-sm" onClick={() => handleEdit(s)}>Düzenle</button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => window.confirm('Slayt silinsin mi?') && deleteMut.mutate(s.id)}
                >Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlides;
