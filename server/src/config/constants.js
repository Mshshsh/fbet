const VIP_LEVELS = {
  0: { name: 'Yok', label: null, color: null },
  1: { name: 'Bronz', label: 'Bronz', color: '#CD7F32', ringClass: 'vip-bronz' },
  2: { name: 'Gümüş', label: 'Gümüş', color: '#C0C0C0', ringClass: 'vip-gumus' },
  3: { name: 'Altın', label: 'Altın', color: '#FFD700', ringClass: 'vip-altin' },
  4: { name: 'Platin', label: 'Platin', color: '#E5E4E2', ringClass: 'vip-platin' },
  5: { name: 'Elmas', label: 'Elmas', color: '#B9F2FF', ringClass: 'vip-elmas' },
};

// Points thresholds to auto-upgrade VIP
const VIP_THRESHOLDS = {
  1: 100,
  2: 500,
  3: 2000,
  4: 5000,
  5: 15000,
};

const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

const AVATAR_CATEGORIES = 2;   // /avatars/1/ and /avatars/2/
const AVATAR_PER_CATEGORY = 10; // /avatars/1/1.jpg ... /avatars/1/10.jpg

const CHAT_MESSAGE_MAX_LENGTH = 500;
const CHAT_HISTORY_LIMIT = 50;
const CHAT_RATE_LIMIT_WINDOW_MS = 2000; // 2 seconds between messages

module.exports = {
  VIP_LEVELS,
  VIP_THRESHOLDS,
  ROLES,
  AVATAR_CATEGORIES,
  AVATAR_PER_CATEGORY,
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_HISTORY_LIMIT,
  CHAT_RATE_LIMIT_WINDOW_MS,
};
