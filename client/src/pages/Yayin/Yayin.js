import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStreamApi } from '../../api';

const Yayin = () => {
  const { data, isLoading } = useQuery({ queryKey: ['stream'], queryFn: getStreamApi });
  const stream = data?.data?.data;

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  const getEmbedUrl = () => {
    if (!stream) return null;
    if (stream.embedUrl) return stream.embedUrl;
    if (stream.platform === 'kick' && stream.channelName)
      return `https://player.kick.com/${stream.channelName}?autoplay=true`;
    if (stream.platform === 'twitch' && stream.channelName)
      return `https://player.twitch.tv/?channel=${stream.channelName}&parent=${window.location.hostname}`;
    if (stream.platform === 'youtube' && stream.channelName)
      return `https://www.youtube.com/embed/${stream.channelName}`;
    return null;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="page-container">
      <h1 className="page-title">Canlı Yayın</h1>
      {!embedUrl ? (
        <div className="empty-state card">
          <p>🎥 Şu an aktif bir yayın bulunmuyor.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={embedUrl}
              title="Canlı Yayın"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
          {stream?.isLive && (
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#ff0000', borderRadius: '50%', width: 8, height: 8, display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: '#ff0000', fontWeight: 600 }}>CANLI</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Yayin;
