const router = require('express').Router();
const ctrl = require('../controllers/win.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', ctrl.list);
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.delete('/:id', verifyToken, requireAdmin, ctrl.remove);

module.exports = router;
