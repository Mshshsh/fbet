require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error.middleware');

// Modelleri yükle (ilişkiler dahil)
require('./models');

const app = express();

// Güvenlik
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3001',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS engellendi'));
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Genel rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 200,
  message: { success: false, error: 'Çok fazla istek gönderildi.' },
});
app.use('/api', limiter);

// Auth için daha sıkı rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Çok fazla deneme yapıldı.' },
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/partners', require('./routes/partner.routes'));
app.use('/api/pages', require('./routes/page.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/market', require('./routes/market.routes'));
app.use('/api/tickets', require('./routes/ticket.routes'));
app.use('/api/tournaments', require('./routes/tournament.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/bonus-buy', require('./routes/bonusBuy.routes'));
app.use('/api/bonus-hunt', require('./routes/bonusHunt.routes'));
app.use('/api/special-odds', require('./routes/specialOdd.routes'));
app.use('/api/stream', require('./routes/stream.routes'));
app.use('/api/wins', require('./routes/win.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/hero-slides', require('./routes/heroSlide.routes'));
app.use('/api/wheel', require('./routes/wheel.routes'));
app.use('/api/point-codes', require('./routes/pointCode.routes'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Endpoint bulunamadı.' }));

// Error handler
app.use(errorHandler);

module.exports = app;
