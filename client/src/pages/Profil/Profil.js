import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '../../components/common/Avatar/Avatar';
import VIPBadge from '../../components/common/VIPBadge/VIPBadge';
import RoleBadge from '../../components/common/RoleBadge/RoleBadge';
import './Profil.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VIP_NAMES = ['', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas'];

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Profil() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API_BASE}/api/users/profile/${username}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setProfile(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="profil-loading">Yükleniyor...</div>;
  if (notFound) return <div className="profil-not-found">Kullanıcı bulunamadı.</div>;

  return (
    <div className="profil-page page-container">
      <div className="profil-card">
        {/* Header */}
        <div className="profil-header">
          <div className="profil-avatar-wrap">
            <Avatar
              category={profile.avatarCategory}
              number={profile.avatarNumber}
              vipLevel={profile.vipLevel}
              size={96}
            />
          </div>
          <div className="profil-identity">
            <div className="profil-username" style={{ color: profile.color }}>
              {profile.username}
            </div>
            <div className="profil-badges">
              {profile.vipLevel > 0 && <VIPBadge level={profile.vipLevel} />}
              {(profile.role === 'admin' || profile.role === 'moderator') && (
                <RoleBadge role={profile.role} />
              )}
            </div>
            <div className="profil-join">
              Katılım: {formatDate(profile.createdAt)}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="profil-stats">
          <div className="profil-stat">
            <div className="profil-stat__value">{profile.points ?? 0}</div>
            <div className="profil-stat__label">Puan</div>
          </div>
          <div className="profil-stat">
            <div className="profil-stat__value">{profile.vipLevel > 0 ? VIP_NAMES[profile.vipLevel] : 'Yok'}</div>
            <div className="profil-stat__label">VIP Seviye</div>
          </div>
          <div className="profil-stat">
            <div className="profil-stat__value">{profile.spinCount ?? 0}</div>
            <div className="profil-stat__label">Çark Çevirme</div>
          </div>
          <div className="profil-stat">
            <div className="profil-stat__value">{profile.totalSpinReward ?? 0}</div>
            <div className="profil-stat__label">Çarktan Kazanılan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
