import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/hero-slides', label: '🖼 Hero Slider' },
  { to: '/users', label: '👥 Kullanıcılar' },
  { to: '/chat', label: '💬 Chat Moderasyon' },
  { to: '/partners', label: '🤝 Partnerler' },
  { to: '/pages', label: '📄 Sayfalar (CMS)' },
  { to: '/tasks', label: '✅ Görevler' },
  { to: '/market', label: '🛒 Market' },
  { to: '/tickets', label: '🎟 Biletler' },
  { to: '/tournaments', label: '🏆 Turnuvalar' },
  { to: '/events', label: '📅 Etkinlikler' },
  { to: '/bonus-buy', label: '💰 Bonus Buy' },
  { to: '/bonus-hunt', label: '🎰 Bonus Hunt' },
  { to: '/special-odds', label: '⚡ Özel Oranlar' },
  { to: '/stream', label: '📺 Yayın Ayarı' },
  { to: '/wins', label: '🎉 Kazananlar' },
  { to: '/point-codes',  label: '🎫 Puan Kodları' },
  { to: '/wheel-config', label: '⚙️ Çark Ayarları' },
  { to: '/spin-history', label: '🎡 Çark Geçmişi' },
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <img src={`${API_BASE}/uploads/logos.png`} alt="Jackpot Brothers" />
          <div>
            <div className="admin-sidebar__logo-text">Jackpot Brothers</div>
            <div className="admin-sidebar__logo-sub">Admin Panel</div>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{user?.username} · {user?.role}</p>
          <button className="btn-danger btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
            Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
