const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { getStatus, spin, getHistory } = require('../controllers/wheel.controller');

router.get('/status', auth, getStatus);
router.post('/spin', auth, spin);
router.get('/history', auth, role('admin', 'moderator'), getHistory);

module.exports = router;
