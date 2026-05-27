const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { registerChatHandlers } = require('./chat.socket');
const { registerPresenceHandlers } = require('./presence.socket');

const initSocket = (io) => {
  // JWT doğrulama middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
          attributes: ['id', 'username', 'role', 'vipLevel', 'avatarCategory', 'avatarNumber', 'color', 'isBanned', 'isMuted'],
        });
        if (user && !user.isBanned) {
          socket.data.user = user.toJSON();
        }
      } catch {
        // Token geçersizse bağlantıya devam et ama user null
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    // Chat odasına kat
    socket.join('chat');

    // Admin ise admin odasına da kat
    if (socket.data.user?.role === 'admin') {
      socket.join('admin');
    }

    registerChatHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    // Admin: mesaj sil eventi
    socket.on('admin:deleteMessage', (data) => {
      if (socket.data.user?.role !== 'admin' && socket.data.user?.role !== 'moderator') return;
      io.to('chat').emit('message:deleted', { id: data.id });
    });

    // Admin: pin eventi
    socket.on('admin:pinMessage', (data) => {
      if (socket.data.user?.role !== 'admin' && socket.data.user?.role !== 'moderator') return;
      io.to('chat').emit('message:pinned', { content: data.content });
    });

    socket.on('admin:unpin', () => {
      if (socket.data.user?.role !== 'admin' && socket.data.user?.role !== 'moderator') return;
      io.to('chat').emit('message:unpinned');
    });
  });
};

module.exports = { initSocket };
