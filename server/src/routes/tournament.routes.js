const router = require('express').Router();
const ctrl = require('../controllers/tournament.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/:id/join', verifyToken, ctrl.join);
router.put('/:id/scores', verifyToken, requireAdmin, ctrl.updateScores);
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.put('/:id', verifyToken, requireAdmin, ctrl.update);

module.exports = router;
