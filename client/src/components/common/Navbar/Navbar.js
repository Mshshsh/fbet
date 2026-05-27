import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginModal from '../../auth/LoginModal';
import RegisterModal from '../../auth/RegisterModal';
import Avatar from '../Avatar/Avatar';
import './Navbar.css';

const eventsDropdownItems = [
  { to: '/games',       label: 'Oyunlar',           icon: '🎮' },
  { to: '/turnuva',     label: 'Spartans Turnuvası', icon: '⚔️' },
  { to: '/turnuvalar',  label: 'Tüm Turnuvalar',     icon: '🏆' },
  { to: '/biletler',    label: 'Biletler & Çekiliş', icon: '🎟' },
  { to: '/etkinlikler', label: 'Etkinlikler',         icon: '📅' },
  { to: '/ozeloran',   label: 'Özel Oranlar',        icon: '⚡' },
  { to: '/bonus-buy',   label: 'Bonus Buy',           icon: '💰' },
  { to: '/bonus-hunts', label: 'Bonus Hunt',          icon: '🎰' },
];

// Dışarı tıklamayı algıla
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
  const [showLogin, setShowLogin]       = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [eventsOpen, setEventsOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useOutsideClick(dropdownRef, () => setEventsOpen(false));
  useOutsideClick(userMenuRef, () => setUserMenuOpen(false));

  const closeAll = () => { setEventsOpen(false); setMobileOpen(false); };

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">

          {/* ── Logo ── */}
          <div className="navbar__left">
            <Link to="/" className="navbar__logo">
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/logos.png`}
                alt="Jackpot Brothers"
                className="navbar__logo-img"
              />
            </Link>
            <button
              className={`navbar__burger ${mobileOpen ? 'navbar__burger--open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>

          {/* ── Nav ── */}
          <nav className={`navbar__nav ${mobileOpen ? 'navbar__nav--open' : ''}`}>
            <NavLink to="/"          end className="nav-link" onClick={closeAll}>Anasayfa</NavLink>
            <NavLink to="/sponsorlar"    className="nav-link" onClick={closeAll}>Sponsorlar</NavLink>
            <NavLink to="/yayin"         className="nav-link" onClick={closeAll}>Yayın</NavLink>
            <NavLink to="/gorevler"      className="nav-link" onClick={closeAll}>Görevler</NavLink>
            <NavLink to="/vip"           className="nav-link" onClick={closeAll}>VIP</NavLink>
            <NavLink to="/market"        className="nav-link" onClick={closeAll}>Market</NavLink>

            {/* ── Etkinlikler Dropdown ── */}
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className={`nav-link nav-link--dropdown ${eventsOpen ? 'nav-link--active-dropdown' : ''}`}
                onClick={() => setEventsOpen(!eventsOpen)}
                aria-expanded={eventsOpen}
              >
                Etkinlikler
                <span className={`chevron ${eventsOpen ? 'chevron--up' : ''}`}>▾</span>
              </button>

              {eventsOpen && (
                <div className="dropdown-menu">
                  {/* Boşluk köprüsü — fare geçişinde kapanmayı önler */}
                  <div className="dropdown-bridge" />
                  <div className="dropdown-inner">
                    {eventsDropdownItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-item--active' : ''}`}
                        onClick={closeAll}
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

          {/* ── Sağ: kullanıcı / giriş ── */}
          <div className="navbar__right">
            {user ? (
              <div className="user-menu" ref={userMenuRef} onClick={() => setUserMenuOpen(!userMenuOpen)}>
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
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}>
                      🚪 Çıkış Yap
                    </button>
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
