import React from 'react';
import { VIP_LEVELS } from '../../../constants';
import './VIPBadge.css';

const VIPBadge = ({ level }) => {
  const vip = VIP_LEVELS[level];
  if (!vip || !vip.label) return null;
  return (
    <span className={`vip-badge ${vip.ringClass}`} style={{ borderColor: vip.color, color: vip.color }}>
      {vip.label}
    </span>
  );
};

export default VIPBadge;
