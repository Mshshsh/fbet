const { Op } = require('sequelize');
const { SpinHistory, User } = require('../models');

// Çark segmentleri (index sırası önemli — frontend ile eşleşmeli)
const SEGMENTS = [
  { label: '10 Puan',   points: 10  },
  { label: '100 Puan',  points: 100 },
  { label: '25 Puan',   points: 25  },
  { label: '500 Puan',  points: 500 },
  { label: '10 Puan',   points: 10  },
  { label: '50 Puan',   points: 50  },
  { label: '25 Puan',   points: 25  },
  { label: '200 Puan',  points: 200 },
];

// Ağırlıklı rastgele seçim
const WEIGHTS = [30, 10, 20, 3, 30, 15, 20, 7]; // toplam 135

function weightedRandom() {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < WEIGHTS.length; i++) {
    r -= WEIGHTS[i];
    if (r <= 0) return i;
  }
  return WEIGHTS.length - 1;
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

  res.json({
    success: true,
    data: {
      canSpin: !lastSpin,
      nextSpin: lastSpin ? tomorrow : null,
      lastReward: lastSpin?.reward || null,
      segments: SEGMENTS,
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

  const segmentIndex = weightedRandom();
  const reward = SEGMENTS[segmentIndex].points;

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

module.exports = { getStatus, spin, getHistory };
