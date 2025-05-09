import request from 'supertest';
import { app } from '../app';
import { sequelize } from '../config/database';
import { logger } from '../utils/logger';
import { User } from '../models';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

let server: any;

describe('Authentication Flow', () => {
  const testUser = {
    email: 'test.user123@example.com',
    password: 'Test123!@'
  };

  beforeAll(async () => {
    // Sync database and initialize models
    await sequelize.sync({ force: true });
    logger.info('Test database synchronized');

    // Start server on a random port
    server = app.listen(0);
    logger.info('Test server started');
  });

  afterAll(async () => {
    // Close server
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    logger.info('Test server closed');

    // Close database connection
    await sequelize.close();
    logger.info('Test database connection closed');
  });

  describe('Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(testUser)
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Registration successful');
      
      // Verify user was created in database
      const user = await User.findOne({ where: { email: testUser.email } });
      expect(user).toBeTruthy();
      expect(user?.verified).toBe(false);
      expect(user?.verificationToken).toBeTruthy();
    });

    it('should not register a user with existing email', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(testUser)
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('EMAIL_EXISTS');
    });

    it('should validate password requirements', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak'
        })
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Login', () => {
    it('should not allow login with unverified account', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send(testUser)
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('ACCOUNT_NOT_VERIFIED');
    });

    it('should not allow login with invalid credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('Email Verification', () => {
    it('should verify email with valid token', async () => {
      // Get the user and their verification token
      const user = await User.findOne({ where: { email: testUser.email } });
      expect(user).toBeTruthy();

      const response = await request(server)
        .post('/api/auth/verify-email')
        .send({
          email: testUser.email,
          token: user?.verificationToken
        })
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Email verified successfully');

      // Verify user is marked as verified in database
      const verifiedUser = await User.findOne({ where: { email: testUser.email } });
      expect(verifiedUser?.verified).toBe(true);
      expect(verifiedUser?.verificationToken).toBeNull();
    });

    it('should not verify email with invalid token', async () => {
      const response = await request(server)
        .post('/api/auth/verify-email')
        .send({
          email: testUser.email,
          token: 'invalid-token'
        })
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_TOKEN');
    });

    it('should allow login after email verification', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send(testUser)
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.headers['set-cookie']).toBeTruthy();
    });
  });

  describe('Resend Verification', () => {
    it('should resend verification email', async () => {
      // Create a new unverified user
      const newUser = {
        email: 'new.user@example.com',
        password: 'Test123!@'
      };

      await request(server)
        .post('/api/auth/register')
        .send(newUser)
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      const response = await request(server)
        .post('/api/auth/resend-verification')
        .send({ email: newUser.email })
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Verification email sent');

      // Verify new token was generated
      const user = await User.findOne({ where: { email: newUser.email } });
      expect(user?.verificationToken).toBeTruthy();
    });

    it('should not resend verification for non-existent user', async () => {
      const response = await request(server)
        .post('/api/auth/resend-verification')
        .send({ email: 'nonexistent@example.com' })
        .set('Origin', 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('USER_NOT_FOUND');
    });
  });
}); 