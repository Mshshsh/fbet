import React, { useEffect, useState } from 'react';
import { getUsersApi } from '../../api';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    getUsersApi({ limit: 1 }).then((res) => {
      setTotalUsers(res.data.data?.total || 0);
    }).catch(() => {});

    const token = localStorage.getItem('fbet_admin_token');
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socket.on('presence:count', ({ count }) => setOnlineCount(count));
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#00e257' }}>{onlineCount}</div>
          <div className="stat-card__label">Çevrimiçi Kullanıcı</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#3b82f6' }}>{totalUsers.toLocaleString('tr-TR')}</div>
          <div className="stat-card__label">Toplam Kayıtlı</div>
        </div>
      </div>
      <div className="card">
        <p style={{ fontSize: 14, color: '#8a8fa8' }}>
          Sol menüden yönetmek istediğiniz bölüme gidin.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
