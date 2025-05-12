import nodemailer from 'nodemailer';
import { logger } from './logger';
import { prisma } from '../lib/prisma';

// For development environment: temporarily disable verification requirement
const isDev = process.env.NODE_ENV !== 'production';

// Create initial transporter
let transporter: nodemailer.Transporter = createDefaultTransport();

// Initialize an ethereal email account for development if needed
(async function initializeEmailTransport() {
  if (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' || process.env.NETLIFY === 'true') {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is required in production');
    }

    transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });

    logger.info('Email service initialized with SendGrid');
  } else {
    try {
      logger.info('Creating Ethereal test account for development');
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

      logger.info('Development email transport initialized with Ethereal', {
        user: testAccount.user,
        pass: testAccount.pass
      });
    } catch (error) {
      logger.error('Failed to create test account, using default transport', { error });
    }
  }
})();

// Create a default email transport as a fallback
function createDefaultTransport(): nodemailer.Transporter {
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

// Basic verification email
export async function sendVerificationEmail(to: string, verificationToken: string): Promise<{ success: boolean; message: string; verificationLink?: string }> {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Verify your email',
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`
    };

    logger.info('Attempting to send verification email', { to, verificationLink });
    const info = await transporter.sendMail(mailOptions);

    logger.info('Verification email sent', {
      to,
      messageId: info.messageId,
      response: info.response
    });

    return { success: true, message: 'Verification email sent', verificationLink };
  } catch (error: any) {
    logger.error('Failed to send verification email', {
      to,
      error: error?.message || error
    });

    return {
      success: false,
      message: 'Failed to send verification email',
      verificationLink: isDev ? verificationLink : undefined
    };
  }
}

// Styled email variant
export async function sendStyledVerificationEmail(to: string, verificationLink: string): Promise<{ success: boolean; message: string; verificationLink?: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    logger.error('SendGrid API key is not set in environment variables');
    throw new Error('SendGrid API key is required for email sending');
  }

  if (!process.env.EMAIL_FROM) {
    logger.error('Email sender address is not set in environment variables');
    throw new Error('Email sender address is required for email sending');
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Verify Your Email - Account Registration',
      text: `Please verify your email by clicking this link: ${verificationLink}

If you didn't request this email, please ignore it.
This link will expire in 24 hours.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering! Please verify your email by clicking the button below:</p>
        <p>
          <a href="${verificationLink}" 
             style="
               display: inline-block;
               padding: 12px 24px;
               background-color: #4CAF50;
               color: white;
               text-decoration: none;
               border-radius: 4px;
               margin: 10px 0;
             ">
            Verify Email
          </a>
        </p>
        <p>If you didn't request this email, please ignore it.</p>
        <p>This link will expire in 24 hours.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
      </div>`
    });

    logger.info('Verification email sent successfully', {
      to,
      messageId: info.messageId,
      previewUrl: info.preview,
      response: info.response
    });

    return { success: true, message: 'Verification email sent successfully' };
  } catch (error: any) {
    logger.error('Failed to send verification email:', {
      error: error.message,
      stack: error.stack,
      email: to,
      verificationLink,
      response: error.response,
      errorDetails: {
        code: error.code,
        message: error.message,
        response: error.response
      }
    });

    if (isDev) {
      logger.info('DEV MODE: Providing verification link despite email failure');
      return { success: false, verificationLink, message: 'Email failed but link provided for testing' };
    }

    throw new Error(`Failed to send verification email: ${error.message}. Error code: ${error.code}`);
  }
}

// Admin utility
export async function verifyUserByEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.verified) {
      return { success: true, message: 'User already verified' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true }
    });

    logger.info(`User ${email} manually verified`);
    return { success: true, message: 'User verified successfully' };
  } catch (error) {
    logger.error('Error verifying user:', error);
    return { success: false, message: 'Error verifying user' };
  }
}
