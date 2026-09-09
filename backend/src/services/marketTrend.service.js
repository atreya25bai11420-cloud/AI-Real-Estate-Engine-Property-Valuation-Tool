const prisma = require('./prisma');

const getTrendByZip = async (zipCode) => {
  return await prisma.marketTrend.findFirst({
    where: { zipCode },
    orderBy: { recordedAt: 'desc' }
  });
};

const createTrend = async (data) => {
  return await prisma.marketTrend.create({ data });
};

module.exports = { getTrendByZip, createTrend };
