const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', optionalAuth, ctrl.list);
router.post('/:id/complete', verifyToken, ctrl.complete);
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.put('/:id', verifyToken, requireAdmin, ctrl.update);
router.delete('/:id', verifyToken, requireAdmin, ctrl.remove);

module.exports = router;
