const { Op } = require('sequelize');
const { PointCode, CodeRedemption, User } = require('../models');

// GET /api/point-codes (admin)
const list = async (req, res) => {
  const codes = await PointCode.findAll({
    include: [{ model: CodeRedemption, as: 'redemptions', include: [{ model: User, as: 'user', attributes: ['id', 'username'] }] }],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, data: codes });
};

// POST /api/point-codes (admin)
const create = async (req, res) => {
  const { code, points, maxUses, expiresAt } = req.body;
  if (!code || !points) return res.status(400).json({ success: false, error: 'Kod ve puan zorunlu.' });

  const existing = await PointCode.findOne({ where: { code: code.toUpperCase() } });
  if (existing) return res.status(400).json({ success: false, error: 'Bu kod zaten mevcut.' });

  const pc = await PointCode.create({
    code: code.toUpperCase().trim(),
    points: parseInt(points),
    maxUses: maxUses ? parseInt(maxUses) : null,
    expiresAt: expiresAt || null,
    createdById: req.user.id,
  });

  res.status(201).json({ success: true, data: pc });
};

// PUT /api/point-codes/:id (admin - aktif/pasif toggle)
const toggle = async (req, res) => {
  const pc = await PointCode.findByPk(req.params.id);
  if (!pc) return res.status(404).json({ success: false, error: 'Kod bulunamadı.' });
  await pc.update({ isActive: !pc.isActive });
  res.json({ success: true, data: pc });
};

// DELETE /api/point-codes/:id (admin)
const remove = async (req, res) => {
  const pc = await PointCode.findByPk(req.params.id);
  if (!pc) return res.status(404).json({ success: false, error: 'Kod bulunamadı.' });
  await pc.destroy();
  res.json({ success: true });
};

// POST /api/point-codes/redeem (kullanıcı)
const redeem = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, error: 'Kod giriniz.' });

  const pc = await PointCode.findOne({ where: { code: code.toUpperCase().trim() } });
  if (!pc || !pc.isActive) return res.status(404).json({ success: false, error: 'Geçersiz veya pasif kod.' });

  if (pc.expiresAt && new Date(pc.expiresAt) < new Date()) {
    return res.status(400).json({ success: false, error: 'Bu kodun süresi dolmuş.' });
  }

  if (pc.maxUses !== null && pc.usedCount >= pc.maxUses) {
    return res.status(400).json({ success: false, error: 'Bu kod maksimum kullanım sayısına ulaştı.' });
  }

  const alreadyUsed = await CodeRedemption.findOne({ where: { userId: req.user.id, codeId: pc.id } });
  if (alreadyUsed) return res.status(400).json({ success: false, error: 'Bu kodu daha önce kullandınız.' });

  await CodeRedemption.create({ userId: req.user.id, codeId: pc.id });
  await pc.increment('usedCount');
  await User.increment('points', { by: pc.points, where: { id: req.user.id } });

  const user = await User.findByPk(req.user.id, { attributes: ['points'] });

  res.json({ success: true, data: { reward: pc.points, totalPoints: user.points } });
};

module.exports = { list, create, toggle, remove, redeem };
