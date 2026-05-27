// socketId → userId
const onlineUsers = new Map();

const registerPresenceHandlers = (io, socket) => {
  // Kullanıcı bağlandığında
  const userId = socket.data.user?.id || null;
  onlineUsers.set(socket.id, userId);
  broadcastOnlineCount(io);

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    broadcastOnlineCount(io);
  });
};

const broadcastOnlineCount = (io) => {
  const count = onlineUsers.size;
  io.emit('presence:count', { count });
};

const getOnlineCount = () => onlineUsers.size;

module.exports = { registerPresenceHandlers, broadcastOnlineCount, getOnlineCount };
