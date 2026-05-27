import React, { useState } from 'react';
import Modal from '../common/Modal/Modal';
import AvatarPicker from './AvatarPicker';
import { registerApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState({ cat: 1, num: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Şifre en az 6 karakter olmalıdır.');
    setLoading(true);
    try {
      const res = await registerApi({
        ...form,
        avatarCategory: avatar.cat,
        avatarNumber: avatar.num,
      });
      login(res.data.data.token, res.data.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kayıt Ol" width={520}>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label>Kullanıcı Adı</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="kullaniciadi"
            required
            minLength={3}
            maxLength={20}
          />
        </div>
        <div className="form-group">
          <label>E-posta</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ornek@mail.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Şifre</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="En az 6 karakter"
            required
          />
        </div>
        <AvatarPicker selected={avatar} onSelect={(a) => setAvatar(a)} />
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>
        <p className="auth-switch">
          Zaten hesabın var mı?{' '}
          <button type="button" onClick={onSwitchToLogin}>Giriş Yap</button>
        </p>
      </form>
    </Modal>
  );
};

export default RegisterModal;
