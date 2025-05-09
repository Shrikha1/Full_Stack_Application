import nodemailer from 'nodemailer';
import { logger } from './logger';

// Create the appropriate transporter based on environment
let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === 'production') {
  // Production email configuration
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  });
} else {
  // Development: just log emails to console
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

export async function sendVerificationEmail(to: string, verificationToken: string) {
  // Generate the verification link
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(to)}`;
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Verify your email',
    text: `Please verify your email by clicking this link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`
  });
  // Log the verification link for local/dev
  if (process.env.NODE_ENV !== 'production' && info.message) {
    logger.info('Verification email would be sent to:', to);
    logger.info('Verification link:', verificationLink);
    logger.info('Email content:', info.message.toString());
  } else {
    logger.info('Verification email sent to:', to);
  }
}
