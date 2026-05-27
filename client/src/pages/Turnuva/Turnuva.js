import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTournamentsApi } from '../../api';

const Turnuva = () => {
  const { data, isLoading } = useQuery({ queryKey: ['tournaments'], queryFn: getTournamentsApi });
  const tournaments = data?.data?.data || [];
  // Spartans turnuvası
  const spartans = tournaments.find((t) => t.type === 'spartans-cevrim') || tournaments[0];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;
  if (!spartans) return (
    <div className="page-container">
      <h1 className="page-title">Spartans Çevrim Turnuvası</h1>
      <div className="empty-state"><p>Henüz aktif turnuva yok.</p></div>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Spartans Çevrim Turnuvası</h1>
      <div className="card" style={{ marginBottom: 24 }}>
        {spartans.imageUrl && (
          <img src={spartans.imageUrl} alt={spartans.name}
            style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
        )}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{spartans.name}</h2>
        {spartans.prizePool && (
          <p style={{ fontSize: 15, color: '#00e257', fontWeight: 600, marginBottom: 8 }}>
            🏆 Ödül Havuzu: {spartans.prizePool}
          </p>
        )}
        {spartans.description && (
          <p style={{ fontSize: 13, color: '#8a8fa8', lineHeight: 1.6 }}>{spartans.description}</p>
        )}
        <span className={`badge badge--${spartans.status === 'active' ? 'success' : 'info'}`} style={{ marginTop: 12 }}>
          {spartans.status === 'active' ? '🟢 Aktif' : spartans.status === 'upcoming' ? '⏳ Yakında' : '✔️ Tamamlandı'}
        </span>
      </div>
    </div>
  );
};

export default Turnuva;
