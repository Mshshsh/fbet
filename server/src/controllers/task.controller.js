const { Task, TaskCompletion } = require('../models');
const { addPoints } = require('../services/points.service');
const { success, error } = require('../utils/apiResponse');
const { Op } = require('sequelize');

const list = async (req, res) => {
  try {
    const where = { isActive: true };
    const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
    // Eğer giriş yapmış kullanıcı varsa tamamladıklarını işaretle
    let completed = [];
    if (req.user) {
      const completions = await TaskCompletion.findAll({
        where: { userId: req.user.id },
        attributes: ['taskId'],
      });
      completed = completions.map((c) => c.taskId);
    }
    const result = tasks.map((t) => ({ ...t.toJSON(), completed: completed.includes(t.id) }));
    return success(res, result);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const complete = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || !task.isActive) return error(res, 'Görev bulunamadı.', 404);

    // one-time görevler için tekrar tamamlamayı engelle
    if (task.type === 'one-time') {
      const exists = await TaskCompletion.findOne({
        where: { taskId: task.id, userId: req.user.id },
      });
      if (exists) return error(res, 'Bu görevi zaten tamamladınız.', 409);
    }

    // daily/weekly görevler için tarih kontrolü
    if (task.type === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await TaskCompletion.findOne({
        where: {
          taskId: task.id,
          userId: req.user.id,
          completedAt: { [Op.gte]: today },
        },
      });
      if (existing) return error(res, 'Bu günlük görevi zaten tamamladınız.', 409);
    }

    await TaskCompletion.create({ taskId: task.id, userId: req.user.id });
    const newPoints = await addPoints(req.user.id, task.reward);
    return success(res, { reward: task.reward, newBalance: newPoints });
  } catch (err) {
    return error(res, err.message || 'Sunucu hatası.', 500);
  }
};

const create = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    return success(res, task, 201);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const update = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return error(res, 'Görev bulunamadı.', 404);
    await task.update(req.body);
    return success(res, task);
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return error(res, 'Görev bulunamadı.', 404);
    await task.destroy();
    return success(res, { deleted: true });
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

module.exports = { list, complete, create, update, remove };
