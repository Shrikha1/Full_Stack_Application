import nodemailer from 'nodemailer';
import { logger } from './logger';
import { User } from '../models';

// For development environment: temporarily disable verification requirement
const isDev = process.env.NODE_ENV !== 'production';

// Create initial transporter
let transporter: nodemailer.Transporter = createDefaultTransport();

// Initialize an ethereal email account for development if needed
(async function initializeEmailTransport() {
  // For production: use best available email service
  if (process.env.NODE_ENV === 'production') {
    if (process.env.EMAIL_SERVICE === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      // SendGrid configuration
      transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
      logger.info('Email service initialized with SendGrid');
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Gmail or other SMTP configuration
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail', 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      logger.info(`Email service initialized with ${process.env.EMAIL_SERVICE || 'gmail'}`);
    } else {
      // Use a real ethereal account for test emails
      try {
        logger.warn('No email configuration found for production. Creating Ethereal test account.');
        const testAccount = await nodemailer.createTestAccount();
        
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        
        logger.info('Created Ethereal test account for production use', {
          user: testAccount.user
        });
      } catch (error) {
        logger.error('Failed to create test account, using default transport', { error });
      }
    }
  } else {
    // Development mode - create an ethereal account
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      logger.info('Created Ethereal test account for development', {
        user: testAccount.user,
        pass: testAccount.pass
      });
    } catch (error) {
      logger.error('Failed to create test account, using default transport', { error });
    }
  }
})().catch(err => logger.error('Error initializing email transport', { error: err }));

// Create a default email transport as a fallback
function createDefaultTransport(): nodemailer.Transporter {
  // Create a console-based transport that just logs emails
  return nodemailer.createTransport({
    name: 'minimal',
    version: '0.1.0',
    send: (mail: any, callback: (err: Error | null, info: any) => void) => {
      const info = {
        envelope: mail.message.getEnvelope(),
        messageId: `<${Math.random().toString(36).slice(2, 12)}@localhost>`,
        message: mail.message.toString()
      };
      logger.info('Email would be sent', {
        to: info.envelope.to,
        from: info.envelope.from,
        subject: mail.message.subject,
        preview: 'https://ethereal.email/message/preview (account not created yet)'
      });
      callback(null, info);
    }
  } as any);
}

// Export function to verify a user directly (for admin/testing purposes)
export async function verifyUserByEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.verified) {
      return { success: true, message: 'User already verified' };
    }
    
    // Mark user as verified
    user.verified = true;
    await user.save();
    
    logger.info(`User ${email} manually verified`);
    return { success: true, message: 'User verified successfully' };
  } catch (error) {
    logger.error('Error verifying user:', error);
    return { success: false, message: 'Error verifying user' };
  }
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
