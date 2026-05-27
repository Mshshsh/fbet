import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMarketItemsApi, purchaseItemApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

const Market = () => {
  const { user, updateUser } = useAuth();
  const qc = useQueryClient();
  const [message, setMessage] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['market-items'], queryFn: getMarketItemsApi });
  const items = data?.data?.data || [];

  const purchaseMutation = useMutation({
    mutationFn: (id) => purchaseItemApi(id),
    onSuccess: (res) => {
      setMessage('✅ Satın alma başarılı! Kısa süre içinde teslim edilecek.');
      qc.invalidateQueries(['market-items']);
      setTimeout(() => setMessage(''), 4000);
    },
    onError: (err) => {
      setMessage(`❌ ${err.response?.data?.error || 'Hata oluştu'}`);
      setTimeout(() => setMessage(''), 3000);
    },
  });

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Market</h1>
        {user && (
          <span style={{ fontSize: 14, color: '#00e257', fontWeight: 600 }}>
            Bakiye: {user.points?.toLocaleString('tr-TR')} ⭐
          </span>
        )}
      </div>
      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14,
          background: 'rgba(255,255,255,0.05)',
          color: message.startsWith('✅') ? '#00e257' : '#ff6b6b',
        }}>
          {message}
        </div>
      )}
      {items.length === 0 ? (
        <div className="empty-state"><p>Şu an market boş.</p></div>
      ) : (
        <div className="grid-4">
          {items.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name}
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</h3>
              {item.description && <p style={{ fontSize: 12, color: '#8a8fa8' }}>{item.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#00e257' }}>
                  {item.pointCost} ⭐
                </span>
                {item.stock !== -1 && (
                  <span style={{ fontSize: 11, color: '#8a8fa8' }}>Stok: {item.stock}</span>
                )}
              </div>
              {user ? (
                <button
                  className="btn-primary"
                  onClick={() => purchaseMutation.mutate(item.id)}
                  disabled={purchaseMutation.isPending || (user.points < item.pointCost) || item.stock === 0}
                >
                  {item.stock === 0 ? 'Stok Yok' :
                   user.points < item.pointCost ? 'Yetersiz Puan' : 'Satın Al'}
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

export default Market;
