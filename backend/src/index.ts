import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sequelize } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error';
import { app } from './app';
import { authRouter } from './routes/auth';

const app = express();

// CORS configuration - MUST be before helmet and other middleware
const allowedOrigins = [
  'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app',
  'https://stellar-unicorn-be7810.netlify.app',
  'https://full-stack-application-zvvd.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS first
app.use(cors(corsOptions));

// Then apply other middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Debug middleware to log all requests
app.use((req, _res, next) => {
  logger.info('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

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
app.use('/api/auth', authRouter);

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

export { app };