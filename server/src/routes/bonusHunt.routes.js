const router = require('express').Router();
const ctrl = require('../controllers/bonusHunt.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.put('/:id', verifyToken, requireAdmin, ctrl.update);
router.post('/:id/slots', verifyToken, requireAdmin, ctrl.addSlot);

module.exports = router;
