const { WinEntry } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const wins = await WinEntry.findAll({ order: [['createdAt', 'DESC']], limit: 50 });
    return success(res, wins);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const create = async (req, res) => {
  try { return success(res, await WinEntry.create(req.body), 201); }
  catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
const remove = async (req, res) => {
  try {
    const w = await WinEntry.findByPk(req.params.id);
    if (!w) return error(res, 'Kayıt bulunamadı.', 404);
    await w.destroy();
    return success(res, { deleted: true });
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};
module.exports = { list, create, remove };
