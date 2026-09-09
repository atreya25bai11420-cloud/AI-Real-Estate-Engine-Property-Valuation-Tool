const { z } = require('zod');

const createPropertySchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().positive(),
  squareFeet: z.number().int().positive(),
  yearBuilt: z.number().int().min(1800).max(2026),
  lotSize: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

module.exports = { createPropertySchema };
