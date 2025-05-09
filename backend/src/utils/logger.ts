import winston from 'winston';
const { format } = winston;
const { combine, timestamp, json, colorize, simple } = format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        simple()
      )
    })
  ]
});

export const logRequest = (req: any, _res: any, next: any) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
};

export { logger }; 