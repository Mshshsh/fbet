const router = require('express').Router();
const { uploadImage } = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.post('/image', verifyToken, requireAdmin, upload.single('image'), uploadImage);

module.exports = router;
