const { Partner } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
    });
    return success(res, partners);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const listAll = async (req, res) => {
  try {
    const partners = await Partner.findAll({ order: [['order', 'ASC']] });
    return success(res, partners);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const getOne = async (req, res) => {
  try {
    const p = await Partner.findByPk(req.params.id);
    if (!p) return error(res, 'Partner bulunamadı.', 404);
    return success(res, p);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const create = async (req, res) => {
  try {
    const p = await Partner.create(req.body);
    return success(res, p, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const update = async (req, res) => {
  try {
    const p = await Partner.findByPk(req.params.id);
    if (!p) return error(res, 'Partner bulunamadı.', 404);
    await p.update(req.body);
    return success(res, p);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const p = await Partner.findByPk(req.params.id);
    if (!p) return error(res, 'Partner bulunamadı.', 404);
    await p.destroy();
    return success(res, { deleted: true });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { list, listAll, getOne, create, update, remove };
