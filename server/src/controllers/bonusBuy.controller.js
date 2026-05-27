const { BonusBuy } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const items = await BonusBuy.findAll({ order: [['date', 'DESC']] });
    return success(res, items);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const create = async (req, res) => {
  try { return success(res, await BonusBuy.create(req.body), 201); }
  catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const update = async (req, res) => {
  try {
    const b = await BonusBuy.findByPk(req.params.id);
    if (!b) return error(res, 'Kayıt bulunamadı.', 404);
    await b.update(req.body);
    return success(res, b);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const remove = async (req, res) => {
  try {
    const b = await BonusBuy.findByPk(req.params.id);
    if (!b) return error(res, 'Kayıt bulunamadı.', 404);
    await b.destroy();
    return success(res, { deleted: true });
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
module.exports = { list, create, update, remove };
