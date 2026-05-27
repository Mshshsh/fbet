const { Tournament, TournamentEntry, User } = require('../models');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({ order: [['createdAt', 'DESC']] });
    return success(res, tournaments);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const getOne = async (req, res) => {
  try {
    const t = await Tournament.findByPk(req.params.id, {
      include: [{
        model: TournamentEntry,
        as: 'entries',
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'color', 'vipLevel', 'avatarCategory', 'avatarNumber'] }],
        order: [['score', 'DESC']],
      }],
    });
    if (!t) return error(res, 'Turnuva bulunamadı.', 404);
    return success(res, t);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const join = async (req, res) => {
  try {
    const t = await Tournament.findByPk(req.params.id);
    if (!t) return error(res, 'Turnuva bulunamadı.', 404);
    const exists = await TournamentEntry.findOne({ where: { tournamentId: t.id, userId: req.user.id } });
    if (exists) return error(res, 'Zaten katıldınız.', 409);
    const entry = await TournamentEntry.create({ tournamentId: t.id, userId: req.user.id });
    return success(res, entry, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const updateScores = async (req, res) => {
  try {
    // body: [{ userId, score }]
    const { scores } = req.body;
    for (const s of scores) {
      await TournamentEntry.update(
        { score: s.score },
        { where: { tournamentId: req.params.id, userId: s.userId } }
      );
    }
    return success(res, { updated: true });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const create = async (req, res) => {
  try {
    const t = await Tournament.create(req.body);
    return success(res, t, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const update = async (req, res) => {
  try {
    const t = await Tournament.findByPk(req.params.id);
    if (!t) return error(res, 'Turnuva bulunamadı.', 404);
    await t.update(req.body);
    return success(res, t);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { list, getOne, join, updateScores, create, update };
