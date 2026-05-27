export const VIP_LEVELS = {
  0: { name: 'Yok', label: null, color: null },
  1: { name: 'Bronz', label: 'Bronz', color: '#CD7F32', ringClass: 'vip-bronz' },
  2: { name: 'Gümüş', label: 'Gümüş', color: '#C0C0C0', ringClass: 'vip-gumus' },
  3: { name: 'Altın', label: 'Altın', color: '#FFD700', ringClass: 'vip-altin' },
  4: { name: 'Platin', label: 'Platin', color: '#E5E4E2', ringClass: 'vip-platin' },
  5: { name: 'Elmas', label: 'Elmas', color: '#B9F2FF', ringClass: 'vip-elmas' },
};

export const VIP_THRESHOLDS = {
  1: 100,
  2: 500,
  3: 2000,
  4: 5000,
  5: 15000,
};

export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

export const AVATAR_CATEGORIES = 2;
export const AVATAR_PER_CATEGORY = 10;
