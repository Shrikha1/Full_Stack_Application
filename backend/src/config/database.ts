import { Sequelize, Dialect } from 'sequelize';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const getSequelizeConfig = () => {
  const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/salesforce_app';
  
  try {
    const url = new URL(databaseUrl);
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      host: url.hostname,
      port: parseInt(url.port, 10),
      dialect: 'postgres' as Dialect,
      logging: (msg: string) => logger.debug(msg),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
    };
  } catch (error) {
    logger.error('Invalid DATABASE_URL format', { error });
    throw new Error('Invalid DATABASE_URL format');
  }
};

const sequelize = new Sequelize(getSequelizeConfig());

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize; 