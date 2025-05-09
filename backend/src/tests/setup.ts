import dotenv from 'dotenv';
import { sequelize } from '../config/database';
import { logger } from '../utils/logger';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Set global timeout for all tests
jest.setTimeout(30000);

// Global setup
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    logger.info('Test database synchronized');
  } catch (error) {
    logger.error('Failed to sync test database', { error });
    throw error;
  }
});

// Global teardown
afterAll(async () => {
  try {
    await sequelize.close();
    logger.info('Test database connection closed');
  } catch (error) {
    logger.error('Failed to close test database connection', { error });
    throw error;
  }
}); 