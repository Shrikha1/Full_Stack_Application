import request from 'supertest';
import app from '../src/app'; // Adjust if your Express app is exported elsewhere
import { sequelize } from '../src/models';

describe('Auth API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'Password123!' });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/verification/i);
    });

    it('should not allow duplicate registration', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dupe@example.com', password: 'Password123!' });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'dupe@example.com', password: 'Password123!' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should not login unverified user', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'unverified@example.com', password: 'Password123!' });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unverified@example.com', password: 'Password123!' });
      expect(res.statusCode).toBe(401);
    });
  });
});
