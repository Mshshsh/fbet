import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTicketsApi, enterTicketApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

const Biletler = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [message, setMessage] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['tickets'], queryFn: getTicketsApi });
  const tickets = data?.data?.data || [];

  const enterMutation = useMutation({
    mutationFn: (id) => enterTicketApi(id, { quantity: 1 }),
    onSuccess: () => {
      setMessage('✅ Çekilişe katıldınız!');
      qc.invalidateQueries(['tickets']);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err) => {
      setMessage(`❌ ${err.response?.data?.error || 'Hata oluştu'}`);
      setTimeout(() => setMessage(''), 3000);
    },
  });

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Biletler & Çekilişler</h1>
      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 16,
          background: 'rgba(255,255,255,0.05)',
          color: message.startsWith('✅') ? '#00e257' : '#ff6b6b', fontSize: 14,
        }}>{message}</div>
      )}
      {tickets.length === 0 ? (
        <div className="empty-state"><p>Aktif çekiliş bulunmuyor.</p></div>
      ) : (
        <div className="grid-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ticket.imageUrl && (
                <img src={ticket.imageUrl} alt={ticket.title}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{ticket.title}</h3>
              {ticket.prize && (
                <p style={{ fontSize: 13, color: '#ffc107' }}>🎁 Ödül: {ticket.prize}</p>
              )}
              {ticket.description && (
                <p style={{ fontSize: 12, color: '#8a8fa8' }}>{ticket.description}</p>
              )}
              {ticket.drawDate && (
                <p style={{ fontSize: 12, color: '#8a8fa8' }}>
                  📅 Çekiliş: {new Date(ticket.drawDate).toLocaleDateString('tr-TR')}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#00e257', fontWeight: 600 }}>
                  {ticket.ticketCost > 0 ? `${ticket.ticketCost} ⭐ / Bilet` : 'Ücretsiz'}
                </span>
              </div>
              {user ? (
                <button
                  className="btn-primary"
                  onClick={() => enterMutation.mutate(ticket.id)}
                  disabled={enterMutation.isPending}
                >
                  Katıl
                </button>
              ) : (
                <button className="btn-secondary" disabled>Giriş Yapın</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Biletler;
