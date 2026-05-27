import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTournamentsApi } from '../../api';

const Turnuvalar = () => {
  const { data, isLoading } = useQuery({ queryKey: ['tournaments'], queryFn: getTournamentsApi });
  const tournaments = data?.data?.data || [];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Turnuvalar</h1>
      {tournaments.length === 0 ? (
        <div className="empty-state"><p>Henüz turnuva eklenmemiş.</p></div>
      ) : (
        <div className="grid-3">
          {tournaments.map((t) => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {t.imageUrl && (
                <img src={t.imageUrl} alt={t.name}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</h3>
                <span className={`badge badge--${t.status === 'active' ? 'success' : t.status === 'upcoming' ? 'info' : 'warning'}`}>
                  {t.status === 'active' ? 'Aktif' : t.status === 'upcoming' ? 'Yakında' : 'Bitti'}
                </span>
              </div>
              {t.prizePool && (
                <p style={{ fontSize: 13, color: '#ffc107', fontWeight: 600 }}>🏆 {t.prizePool}</p>
              )}
              {t.description && (
                <p style={{ fontSize: 12, color: '#8a8fa8', lineHeight: 1.5 }}>{t.description}</p>
              )}
              {(t.startDate || t.endDate) && (
                <p style={{ fontSize: 12, color: '#636880' }}>
                  {t.startDate && new Date(t.startDate).toLocaleDateString('tr-TR')}
                  {t.endDate && ` - ${new Date(t.endDate).toLocaleDateString('tr-TR')}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Turnuvalar;
