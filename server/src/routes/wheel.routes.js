const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { getStatus, spin, getHistory, listSegments, createSegment, updateSegment, deleteSegment } = require('../controllers/wheel.controller');

router.get('/status',        verifyToken, getStatus);
router.post('/spin',         verifyToken, spin);
router.get('/history',       verifyToken, requireAdmin, getHistory);

// Segment CRUD (admin)
router.get('/segments',      verifyToken, requireAdmin, listSegments);
router.post('/segments',     verifyToken, requireAdmin, createSegment);
router.put('/segments/:id',  verifyToken, requireAdmin, updateSegment);
router.delete('/segments/:id', verifyToken, requireAdmin, deleteSegment);

module.exports = router;
