import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatWidget.css';

const ChatWidget = () => {
  const { messages, onlineCount, pinnedMessage, isOpen, setIsOpen } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div className={`chat-widget ${isOpen ? 'chat-widget--open' : ''}`}>
      {/* Header - her zaman görünür */}
      <div className="chat-widget__header" onClick={() => setIsOpen(!isOpen)}>
        <div className="chat-widget__header-left">
          <span className="chat-widget__title">Sohbet</span>
          <span className="chat-widget__online">🟢 {onlineCount} Online</span>
        </div>
        <button className="chat-widget__toggle">{isOpen ? '▼' : '▲'}</button>
      </div>

      {/* Body - sadece açıkken görünür */}
      {isOpen && (
        <>
          {pinnedMessage && (
            <div className="chat-pinned">
              📌 {pinnedMessage.content}
            </div>
          )}
          <div className="chat-widget__messages">
            {messages.length === 0 && (
              <p className="chat-empty">Henüz mesaj yok.</p>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatWidget;
