import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEventsApi } from '../../api';

const Etkinlikler = () => {
  const { data, isLoading } = useQuery({ queryKey: ['events'], queryFn: getEventsApi });
  const events = data?.data?.data || [];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Etkinlikler</h1>
      {events.length === 0 ? (
        <div className="empty-state"><p>Yaklaşan etkinlik bulunmuyor.</p></div>
      ) : (
        <div className="grid-3">
          {events.map((e) => (
            <div key={e.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {e.imageUrl && (
                <img src={e.imageUrl} alt={e.title}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{e.title}</h3>
              {e.description && <p style={{ fontSize: 12, color: '#8a8fa8', lineHeight: 1.5 }}>{e.description}</p>}
              {e.startDate && (
                <p style={{ fontSize: 12, color: '#3b82f6' }}>
                  🗓 {new Date(e.startDate).toLocaleDateString('tr-TR')}
                  {e.endDate && ` - ${new Date(e.endDate).toLocaleDateString('tr-TR')}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Etkinlikler;
