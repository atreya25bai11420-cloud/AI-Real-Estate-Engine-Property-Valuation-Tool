const { z } = require('zod');

const createMarketTrendSchema = z.object({
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  city: z.string().min(1, 'City is required'),
  avgPricePerSqFt: z.number().positive(),
  medianSalePrice: z.number().positive(),
  inventoryCount: z.number().int().nonnegative().optional()
});

module.exports = { createMarketTrendSchema };
