import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../api';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      const { token, user } = res.data.data;
      if (user.role !== 'admin' && user.role !== 'moderator') {
        setError('Bu panele erişim yetkiniz yok.');
        setLoading(false);
        return;
      }
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card card">

        {/* Logo */}
        <div className="admin-login-logo">
          <img
            src={`${API_BASE}/uploads/logos.png`}
            alt="Jackpot Brothers"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="admin-login-logo__text">Jackpot Brothers</div>
          <div className="admin-login-logo__sub">Yönetim Paneli</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@jackpotbrothers.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: 4 }}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>

        <p className="admin-login-hint">Sadece yetkili personel girebilir.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
