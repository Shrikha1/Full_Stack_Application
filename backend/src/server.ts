import { app } from './app';
import { sequelize } from './config/database';
import { logger } from './utils/logger';

const DEFAULT_PORT = 3000;
const PORT = parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10);

// Function to find an available port
const findAvailablePort = async (startPort: number): Promise<number> => {
  return new Promise((resolve) => {
    const server = app.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    }).on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Sync models with database
    await sequelize.sync();
    logger.info('All models were synchronized successfully.');

    // Find available port and start server
    const port = await findAvailablePort(PORT);
    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { startServer }; 