const prisma = require('./prisma');

const calculateValuation = (property, marketTrend) => {
  const basePricePerSqFt = marketTrend ? marketTrend.avgPricePerSqFt : 250;
  let estimatedValue = property.squareFeet * basePricePerSqFt;
  estimatedValue += property.bedrooms * 15000;
  estimatedValue += property.bathrooms * 10000;
  
  if (property.yearBuilt > 2015) estimatedValue *= 1.1;

  const confidenceScore = marketTrend ? 0.92 : 0.75;

  return {
    estimatedValue: Math.round(estimatedValue),
    confidenceScore,
    valuationFactors: {
      basePricePerSqFt,
      bedroomBonus: property.bedrooms * 15000,
      yearBuiltMultiplier: property.yearBuilt > 2015 ? 1.1 : 1.0,
      marketTrendApplied: !!marketTrend,
      zipCode: property.zipCode
    }
  };
};

const generateValuation = async (propertyId, userId) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error('Property not found');

  const marketTrend = await prisma.marketTrend.findFirst({
    where: { zipCode: property.zipCode },
    orderBy: { recordedAt: 'desc' }
  });

  const calculation = calculateValuation(property, marketTrend);

  return await prisma.valuation.create({
    data: {
      propertyId,
      userId: userId || null,
      estimatedValue: calculation.estimatedValue,
      confidenceScore: calculation.confidenceScore,
      valuationFactors: calculation.valuationFactors
    }
  });
};

const getValuationsByProperty = async (propertyId) => {
  return await prisma.valuation.findMany({
    where: { propertyId },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = { generateValuation, getValuationsByProperty };
