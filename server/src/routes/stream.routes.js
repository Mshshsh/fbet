const router = require('express').Router();
const ctrl = require('../controllers/stream.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', ctrl.get);
router.put('/', verifyToken, requireAdmin, ctrl.update);

module.exports = router;
