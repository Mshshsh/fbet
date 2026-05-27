import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBonusBuysApi } from '../../api';

const BonusBuy = () => {
  const { data, isLoading } = useQuery({ queryKey: ['bonus-buys'], queryFn: getBonusBuysApi });
  const items = data?.data?.data || [];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Bonus Buy</h1>
      {items.length === 0 ? (
        <div className="empty-state"><p>Henüz kayıt yok.</p></div>
      ) : (
        <div className="grid-3">
          {items.map((b) => (
            <div key={b.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {b.imageUrl && (
                <img src={b.imageUrl} alt={b.gameName}
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{b.gameName}</h3>
              {b.gameProvider && <p style={{ fontSize: 12, color: '#8a8fa8' }}>{b.gameProvider}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {b.buyAmount && (
                  <div className="card" style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: 10, color: '#8a8fa8' }}>Alış</p>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{b.buyAmount.toLocaleString('tr-TR')} ₺</p>
                  </div>
                )}
                {b.multiplier && (
                  <div className="card" style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: 10, color: '#8a8fa8' }}>Çarpan</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#ffc107' }}>{b.multiplier}x</p>
                  </div>
                )}
                {b.winAmount && (
                  <div className="card" style={{ padding: '8px 10px', gridColumn: '1/-1' }}>
                    <p style={{ fontSize: 10, color: '#8a8fa8' }}>Kazanç</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#00e257' }}>{b.winAmount.toLocaleString('tr-TR')} ₺</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BonusBuy;
