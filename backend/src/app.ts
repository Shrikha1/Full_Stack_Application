import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { errorHandler } from './middleware/error';
import { logger } from './utils/logger';
import { testConnection } from './config/database';
import './models'; // Import models to initialize them

const app = express();

// Initialize database connection
testConnection().catch(error => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
});

// CORS configuration
const allowedOrigins = [
  'https://stellar-unicorn-be7810.netlify.app',
  'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
}));

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

// Routes
app.use('/api/auth', authRouter);

// Error handling
app.use(errorHandler);

export { app }; 