import React from 'react';
import Avatar from '../common/Avatar/Avatar';
import VIPBadge from '../common/VIPBadge/VIPBadge';
import RoleBadge from '../common/RoleBadge/RoleBadge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ChatMessage = ({ message }) => {
  const { user, content, createdAt, isDeleted } = message;
  if (isDeleted) return null;
  if (!user) return null;

  const time = format(new Date(createdAt), 'HH:mm', { locale: tr });

  // @mention'ları link gibi göster
  const renderContent = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith('@') ? (
        <span key={i} style={{ color: '#00e257', fontWeight: 600 }}>{part}</span>
      ) : part
    );
  };

  return (
    <div className="chat-message" style={{ background: `linear-gradient(to right, ${user.color}1e, transparent)` }}>
      <Avatar
        avatarCategory={user.avatarCategory}
        avatarNumber={user.avatarNumber}
        vipLevel={user.vipLevel}
        size={32}
      />
      <div className="chat-message__content">
        <div className="chat-message__top">
          <strong style={{ color: user.color }}>{user.username}</strong>
          <RoleBadge role={user.role} />
          <VIPBadge level={user.vipLevel} />
          <small className="chat-message__time">{time}</small>
        </div>
        <div className="chat-message__text">{renderContent(content)}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
