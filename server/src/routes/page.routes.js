const router = require('express').Router();
const ctrl = require('../controllers/page.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', verifyToken, requireAdmin, ctrl.list);
router.get('/:slug', ctrl.getBySlug);
router.post('/', verifyToken, requireAdmin, ctrl.create);
router.put('/:id', verifyToken, requireAdmin, ctrl.update);
router.delete('/:id', verifyToken, requireAdmin, ctrl.remove);

module.exports = router;
