const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin, requireMod } = require('../middleware/role.middleware');

router.get('/', verifyToken, requireAdmin, ctrl.listUsers);
router.get('/:id', ctrl.getUser);
router.put('/me/avatar', verifyToken, ctrl.updateAvatar);
router.put('/:id/role', verifyToken, requireAdmin, ctrl.setRole);
router.put('/:id/ban', verifyToken, requireMod, ctrl.setBan);
router.put('/:id/points', verifyToken, requireAdmin, ctrl.setPoints);
router.put('/:id/vip', verifyToken, requireAdmin, ctrl.setVip);

module.exports = router;
