const { User } = require('../models');
const { syncVipLevel } = require('./vip.service');

/**
 * Kullanıcıya puan ekler ve VIP seviyesini günceller.
 */
const addPoints = async (userId, amount) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Kullanıcı bulunamadı.');
  user.points = (user.points || 0) + amount;
  await user.save();
  await syncVipLevel(user);
  return user.points;
};

/**
 * Kullanıcıdan puan düşer. Yetersiz puan varsa hata fırlatır.
 */
const deductPoints = async (userId, amount) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Kullanıcı bulunamadı.');
  if (user.points < amount) throw new Error('Yetersiz puan bakiyesi.');
  user.points = user.points - amount;
  await user.save();
  return user.points;
};

module.exports = { addPoints, deductPoints };
