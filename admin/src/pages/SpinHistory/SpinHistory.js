import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function SpinHistory() {
  const { token } = useAdminAuth();
  const [data, setData] = useState({ spins: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/wheel/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Çark Geçmişi</h1>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Toplam {data.total} çevirme</span>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Kazanılan Puan</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {data.spins.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Henüz çevirme yok.</td></tr>
              )}
              {data.spins.map(s => (
                <tr key={s.id}>
                  <td style={{ color: s.user?.color || 'var(--text)', fontWeight: 600 }}>
                    {s.user?.username || s.userId}
                  </td>
                  <td>
                    <span style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>+{s.reward}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {new Date(s.createdAt).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
