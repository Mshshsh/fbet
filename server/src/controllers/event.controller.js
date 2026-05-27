const { Event } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { isActive: true }, order: [['startDate', 'ASC']] });
    return success(res, events);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};
const listAll = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['createdAt', 'DESC']] });
    return success(res, events);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};
const getOne = async (req, res) => {
  try {
    const e = await Event.findByPk(req.params.id);
    if (!e) return error(res, 'Etkinlik bulunamadı.', 404);
    return success(res, e);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};
const create = async (req, res) => {
  try { return success(res, await Event.create(req.body), 201); }
  catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const update = async (req, res) => {
  try {
    const e = await Event.findByPk(req.params.id);
    if (!e) return error(res, 'Etkinlik bulunamadı.', 404);
    await e.update(req.body);
    return success(res, e);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const remove = async (req, res) => {
  try {
    const e = await Event.findByPk(req.params.id);
    if (!e) return error(res, 'Etkinlik bulunamadı.', 404);
    await e.destroy();
    return success(res, { deleted: true });
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
module.exports = { list, listAll, getOne, create, update, remove };
