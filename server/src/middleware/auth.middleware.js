const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return error(res, 'Token bulunamadı.', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Geçersiz veya süresi dolmuş token.', 401);
  }
};

// Opsiyonel: token varsa decode et, yoksa devam et
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
};

module.exports = { verifyToken, optionalAuth };
