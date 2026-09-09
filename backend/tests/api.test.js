const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');

afterAll(async () => {
  await prisma.$disconnect();
});

describe('PropTech API Automated Integration Tests', () => {
  test('GET /api/health should return 200 OK with database connection status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.database).toEqual('connected');
  });

  test('POST /api/market-trends without Authorization header should reject with 401', async () => {
    const res = await request(app)
      .post('/api/market-trends')
      .send({ zipCode: '78703', city: 'Austin', avgPricePerSqFt: 350, medianSalePrice: 700000 });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/auth/login with valid credentials should return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'investor@proptech.io', password: 'SecurePassword123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toEqual('investor@proptech.io');
  });

  test('GET /api/auth/me with valid Bearer token should return user profile', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'investor@proptech.io', password: 'SecurePassword123' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('investor@proptech.io');
    expect(res.body.valuations).toBeDefined();
  });
});
