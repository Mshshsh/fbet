import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const ChatInput = () => {
  const { user } = useAuth();
  const { sendMessage } = useChat();
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    sendMessage(trimmed);
    setText('');
    setShowEmoji(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmoji = (emojiData) => {
    const cursor = inputRef.current?.selectionStart ?? text.length;
    const newText = text.slice(0, cursor) + emojiData.emoji + text.slice(cursor);
    setText(newText);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  if (!user) {
    return (
      <div className="chat-input chat-input--disabled">
        <input disabled placeholder="Chate katılmak için giriş sağlayın." />
      </div>
    );
  }

  return (
    <div className="chat-input">
      {showEmoji && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={handleEmoji}
            theme="dark"
            height={350}
            width="100%"
            searchDisabled
          />
        </div>
      )}
      <div className="chat-input__row">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Mesaj yaz..."
          maxLength={500}
        />
        <button
          className="emoji-btn"
          onClick={() => setShowEmoji(!showEmoji)}
          type="button"
        >
          😊
        </button>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim()}
          type="button"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
