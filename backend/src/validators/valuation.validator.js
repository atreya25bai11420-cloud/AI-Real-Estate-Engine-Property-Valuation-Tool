const { z } = require('zod');

const createValuationSchema = z.object({
  propertyId: z.string().uuid('Valid Property UUID is required'),
  userId: z.string().uuid().optional()
});

module.exports = { createValuationSchema };
