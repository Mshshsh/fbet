const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { getStatus, spin, getHistory } = require('../controllers/wheel.controller');

router.get('/status', verifyToken, getStatus);
router.post('/spin', verifyToken, spin);
router.get('/history', verifyToken, requireAdmin, getHistory);

module.exports = router;
