const prisma = require('./prisma');

const getPropertyAnalytics = async (propertyId) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      valuations: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!property) throw new Error('Property not found');

  const valuations = property.valuations;
  if (valuations.length === 0) {
    return { propertyId, totalValuations: 0, latestValue: null, appreciationPercentage: 0 };
  }

  const initialValue = valuations[0].estimatedValue;
  const latestValue = valuations[valuations.length - 1].estimatedValue;
  const totalChange = latestValue - initialValue;
  const appreciationPercentage = initialValue ? parseFloat(((totalChange / initialValue) * 100).toFixed(2)) : 0;

  return {
    propertyId,
    address: property.address,
    zipCode: property.zipCode,
    totalValuations: valuations.length,
    initialValue,
    latestValue,
    valueChange: totalChange,
    appreciationPercentage,
    valuationHistory: valuations.map(v => ({
      id: v.id,
      estimatedValue: v.estimatedValue,
      confidenceScore: v.confidenceScore,
      userId: v.userId,
      createdAt: v.createdAt
    }))
  };
};

module.exports = { getPropertyAnalytics };
