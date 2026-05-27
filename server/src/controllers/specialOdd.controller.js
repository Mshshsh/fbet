const { SpecialOdd } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const odds = await SpecialOdd.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
    return success(res, odds);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const listAll = async (req, res) => {
  try {
    const odds = await SpecialOdd.findAll({ order: [['createdAt', 'DESC']] });
    return success(res, odds);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const create = async (req, res) => {
  try { return success(res, await SpecialOdd.create(req.body), 201); }
  catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const update = async (req, res) => {
  try {
    const o = await SpecialOdd.findByPk(req.params.id);
    if (!o) return error(res, 'Kayıt bulunamadı.', 404);
    await o.update(req.body);
    return success(res, o);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const remove = async (req, res) => {
  try {
    const o = await SpecialOdd.findByPk(req.params.id);
    if (!o) return error(res, 'Kayıt bulunamadı.', 404);
    await o.destroy();
    return success(res, { deleted: true });
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
module.exports = { list, listAll, create, update, remove };
