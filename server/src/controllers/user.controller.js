const { User, SpinHistory } = require('../models');
const { success, error } = require('../utils/apiResponse');
const { getPagination, getPagingData } = require('../utils/paginate');

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    return success(res, user);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: { exclude: ['password', 'email'] },
    });
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);

    const spinCount = await SpinHistory.count({ where: { userId: user.id } });
    const totalSpinReward = await SpinHistory.sum('reward', { where: { userId: user.id } }) || 0;

    return success(res, { ...user.toJSON(), spinCount, totalSpinReward });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatarCategory, avatarNumber } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    user.avatarCategory = avatarCategory;
    user.avatarNumber = avatarNumber;
    await user.save();
    return success(res, { avatarCategory, avatarNumber });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const { limit: lim, offset } = getPagination(page, limit);
    const where = {};
    if (search) {
      const { Op } = require('sequelize');
      where.username = { [Op.like]: `%${search}%` };
    }
    const { rows, count } = await User.findAndCountAll({
      where,
      limit: lim,
      offset,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    return success(res, getPagingData(rows, count, page, lim));
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const setRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    if (!['user', 'moderator', 'admin'].includes(role))
      return error(res, 'Geçersiz rol.', 400);
    user.role = role;
    await user.save();
    return success(res, { id: user.id, role: user.role });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const setBan = async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    user.isBanned = !!isBanned;
    await user.save();
    return success(res, { id: user.id, isBanned: user.isBanned });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const setPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    user.points = points;
    await user.save();
    return success(res, { id: user.id, points: user.points });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const setVip = async (req, res) => {
  try {
    const { vipLevel } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    user.vipLevel = vipLevel;
    await user.save();
    return success(res, { id: user.id, vipLevel: user.vipLevel });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { getUser, getProfile, updateAvatar, listUsers, setRole, setBan, setPoints, setVip };
