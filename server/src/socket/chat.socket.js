const { Message, User } = require('../models');
const { CHAT_MESSAGE_MAX_LENGTH, CHAT_RATE_LIMIT_WINDOW_MS } = require('../config/constants');

// userId → lastMessageTime
const rateLimitMap = new Map();

const parseMentions = (content) => {
  const regex = /@(\w+)/g;
  const mentions = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

const registerChatHandlers = (io, socket) => {
  socket.on('message:send', async (data) => {
    const user = socket.data.user;
    if (!user) return socket.emit('error', { message: 'Giriş yapmalısınız.' });
    if (user.isMuted || user.isBanned) return socket.emit('error', { message: 'Mesaj gönderme yetkiniz yok.' });

    // Rate limit
    const now = Date.now();
    const last = rateLimitMap.get(user.id) || 0;
    if (now - last < CHAT_RATE_LIMIT_WINDOW_MS) {
      return socket.emit('error', { message: 'Çok hızlı mesaj gönderiyorsunuz.' });
    }
    rateLimitMap.set(user.id, now);

    const content = String(data.content || '').trim();
    if (!content || content.length > CHAT_MESSAGE_MAX_LENGTH) {
      return socket.emit('error', { message: 'Geçersiz mesaj.' });
    }

    try {
      // Güncel user bilgisini al (mute/ban kontrol için)
      const freshUser = await User.findByPk(user.id);
      if (!freshUser || freshUser.isBanned || freshUser.isMuted) {
        return socket.emit('error', { message: 'Mesaj gönderme yetkiniz yok.' });
      }

      const mentionedNames = parseMentions(content);
      const mentionIds = [];
      for (const name of mentionedNames) {
        const u = await User.findOne({ where: { username: name } });
        if (u) mentionIds.push(u.id);
      }

      const message = await Message.create({
        userId: user.id,
        content,
        mentions: mentionIds,
      });

      const fullMessage = await Message.findByPk(message.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'color', 'role', 'vipLevel', 'avatarCategory', 'avatarNumber'],
        }],
      });

      io.to('chat').emit('message:new', fullMessage);
    } catch (err) {
      console.error('Chat mesaj hatası:', err);
      socket.emit('error', { message: 'Mesaj gönderilemedi.' });
    }
  });

  socket.on('typing:start', () => {
    if (!socket.data.user) return;
    socket.to('chat').emit('typing:start', { userId: socket.data.user.id, username: socket.data.user.username });
  });

  socket.on('typing:end', () => {
    if (!socket.data.user) return;
    socket.to('chat').emit('typing:end', { userId: socket.data.user.id });
  });
};

module.exports = { registerChatHandlers };
