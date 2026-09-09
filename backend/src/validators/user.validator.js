const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'AGENT', 'ADMIN']).optional().default('USER')
});

module.exports = { createUserSchema };
