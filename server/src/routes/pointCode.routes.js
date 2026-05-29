const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { list, create, toggle, remove, redeem } = require('../controllers/pointCode.controller');

router.get('/', auth, role('admin', 'moderator'), list);
router.post('/', auth, role('admin', 'moderator'), create);
router.put('/:id/toggle', auth, role('admin', 'moderator'), toggle);
router.delete('/:id', auth, role('admin', 'moderator'), remove);
router.post('/redeem', auth, redeem);

module.exports = router;
