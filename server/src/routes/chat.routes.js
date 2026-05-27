const router = require('express').Router();
const ctrl = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireMod } = require('../middleware/role.middleware');

router.get('/messages', ctrl.getMessages);
router.delete('/messages/:id', verifyToken, requireMod, ctrl.deleteMessage);
router.get('/pin', ctrl.getPinnedMessage);
router.post('/pin', verifyToken, requireMod, ctrl.pinMessage);
router.delete('/pin', verifyToken, requireMod, ctrl.unpinMessage);
router.put('/users/:id/mute', verifyToken, requireMod, ctrl.muteUser);

module.exports = router;
