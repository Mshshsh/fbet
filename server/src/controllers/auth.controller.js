const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateUserColor } = require('../utils/userColor');
const { success, error } = require('../utils/apiResponse');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role, vipLevel: user.vipLevel },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const register = async (req, res) => {
  try {
    const { username, email, password, avatarCategory, avatarNumber } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return error(res, 'Bu e-posta adresi zaten kayıtlı.', 409);

    const usernameTaken = await User.findOne({ where: { username } });
    if (usernameTaken) return error(res, 'Bu kullanıcı adı zaten alınmış.', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatarCategory: avatarCategory || 1,
      avatarNumber: avatarNumber || 1,
      color: null, // sonradan id ile set edilecek
    });
    // ID oluşturulduktan sonra renk ata
    user.color = generateUserColor(user.id);
    await user.save();

    const token = generateToken(user);
    return success(res, { token, user: sanitizeUser(user) }, 201);
  } catch (err) {
    console.error(err);
    return error(res, 'Kayıt sırasında bir hata oluştu.', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return error(res, 'E-posta veya şifre hatalı.', 401);
    if (user.isBanned) return error(res, 'Hesabınız askıya alınmıştır.', 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'E-posta veya şifre hatalı.', 401);

    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user);
    return success(res, { token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return error(res, 'Giriş sırasında bir hata oluştu.', 500);
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return error(res, 'Kullanıcı bulunamadı.', 404);
    return success(res, sanitizeUser(user));
  } catch (err) {
    return error(res, 'Sunucu hatası.', 500);
  }
};

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatarCategory: user.avatarCategory,
  avatarNumber: user.avatarNumber,
  color: user.color,
  role: user.role,
  vipLevel: user.vipLevel,
  points: user.points,
  isBanned: user.isBanned,
  isMuted: user.isMuted,
  lastSeen: user.lastSeen,
  createdAt: user.createdAt,
});

module.exports = { register, login, me };
