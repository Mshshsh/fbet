import React from 'react';
import './RoleBadge.css';

const RoleBadge = ({ role }) => {
  if (!role || role === 'user') return null;
  return (
    <span className={`role-badge role-badge--${role}`}>
      {role === 'moderator' ? 'moderator' : 'admin'}
    </span>
  );
};

export default RoleBadge;
