const { Message, User, PinnedMessage } = require('../models');
const { success, error } = require('../utils/apiResponse');
const { CHAT_HISTORY_LIMIT } = require('../config/constants');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { isDeleted: false },
      order: [['createdAt', 'ASC']],
      limit: CHAT_HISTORY_LIMIT,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'color', 'role', 'vipLevel', 'avatarCategory', 'avatarNumber'],
        },
      ],
    });
    return success(res, messages);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return error(res, 'Mesaj bulunamadı.', 404);
    msg.isDeleted = true;
    msg.deletedById = req.user.id;
    await msg.save();
    return success(res, { id: msg.id });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const pinMessage = async (req, res) => {
  try {
    const { content } = req.body;
    // Önceki pinleri sil
    await PinnedMessage.destroy({ where: {} });
    const pin = await PinnedMessage.create({ content, pinnedById: req.user.id });
    return success(res, pin, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const unpinMessage = async (req, res) => {
  try {
    await PinnedMessage.destroy({ where: {} });
    return success(res, { unpinned: true });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const getPinnedMessage = async (req, res) => {
  try {
    const pin = await PinnedMessage.findOne({ order: [['createdAt', 'DESC']] });
    return success(res, pin);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const muteUser = async (req, res) => {
  try {
    const { isMuted } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    user.isMuted = !!isMuted;
    await user.save();
    return success(res, { id: user.id, isMuted: user.isMuted });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { getMessages, deleteMessage, pinMessage, unpinMessage, getPinnedMessage, muteUser };
