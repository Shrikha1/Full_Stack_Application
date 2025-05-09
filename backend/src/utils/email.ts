import nodemailer from 'nodemailer';
import { logger } from './logger';

// Create the appropriate transporter based on environment
let transporter: nodemailer.Transporter;

// For development environment: temporarily disable verification requirement
const isDev = process.env.NODE_ENV !== 'production';

// In production, use SendGrid or a similar service
// In development, use ethereal.email for testing or just log to console
if (process.env.NODE_ENV === 'production') {
  // For production: Use SendGrid or similar service
  transporter = nodemailer.createTransport({
    service: 'gmail',  // Or SendGrid, etc.
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
} else {
  // For development: Create a test account or log to console
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'valerie.kunde14@ethereal.email', // Test account
      pass: 'TsvbG3gxxfS9Uf3vWw'               // Test password
    }
  });
}

export async function sendVerificationEmail(to: string, verificationToken: string) {
  // Generate the verification link
  const frontendUrl = process.env.FRONTEND_URL || 'https://stellar-unicorn-be7810.netlify.app';
  const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(to)}`;
  
  try {
    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Authentication Service" <auth@example.com>',
      to,
      subject: 'Verify Your Email - Account Registration',
      text: `Please verify your email by clicking this link: ${verificationLink}\n\nThis link will expire in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4a90e2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <p style="color: #888; margin-top: 30px; font-size: 14px;">This link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
        </div>
      `
    });
    
    // Always log the verification link in development to help with testing
    if (isDev) {
      logger.info('Verification email sent to:', to);
      logger.info('Verification link:', verificationLink);
      if (info.messageId) {
        logger.info('Email message ID:', info.messageId);
      }
      
      // If using ethereal.email for testing, provide preview URL
      if (info.preview) {
        logger.info('Email preview URL:', info.preview);
      }
    }
    
    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    
    // In development, return the verification link even if email fails
    // This allows testing without email setup
    if (isDev) {
      logger.info('DEV MODE: Providing verification link despite email failure');
      logger.info('Verification link:', verificationLink);
      return { success: false, verificationLink, message: 'Email failed but link provided for testing' };
    }
    
    return { success: false, message: 'Failed to send verification email' };
  }
}
