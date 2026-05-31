const { Op } = require('sequelize');
const { SpinHistory, WheelSegment, User } = require('../models');

// Varsayılan segmentler (DB boşsa kullanılır)
const DEFAULT_SEGMENTS = [
  { label: '10 Puan',  points: 10,  weight: 30, color: '#2a2008', textColor: '#c9a84c', sortOrder: 0 },
  { label: '100 Puan', points: 100, weight: 10, color: '#5a3d10', textColor: '#ffd700', sortOrder: 1 },
  { label: '25 Puan',  points: 25,  weight: 20, color: '#1e1608', textColor: '#c9a84c', sortOrder: 2 },
  { label: '500 Puan', points: 500, weight: 3,  color: '#8a6820', textColor: '#080808', sortOrder: 3 },
  { label: '10 Puan',  points: 10,  weight: 30, color: '#2a2008', textColor: '#c9a84c', sortOrder: 4 },
  { label: '50 Puan',  points: 50,  weight: 15, color: '#3d2d0e', textColor: '#e8c567', sortOrder: 5 },
  { label: '25 Puan',  points: 25,  weight: 20, color: '#1e1608', textColor: '#c9a84c', sortOrder: 6 },
  { label: '200 Puan', points: 200, weight: 7,  color: '#c9a84c', textColor: '#080808', sortOrder: 7 },
];

async function getActiveSegments() {
  let segments = await WheelSegment.findAll({
    where: { isActive: true },
    order: [['sortOrder', 'ASC'], ['id', 'ASC']],
  });

  // DB boşsa varsayılanları ekle
  if (segments.length === 0) {
    await WheelSegment.bulkCreate(DEFAULT_SEGMENTS);
    segments = await WheelSegment.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC']],
    });
  }

  return segments;
}

function weightedRandom(segments) {
  const total = segments.reduce((s, seg) => s + seg.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < segments.length; i++) {
    r -= segments[i].weight;
    if (r <= 0) return i;
  }
  return segments.length - 1;
}

// GET /api/wheel/status
const getStatus = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastSpin = await SpinHistory.findOne({
    where: { userId, createdAt: { [Op.gte]: today } },
    order: [['createdAt', 'DESC']],
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const segments = await getActiveSegments();

  res.json({
    success: true,
    data: {
      canSpin: !lastSpin,
      nextSpin: lastSpin ? tomorrow : null,
      lastReward: lastSpin?.reward || null,
      segments: segments.map(s => ({
        id: s.id,
        label: s.label,
        points: s.points,
        weight: s.weight,
        color: s.color,
        textColor: s.textColor,
      })),
    },
  });
};

// POST /api/wheel/spin
const spin = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await SpinHistory.findOne({
    where: { userId, createdAt: { [Op.gte]: today } },
  });

  if (existing) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return res.status(400).json({
      success: false,
      error: 'Bugün zaten çark çevirdiniz.',
      data: { nextSpin: tomorrow },
    });
  }

  const segments = await getActiveSegments();
  const segmentIndex = weightedRandom(segments);
  const reward = segments[segmentIndex].points;

  await SpinHistory.create({ userId, reward, segmentIndex });
  await User.increment('points', { by: reward, where: { id: userId } });

  const user = await User.findByPk(userId, { attributes: ['points'] });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  res.json({
    success: true,
    data: { reward, segmentIndex, nextSpin: tomorrow, totalPoints: user.points },
  });
};

// GET /api/wheel/history (admin)
const getHistory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  const { count, rows } = await SpinHistory.findAndCountAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'username', 'color', 'vipLevel'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  res.json({ success: true, data: { spins: rows, total: count, page } });
};

// ── Segment CRUD (admin) ──────────────────────────────────

// GET /api/wheel/segments
const listSegments = async (req, res) => {
  const segments = await WheelSegment.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] });
  res.json({ success: true, data: segments });
};

// POST /api/wheel/segments
const createSegment = async (req, res) => {
  const { label, points, weight, color, textColor, sortOrder } = req.body;
  if (!label || !points) return res.status(400).json({ success: false, error: 'Label ve puan zorunlu.' });

  const seg = await WheelSegment.create({
    label,
    points: parseInt(points),
    weight: parseInt(weight) || 10,
    color: color || '#2a2008',
    textColor: textColor || '#c9a84c',
    sortOrder: parseInt(sortOrder) || 0,
  });
  res.status(201).json({ success: true, data: seg });
};

// PUT /api/wheel/segments/:id
const updateSegment = async (req, res) => {
  const seg = await WheelSegment.findByPk(req.params.id);
  if (!seg) return res.status(404).json({ success: false, error: 'Segment bulunamadı.' });

  const { label, points, weight, color, textColor, sortOrder, isActive } = req.body;
  await seg.update({
    label:     label     ?? seg.label,
    points:    points    != null ? parseInt(points)    : seg.points,
    weight:    weight    != null ? parseInt(weight)    : seg.weight,
    color:     color     ?? seg.color,
    textColor: textColor ?? seg.textColor,
    sortOrder: sortOrder != null ? parseInt(sortOrder) : seg.sortOrder,
    isActive:  isActive  != null ? isActive            : seg.isActive,
  });
  res.json({ success: true, data: seg });
};

// DELETE /api/wheel/segments/:id
const deleteSegment = async (req, res) => {
  const seg = await WheelSegment.findByPk(req.params.id);
  if (!seg) return res.status(404).json({ success: false, error: 'Segment bulunamadı.' });
  await seg.destroy();
  res.json({ success: true });
};

module.exports = { getStatus, spin, getHistory, listSegments, createSegment, updateSegment, deleteSegment };
