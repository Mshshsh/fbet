import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSpecialOddsApi } from '../../api';

const OzelOranlar = () => {
  const { data, isLoading } = useQuery({ queryKey: ['special-odds'], queryFn: getSpecialOddsApi });
  const odds = data?.data?.data || [];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Özel Oranlar</h1>
      {odds.length === 0 ? (
        <div className="empty-state"><p>Şu an özel oran bulunmuyor.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {odds.map((o) => (
            <div key={o.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{o.title}</h3>
                {o.match && <p style={{ fontSize: 13, color: '#8a8fa8' }}>{o.match}</p>}
                {o.sport && <span className="badge badge--info">{o.sport}</span>}
              </div>
              {o.bookmaker && (
                <span style={{ fontSize: 13, color: '#8a8fa8' }}>{o.bookmaker}</span>
              )}
              {o.odds && (
                <span style={{ fontSize: 22, fontWeight: 800, color: '#00e257' }}>{o.odds}</span>
              )}
              {o.expiresAt && (
                <span style={{ fontSize: 11, color: '#636880' }}>
                  Son: {new Date(o.expiresAt).toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OzelOranlar;
