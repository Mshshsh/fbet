const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { list, create, toggle, remove, redeem } = require('../controllers/pointCode.controller');

router.get('/', verifyToken, requireAdmin, list);
router.post('/', verifyToken, requireAdmin, create);
router.put('/:id/toggle', verifyToken, requireAdmin, toggle);
router.delete('/:id', verifyToken, requireAdmin, remove);
router.post('/redeem', verifyToken, redeem);

module.exports = router;
