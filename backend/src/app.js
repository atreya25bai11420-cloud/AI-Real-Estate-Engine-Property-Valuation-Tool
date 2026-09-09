const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const prisma = require('./services/prisma');
const propertyRoutes = require('./routes/property.routes');
const valuationRoutes = require('./routes/valuation.routes');
const marketTrendRoutes = require('./routes/marketTrend.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/valuations', valuationRoutes);
app.use('/api/market-trends', marketTrendRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

app.use(errorHandler);

module.exports = app;
