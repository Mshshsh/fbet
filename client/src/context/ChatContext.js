import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSocket } from '../socket/socket';
import { getChatMessagesApi, getPinnedMessageApi } from '../api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tarihsel mesajları yükle
    getChatMessagesApi().then((res) => {
      setMessages(res.data.data || []);
    }).catch(() => {});

    getPinnedMessageApi().then((res) => {
      setPinnedMessage(res.data.data);
    }).catch(() => {});

    const socket = getSocket();

    socket.on('message:new', (msg) => {
      setMessages((prev) => [...prev.slice(-99), msg]); // max 100
    });

    socket.on('message:deleted', ({ id }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isDeleted: true } : m))
      );
    });

    socket.on('message:pinned', ({ content }) => {
      setPinnedMessage({ content });
    });

    socket.on('message:unpinned', () => {
      setPinnedMessage(null);
    });

    socket.on('presence:count', ({ count }) => {
      setOnlineCount(count);
    });

    return () => {
      socket.off('message:new');
      socket.off('message:deleted');
      socket.off('message:pinned');
      socket.off('message:unpinned');
      socket.off('presence:count');
    };
  }, []);

  const sendMessage = (content) => {
    const socket = getSocket();
    socket.emit('message:send', { content });
  };

  return (
    <ChatContext.Provider value={{
      messages,
      onlineCount,
      pinnedMessage,
      isOpen,
      setIsOpen,
      sendMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
