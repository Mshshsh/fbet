const { error } = require('../utils/apiResponse');

const requireAdmin = (req, res, next) => {
  if (!req.user) return error(res, 'Yetkisiz.', 401);
  if (req.user.role !== 'admin') return error(res, 'Bu işlem için admin yetkisi gerekli.', 403);
  next();
};

const requireMod = (req, res, next) => {
  if (!req.user) return error(res, 'Yetkisiz.', 401);
  if (!['admin', 'moderator'].includes(req.user.role))
    return error(res, 'Bu işlem için moderatör yetkisi gerekli.', 403);
  next();
};

module.exports = { requireAdmin, requireMod };
