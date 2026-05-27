const router = require('express').Router();
const ctrl = require('../controllers/ticket.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', ctrl.list);
router.get('/all', verifyToken, requireAdmin, ctrl.listAll);
router.get('/:id', ctrl.getOne);
router.post('/:id/enter', verifyToken, ctrl.enter);
router.post('/:id/draw', verifyToken, requireAdmin, ctrl.draw);
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.put('/:id', verifyToken, requireAdmin, ctrl.update);

module.exports = router;
