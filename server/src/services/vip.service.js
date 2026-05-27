const { VIP_THRESHOLDS } = require('../config/constants');

/**
 * Kullanıcının puan bakiyesine göre VIP seviyesini hesaplar.
 * @param {number} points
 * @returns {number} vipLevel 0-5
 */
const calculateVipLevel = (points) => {
  let level = 0;
  const thresholds = Object.entries(VIP_THRESHOLDS).sort((a, b) => b[0] - a[0]);
  for (const [lvl, threshold] of thresholds) {
    if (points >= threshold) {
      level = parseInt(lvl);
      break;
    }
  }
  return level;
};

/**
 * Kullanıcının VIP seviyesini puana göre günceller.
 * @param {User} user - Sequelize User instance
 */
const syncVipLevel = async (user) => {
  const newLevel = calculateVipLevel(user.points);
  if (newLevel !== user.vipLevel) {
    user.vipLevel = newLevel;
    await user.save();
  }
  return newLevel;
};

module.exports = { calculateVipLevel, syncVipLevel };
