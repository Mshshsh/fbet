import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBonusHuntsApi } from '../../api';

const BonusHunt = () => {
  const { data, isLoading } = useQuery({ queryKey: ['bonus-hunts'], queryFn: getBonusHuntsApi });
  const sessions = data?.data?.data || [];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Bonus Hunt</h1>
      {sessions.length === 0 ? (
        <div className="empty-state"><p>Henüz bonus hunt oturumu yok.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sessions.map((s) => (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s.title}</h3>
                <span className={`badge badge--${s.status === 'completed' ? 'success' : 'warning'}`}>
                  {s.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                {s.startAmount > 0 && (
                  <div><p style={{ fontSize: 11, color: '#8a8fa8' }}>Başlangıç</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{s.startAmount.toLocaleString('tr-TR')} ₺</p></div>
                )}
                {s.totalWin > 0 && (
                  <div><p style={{ fontSize: 11, color: '#8a8fa8' }}>Toplam Kazanç</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#00e257' }}>{s.totalWin.toLocaleString('tr-TR')} ₺</p></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BonusHunt;
