const { Ticket, TicketEntry, User } = require('../models');
const { deductPoints } = require('../services/points.service');
const { success, error } = require('../utils/apiResponse');

const list = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { status: 'active' },
      order: [['drawDate', 'ASC']],
    });
    return success(res, tickets);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const listAll = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ order: [['createdAt', 'DESC']] });
    return success(res, tickets);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const getOne = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{ model: TicketEntry, as: 'entries', include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatarCategory', 'avatarNumber'] }] }],
    });
    if (!ticket) return error(res, 'Bilet bulunamadı.', 404);
    return success(res, ticket);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const enter = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket || ticket.status !== 'active') return error(res, 'Bilet bulunamadı.', 404);

    const cost = ticket.ticketCost * quantity;
    if (cost > 0) await deductPoints(req.user.id, cost);

    const entry = await TicketEntry.create({
      ticketId: ticket.id,
      userId: req.user.id,
      quantity,
    });
    return success(res, entry, 201);
  } catch (err) {
    return error(res, err.message || 'Sunucu hatası.', 400);
  }
};

const draw = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{ model: TicketEntry, as: 'entries' }],
    });
    if (!ticket) return error(res, 'Bilet bulunamadı.', 404);
    if (!ticket.entries.length) return error(res, 'Katılımcı yok.', 400);

    // Ağırlıklı rastgele çekiliş (quantity kadar şans)
    const pool = [];
    ticket.entries.forEach((e) => {
      for (let i = 0; i < e.quantity; i++) pool.push(e.userId);
    });
    const winnerId = pool[Math.floor(Math.random() * pool.length)];

    ticket.winnerId = winnerId;
    ticket.status = 'drawn';
    await ticket.save();
    return success(res, { winnerId });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const create = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    return success(res, ticket, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const update = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return error(res, 'Bilet bulunamadı.', 404);
    await ticket.update(req.body);
    return success(res, ticket);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { list, listAll, getOne, enter, draw, create, update };
