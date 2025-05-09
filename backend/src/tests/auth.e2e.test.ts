import request from 'supertest';
import { app } from '../app';
import { User } from '../models';
import { sequelize } from '../config/database';
import { logger } from '../utils/logger';

const testEmail = 'e2euser@example.com';
const testPassword = 'Test123!@';

describe('Auth End-to-End', () => {
  beforeAll(async () => {
    // Sync database and clear tables
    await sequelize.sync({ force: true });
    logger.info('Test database synchronized');
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
    logger.info('Test database connection closed');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/registration successful/i);
  });

  it('should not register with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('EMAIL_EXISTS');
  });

  it('should login with correct credentials', async () => {
    // First verify the user
    const user = await User.findOne({ where: { email: testEmail } });
    if (user) {
      user.verified = true;
      await user.save();
    }

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'WrongPass123' });
    
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('should not access protected route without token', async () => {
    const res = await request(app)
      .get('/api/protected');
    
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  }, 30000); // Increased timeout to 30 seconds
});
