import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginModal from '../../auth/LoginModal';
import RegisterModal from '../../auth/RegisterModal';
import Avatar from '../Avatar/Avatar';
import './Navbar.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Desktop dropdown items
const eventsDropdownItems = [
  { to: '/games',       label: 'Oyunlar',           icon: '🎮' },
  { to: '/turnuva',     label: 'Spartans Turnuvası', icon: '⚔️' },
  { to: '/turnuvalar',  label: 'Tüm Turnuvalar',     icon: '🏆' },
  { to: '/biletler',    label: 'Biletler & Çekiliş', icon: '🎟' },
  { to: '/etkinlikler', label: 'Etkinlikler',        icon: '📅' },
  { to: '/ozeloran',    label: 'Özel Oranlar',       icon: '⚡' },
  { to: '/bonus-buy',   label: 'Bonus Buy',          icon: '💰' },
  { to: '/bonus-hunts', label: 'Bonus Hunt',         icon: '🎰' },
  { to: '/cark',        label: 'Şans Çarkı',         icon: '🎡' },
];

// Mobile bottom bar — 5 item (middle is featured)
const bottomNavItems = [
  { to: '/',          label: 'Ana',    icon: '🏠', exact: true },
  { to: '/gorevler',  label: 'Görevler', icon: '✅' },
  { to: '/cark',      label: 'Çark',   icon: '🎡', featured: true },
  { to: '/vip',       label: 'VIP',    icon: '💎' },
  { to: null,         label: 'Menü',   icon: '☰',  drawer: true },
];

