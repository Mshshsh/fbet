const router = require('express').Router();
const ctrl = require('../controllers/market.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/items', ctrl.listItems);
router.post('/items/:id/purchase', verifyToken, ctrl.purchase);
router.get('/transactions', verifyToken, ctrl.myTransactions);
router.post('/items', verifyToken, requireAdmin, ctrl.createItem);
router.put('/items/:id', verifyToken, requireAdmin, ctrl.updateItem);
router.delete('/items/:id', verifyToken, requireAdmin, ctrl.deleteItem);

module.exports = router;
