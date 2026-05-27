const { MarketItem, MarketTransaction, User } = require('../models');
const { deductPoints } = require('../services/points.service');
const { success, error } = require('../utils/apiResponse');
const { sequelize } = require('../config/database');

const listItems = async (req, res) => {
  try {
    const items = await MarketItem.findAll({
      where: { isActive: true },
      order: [['pointCost', 'ASC']],
    });
    return success(res, items);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const purchase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const item = await MarketItem.findByPk(req.params.id);
    if (!item || !item.isActive) return error(res, 'Ürün bulunamadı.', 404);
    if (item.stock === 0) return error(res, 'Stok tükendi.', 400);

    await deductPoints(req.user.id, item.pointCost);

    if (item.stock > 0) {
      item.stock -= 1;
      await item.save({ transaction: t });
    }

    const tx = await MarketTransaction.create({
      userId: req.user.id,
      itemId: item.id,
      pointsSpent: item.pointCost,
      status: 'pending',
    }, { transaction: t });

    await t.commit();
    return success(res, { transaction: tx }, 201);
  } catch (err) {
    await t.rollback();
    return error(res, err.message || 'Sunucu hatası.', 400);
  }
};

const myTransactions = async (req, res) => {
  try {
    const txs = await MarketTransaction.findAll({
      where: { userId: req.user.id },
      include: [{ model: MarketItem, as: 'item' }],
      order: [['createdAt', 'DESC']],
    });
    return success(res, txs);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const createItem = async (req, res) => {
  try {
    const item = await MarketItem.create(req.body);
    return success(res, item, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await MarketItem.findByPk(req.params.id);
    if (!item) return error(res, 'Ürün bulunamadı.', 404);
    await item.update(req.body);
    return success(res, item);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await MarketItem.findByPk(req.params.id);
    if (!item) return error(res, 'Ürün bulunamadı.', 404);
    await item.destroy();
    return success(res, { deleted: true });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

// İlişki tanımı (market.controller içinde kullanılır)
MarketTransaction.belongsTo(MarketItem, { foreignKey: 'itemId', as: 'item' });

module.exports = { listItems, purchase, myTransactions, createItem, updateItem, deleteItem };
