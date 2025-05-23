import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/auth.routes';
import salesforceRoutes from './routes/salesforce.routes';

const app = express();
app.set('trust proxy', 1); // trust first proxy for rate limiting and IP detection

// CORS configuration - MUST be before helmet and other middleware
const allowedOrigins = [
  'https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app',
  'https://stellar-unicorn-be7810.netlify.app',
  'https://full-stack-application-zvvd.onrender.com',
  'http://localhost:5173',
  'http://localhost:3001',
  // Add any other frontend origins you need
];

const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // For development or testing, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours - increase preflight cache time
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
app.use('/api/auth', authRoutes);
app.use('/api/salesforce', salesforceRoutes);

// Error handling (should be last middleware)
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info('CORS configuration:', corsOptions);
});

export default app;