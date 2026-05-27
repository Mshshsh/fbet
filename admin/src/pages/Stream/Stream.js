import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getStreamApi, updateStreamApi } from '../../api';

const Stream = () => {
  const [form, setForm] = useState({ embedUrl: '', channelName: '', platform: 'youtube', isLive: false });
  const [alert, setAlert] = useState('');

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const { data, isLoading } = useQuery({ queryKey: ['admin-stream'], queryFn: getStreamApi });

  useEffect(() => {
    if (data?.data?.data) {
      const s = data.data.data;
      setForm({
        embedUrl: s.embedUrl || '',
        channelName: s.channelName || '',
        platform: s.platform || 'youtube',
        isLive: !!s.isLive,
      });
    }
  }, [data]);

  const updateMut = useMutation({
    mutationFn: (data) => updateStreamApi(data),
    onSuccess: () => showAlert('✅ Yayın ayarları kaydedildi.'),
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMut.mutate(form);
  };

  // Platform'a göre embed URL oluşturmak için yardımcı
  const getPreviewUrl = () => {
    if (form.embedUrl) return form.embedUrl;
    if (form.platform === 'youtube' && form.channelName) {
      return `https://www.youtube.com/embed/live_stream?channel=${form.channelName}`;
    }
    if (form.platform === 'twitch' && form.channelName) {
      return `https://player.twitch.tv/?channel=${form.channelName}&parent=localhost`;
    }
    if (form.platform === 'kick' && form.channelName) {
      return `https://player.kick.com/${form.channelName}`;
    }
    return '';
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Yayın Konfigürasyonu</h1>
      </div>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Platform</label>
            <select value={form.platform} onChange={(e) => setForm(p => ({ ...p, platform: e.target.value }))}>
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
              <option value="kick">Kick</option>
              <option value="other">Diğer (Manuel URL)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Kanal Adı</label>
            <input
              type="text"
              value={form.channelName}
              onChange={(e) => setForm(p => ({ ...p, channelName: e.target.value }))}
              placeholder={
                form.platform === 'youtube' ? 'YouTube kanal ID' :
                form.platform === 'twitch' ? 'Twitch kanal adı (örn: shroud)' :
                form.platform === 'kick' ? 'Kick kanal adı' : 'Kanal adı'
              }
            />
          </div>

          <div className="form-group">
            <label>Manuel Embed URL <span style={{ color: '#636880', fontSize: 11 }}>(kanal adı yerine kullanılır)</span></label>
            <input
              type="text"
              value={form.embedUrl}
              onChange={(e) => setForm(p => ({ ...p, embedUrl: e.target.value }))}
              placeholder="https://www.youtube.com/embed/VIDEO_ID veya https://player.kick.com/kanal"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="isLive"
              checked={!!form.isLive}
              onChange={(e) => setForm(p => ({ ...p, isLive: e.target.checked }))}
            />
            <label htmlFor="isLive" style={{ fontSize: 13, color: '#c0c4d0', cursor: 'pointer' }}>
              🔴 Yayın Aktif (Sitede canlı göster)
            </label>
          </div>

          {getPreviewUrl() && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#8a8fa8', marginBottom: 8 }}>Önizleme:</p>
              <div style={{ background: '#0a0c12', borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                <iframe
                  src={getPreviewUrl()}
                  title="Yayın Önizleme"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={updateMut.isPending}>
            {updateMut.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Stream;
