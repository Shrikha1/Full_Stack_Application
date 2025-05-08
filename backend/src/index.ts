import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/auth.routes';
import salesforceRoutes from './routes/salesforce.routes';

const app = express();

// Security Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: 'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Additional headers for preflight
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (global, can be tuned per route as well)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.'
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/salesforce', salesforceRoutes);

// Error handling (should be last middleware)
app.use(errorHandler);

// Database connection
sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully.');
    // Sync models to create tables if they do not exist
    return sequelize.sync();
  })
  .then(() => {
    logger.info('All models were synchronized successfully.');
  })
  .catch((error: any) => {
    logger.error('Unable to connect to or synchronize the database:', error.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;