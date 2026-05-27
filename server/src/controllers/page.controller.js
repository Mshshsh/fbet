const { Page } = require('../models');
const { success, error } = require('../utils/apiResponse');

const getBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ where: { slug: req.params.slug } });
    // Sayfa yoksa boş içerik döndür (404 yerine) — frontend graceful şekilde işler
    if (!page) {
      return success(res, { slug: req.params.slug, content: '', isPublished: false });
    }
    return success(res, page);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const list = async (req, res) => {
  try {
    const pages = await Page.findAll({ order: [['updatedAt', 'DESC']] });
    return success(res, pages);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const create = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    return success(res, page, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const update = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return error(res, 'Sayfa bulunamadı.', 404);
    await page.update(req.body);
    return success(res, page);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return error(res, 'Sayfa bulunamadı.', 404);
    await page.destroy();
    return success(res, { deleted: true });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { getBySlug, list, create, update, remove };
