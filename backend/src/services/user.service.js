const prisma = require('./prisma');
const crypto = require('crypto');

const createUser = async (data) => {
  const { password, ...userData } = data;
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

  return await prisma.user.create({
    data: {
      email: userData.email,
      role: userData.role,
      passwordHash
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      valuations: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = { createUser, getAllUsers };