// Mobile drawer — all remaining pages
const drawerItems = [
  { to: '/sponsorlar',  label: 'Sponsorlar',        icon: '🤝' },
  { to: '/yayin',       label: 'Canlı Yayın',       icon: '📺' },
  { to: '/market',      label: 'Market',            icon: '🛒' },
  { to: '/games',       label: 'Oyunlar',           icon: '🎮' },
  { to: '/turnuva',     label: 'Spartans Turnuvası', icon: '⚔️' },
  { to: '/turnuvalar',  label: 'Tüm Turnuvalar',    icon: '🏆' },
  { to: '/biletler',    label: 'Biletler & Çekiliş', icon: '🎟' },
  { to: '/etkinlikler', label: 'Etkinlikler',       icon: '📅' },
  { to: '/ozeloran',    label: 'Özel Oranlar',      icon: '⚡' },
  { to: '/bonus-buy',   label: 'Bonus Buy',         icon: '💰' },
  { to: '/bonus-hunts', label: 'Bonus Hunt',        icon: '🎰' },
];

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [showLogin, setShowLogin]       = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [eventsOpen, setEventsOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useOutsideClick(dropdownRef, () => setEventsOpen(false));
  useOutsideClick(userMenuRef, () => setUserMenuOpen(false));

  // Drawer kapatma — route değişince
  useEffect(() => { setDrawerOpen(false); }, [location]);

  return (
    <>
      {/* ══════════════════════ TOP NAVBAR ══════════════════════ */}
      <header className="navbar">
        <div className="navbar__inner">

          {/* Logo */}
          <div className="navbar__left">
            <Link to="/" className="navbar__logo">
              <img src={`${API_BASE}/uploads/logos.png`} alt="Jackpot Brothers" className="navbar__logo-img" />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="navbar__nav">
            <NavLink to="/" end className="nav-link">Anasayfa</NavLink>
            <NavLink to="/sponsorlar" className="nav-link">Sponsorlar</NavLink>
            <NavLink to="/yayin"      className="nav-link">Yayın</NavLink>
            <NavLink to="/gorevler"   className="nav-link">Görevler</NavLink>
            <NavLink to="/vip"        className="nav-link">VIP</NavLink>
            <NavLink to="/market"     className="nav-link">Market</NavLink>

            {/* Etkinlikler dropdown */}
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className={`nav-link nav-link--dropdown ${eventsOpen ? 'nav-link--active-dropdown' : ''}`}
                onClick={() => setEventsOpen(v => !v)}
              >
                Etkinlikler
                <span className={`chevron ${eventsOpen ? 'chevron--up' : ''}`}>▾</span>
              </button>
              {eventsOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-bridge" />
                  <div className="dropdown-inner">
                    {eventsDropdownItems.map(item => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-item--active' : ''}`}
                        onClick={() => setEventsOpen(false)}
                      >
                        <span className="dropdown-item__icon">{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: user / auth */}
          <div className="navbar__right">
            {user ? (
              <div className="user-menu" ref={userMenuRef} onClick={() => setUserMenuOpen(v => !v)}>
                <Avatar
                  avatarCategory={user.avatarCategory}
                  avatarNumber={user.avatarNumber}
                  vipLevel={user.vipLevel}
                  size={32}
                />
                <div className="user-menu__info">
                  <span className="user-menu__name">{user.username}</span>
                  <span className="user-menu__points">⭐ {user.points?.toLocaleString('tr-TR') ?? 0}</span>
                </div>
                <span className={`chevron ${userMenuOpen ? 'chevron--up' : ''}`} style={{ fontSize: 10, color: '#5a4e38' }}>▾</span>

                {userMenuOpen && (
                  <div className="user-menu__dropdown">
                    <div className="user-menu__dropdown-header">
                      <span style={{ fontSize: 13, color: '#e8dcc8', fontWeight: 600 }}>{user.username}</span>
                      <span style={{ fontSize: 11, color: '#c9a84c' }}>{user.email}</span>
                    </div>
                    <div className="user-menu__dropdown-divider" />
                    <NavLink to={`/profil/${user.username}`} className="user-menu__dropdown-link" onClick={() => setUserMenuOpen(false)}>
                      👤 Profilim
                    </NavLink>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}>🚪 Çıkış Yap</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth">
                <button className="btn-outline" onClick={() => setShowLogin(true)}>Giriş Yap</button>
                <button className="btn-primary-sm" onClick={() => setShowRegister(true)}>Kayıt Ol</button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ══════════════════════ MOBILE BOTTOM NAV ══════════════════════ */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item, i) => {
          if (item.drawer) {
            return (
              <button
                key={i}
                className={`mbn-item ${drawerOpen ? 'mbn-item--active' : ''}`}
                onClick={() => setDrawerOpen(v => !v)}
              >
                <span className="mbn-icon">{item.icon}</span>
                <span className="mbn-label">{item.label}</span>
              </button>
            );
          }
          if (item.featured) {
            return (
              <NavLink
                key={i}
                to={item.to}
                className="mbn-item mbn-item--featured"
                end={item.exact}
              >
                <span className="mbn-featured-circle">{item.icon}</span>
                <span className="mbn-label">{item.label}</span>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={i}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `mbn-item${isActive ? ' mbn-item--active' : ''}`}
            >
              <span className="mbn-icon">{item.icon}</span>
              <span className="mbn-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ══════════════════════ MOBILE DRAWER ══════════════════════ */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer__handle" />

            {/* Kullanıcı bilgisi */}
            {user ? (
              <div className="mobile-drawer__user">
                <Avatar avatarCategory={user.avatarCategory} avatarNumber={user.avatarNumber} vipLevel={user.vipLevel} size={40} />
                <div>
                  <div style={{ fontWeight: 700, color: '#e8dcc8', fontSize: 14 }}>{user.username}</div>
                  <div style={{ color: '#c9a84c', fontSize: 12 }}>⭐ {user.points?.toLocaleString('tr-TR') ?? 0} puan</div>
                </div>
              </div>
            ) : (
              <div className="mobile-drawer__auth">
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => { setDrawerOpen(false); setShowLogin(true); }}>Giriş Yap</button>
                <button className="btn-primary-sm" style={{ flex: 1 }} onClick={() => { setDrawerOpen(false); setShowRegister(true); }}>Kayıt Ol</button>
              </div>
            )}

            <div className="mobile-drawer__divider" />

            {/* Linkler */}
            <div className="mobile-drawer__links">
              {drawerItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `mobile-drawer__link${isActive ? ' mobile-drawer__link--active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="mobile-drawer__link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mobile-drawer__divider" />

            {user && (
              <button
                className="mobile-drawer__logout"
                onClick={() => { logout(); setDrawerOpen(false); }}
              >
                🚪 Çıkış Yap
              </button>
            )}
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
      />
    </>
  );
};

export default Navbar;
