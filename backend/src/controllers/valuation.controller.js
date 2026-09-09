const prisma = require('../services/prisma');
const { generateValuationPDF } = require('../services/pdf.service');

const USD_TO_INR = 85;

function calculateDynamicZipPrice(zipCode) {
  const numericZip = zipCode.replace(/\D/g, '');
  if (!numericZip) return 300 * USD_TO_INR;

  const seed = numericZip.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const basePriceUSD = 200 + (seed * 15) % 350;
  return basePriceUSD * USD_TO_INR;
}

exports.createValuation = async (req, res, next) => {
  try {
    const { zipCode, squareFeet, bedrooms = 3, bathrooms = 2, yearBuilt = 2020 } = req.body;
    const parsedSqFt = Number(squareFeet);
    const parsedBedrooms = Number(bedrooms) || 3;
    const parsedBathrooms = Number(bathrooms) || 2;
    const parsedYearBuilt = Number(yearBuilt) || 2020;

    let trend = await prisma.marketTrend.findFirst({ where: { zipCode } });
    let pricePerSqFtINR;

    if (trend) {
      pricePerSqFtINR = trend.avgPricePerSqFt * USD_TO_INR;
    } else {
      pricePerSqFtINR = calculateDynamicZipPrice(zipCode);

      trend = await prisma.marketTrend.create({
        data: {
          zipCode,
          city: `Region ${zipCode}`,
          avgPricePerSqFt: pricePerSqFtINR / USD_TO_INR,
          medianSalePrice: (pricePerSqFtINR / USD_TO_INR) * 2000,
          inventoryCount: Math.floor(Math.random() * 50) + 10
        }
      });
    }

    let property = await prisma.property.findFirst({
      where: { zipCode, squareFeet: parsedSqFt }
    });

    if (!property) {
      property = await prisma.property.create({
        data: {
          address: `Property in ${zipCode}`,
          city: trend.city || 'Austin',
          state: 'TX',
          zipCode,
          squareFeet: parsedSqFt,
          propertyType: 'RESIDENTIAL',
          bedrooms: parsedBedrooms,
          bathrooms: parsedBathrooms,
          yearBuilt: parsedYearBuilt
        }
      });
    }

    const estimatedValueINR = parsedSqFt * pricePerSqFtINR;

    const valuation = await prisma.valuation.create({
      data: {
        propertyId: property.id,
        estimatedValue: estimatedValueINR,
        confidenceScore: 0.95,
        modelVersion: '2.0.26',
        valuationFactors: {
          zipCode,
          city: trend.city || 'Austin',
          benchmarkPricePerSqFt: pricePerSqFtINR,
          inventoryCount: trend.inventoryCount || 20,
          algorithmVersion: '2.0.26',
          generatedAt: new Date().toISOString()
        }
      }
    });

    res.status(201).json({
      ...valuation,
      pricePerSqFt: pricePerSqFtINR,
      zipCode,
      squareFeet: parsedSqFt
    });
  } catch (error) {
    next(error);
  }
};

exports.getValuations = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const valuations = await prisma.valuation.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(valuations);
  } catch (error) {
    next(error);
  }
};

exports.exportValuationPDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const valuation = await prisma.valuation.findUnique({
      where: { id },
      include: { property: true }
    });

    if (!valuation) {
      return res.status(404).json({ error: 'Valuation report not found' });
    }

    generateValuationPDF(valuation, res);
  } catch (error) {
    next(error);
  }
};
