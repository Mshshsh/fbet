import React from 'react';
import { VIP_LEVELS, VIP_THRESHOLDS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const VIP = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1 className="page-title">VIP Sistemi</h1>
      {user && (
        <div className="card" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 14, color: '#8a8fa8', marginBottom: 8 }}>Mevcut Puan</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#00e257' }}>
            {user.points?.toLocaleString('tr-TR')} ⭐
          </p>
          <p style={{ fontSize: 13, color: '#8a8fa8', marginTop: 8 }}>
            Seviye: <strong style={{ color: '#fff' }}>
              {VIP_LEVELS[user.vipLevel]?.label || 'Üye'}
            </strong>
          </p>
        </div>
      )}
      <div className="grid-3">
        {[1,2,3,4,5].map((level) => {
          const vip = VIP_LEVELS[level];
          const threshold = VIP_THRESHOLDS[level];
          const isActive = user && user.vipLevel >= level;
          return (
            <div
              key={level}
              className="card"
              style={{
                borderColor: isActive ? vip.color : '#343944',
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: vip.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, flexShrink: 0,
                }}>💎</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: vip.color }}>{vip.label}</h3>
                  <p style={{ fontSize: 12, color: '#8a8fa8' }}>Seviye {level}</p>
                </div>
                {isActive && <span className="badge badge--success" style={{ marginLeft: 'auto' }}>Aktif</span>}
              </div>
              <p style={{ fontSize: 13, color: '#8a8fa8' }}>
                Gerekli Puan: <strong style={{ color: '#fff' }}>{threshold.toLocaleString('tr-TR')}</strong>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VIP;
