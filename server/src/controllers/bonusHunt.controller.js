const { BonusHuntSession, BonusHuntSlot } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const sessions = await BonusHuntSession.findAll({ order: [['createdAt', 'DESC']] });
    return success(res, sessions);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const getOne = async (req, res) => {
  try {
    const s = await BonusHuntSession.findByPk(req.params.id, {
      include: [{ model: BonusHuntSlot, as: 'slots' }],
    });
    if (!s) return error(res, 'Oturum bulunamadı.', 404);
    return success(res, s);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const create = async (req, res) => {
  try { return success(res, await BonusHuntSession.create(req.body), 201); }
  catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const update = async (req, res) => {
  try {
    const s = await BonusHuntSession.findByPk(req.params.id);
    if (!s) return error(res, 'Oturum bulunamadı.', 404);
    await s.update(req.body);
    return success(res, s);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const addSlot = async (req, res) => {
  try {
    const slot = await BonusHuntSlot.create({ ...req.body, sessionId: req.params.id });
    // totalWin güncelle
    const session = await BonusHuntSession.findByPk(req.params.id, {
      include: [{ model: BonusHuntSlot, as: 'slots' }],
    });
    const totalWin = session.slots.reduce((sum, s) => sum + (s.winAmount || 0), 0);
    await session.update({ totalWin });
    return success(res, slot, 201);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
module.exports = { list, getOne, create, update, addSlot };
