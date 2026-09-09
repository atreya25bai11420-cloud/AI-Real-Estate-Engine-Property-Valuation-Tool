const prisma = require('../services/prisma');
const crypto = require('crypto');
const { signToken } = require('../utils/jwt');
const { createUserSchema } = require('../validators/user.validator');
const { loginSchema } = require('../validators/auth.validator');

const register = async (req, res, next) => {
  try {
    const { email, password, role } = createUserSchema.parse(req.body);
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const user = await prisma.user.create({
      data: { email, passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt },
      token
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true, valuations: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
