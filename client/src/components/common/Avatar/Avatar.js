import React from 'react';
import { VIP_LEVELS } from '../../../constants';
import './Avatar.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Avatar = ({ avatarCategory = 1, avatarNumber = 1, vipLevel = 0, color, size = 36 }) => {
  const vip = VIP_LEVELS[vipLevel] || VIP_LEVELS[0];
  const ringStyle = vip.color ? { borderColor: vip.color, boxShadow: `0 0 0 2px ${vip.color}` } : {};

  return (
    <div className="avatar-wrapper" style={{ width: size, height: size }}>
      <img
        src={`${API_URL}/uploads/avatars/${avatarCategory}/${avatarNumber}.jpg`}
        alt="avatar"
        className={`avatar-img ${vip.ringClass || ''}`}
        style={{ borderColor: color || vip.color, ...ringStyle }}
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?background=random&name=U&size=${size}`;
        }}
      />
      {vipLevel > 0 && <span className={`vip-ring ${vip.ringClass}`} />}
    </div>
  );
};

export default Avatar;
