const { HeroSlide } = require('../models');
const { success, error } = require('../utils/apiResponse');

// Public: aktif slaytları sırayla getir
const list = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['id', 'ASC']],
    });
    return success(res, slides);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

// Admin: tüm slaytlar
const listAll = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
    return success(res, slides);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

const create = async (req, res) => {
  try {
    const slide = await HeroSlide.create(req.body);
    return success(res, slide, 201);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

const update = async (req, res) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return error(res, 'Slayt bulunamadı.', 404);
    await slide.update(req.body);
    return success(res, slide);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

const remove = async (req, res) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);
    if (!slide) return error(res, 'Slayt bulunamadı.', 404);
    await slide.destroy();
    return success(res, { deleted: true });
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

module.exports = { list, listAll, create, update, remove };
