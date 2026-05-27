const { StreamConfig } = require('../models');
const { success, error } = require('../utils/apiResponse');

const get = async (req, res) => {
  try {
    let cfg = await StreamConfig.findOne({ where: { id: 1 } });
    if (!cfg) cfg = await StreamConfig.create({ id: 1, platform: 'kick', isLive: false });
    return success(res, cfg);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

const update = async (req, res) => {
  try {
    let cfg = await StreamConfig.findOne({ where: { id: 1 } });
    if (!cfg) {
      cfg = await StreamConfig.create({ id: 1, ...req.body, updatedById: req.user.id });
    } else {
      await cfg.update({ ...req.body, updatedById: req.user.id });
    }
    return success(res, cfg);
  } catch (err) { return error(res, 'Sunucu hatası.', 500); }
};

module.exports = { get, update };
