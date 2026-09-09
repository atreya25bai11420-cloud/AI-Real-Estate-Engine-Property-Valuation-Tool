const prisma = require('./prisma');

const getAllProperties = async () => {
  return await prisma.property.findMany({
    include: { valuations: true },
    orderBy: { createdAt: 'desc' }
  });
};

const getPropertyById = async (id) => {
  return await prisma.property.findUnique({
    where: { id },
    include: { valuations: true }
  });
};

const createProperty = async (data) => {
  return await prisma.property.create({ data });
};

module.exports = { getAllProperties, getPropertyById, createProperty };
