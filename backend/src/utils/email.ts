import nodemailer from 'nodemailer';

// For development: log emails to console
const transporter = nodemailer.createTransport({
  streamTransport: true,
  newline: 'unix',
  buffer: true,
});

export async function sendVerificationEmail(to: string, verificationLink: string) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Verify your email',
    text: `Please verify your email by clicking this link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`
  });
  // Log the verification link for local/dev
  if (info.message) {
    console.log('Verification email sent:', info.message.toString());
  }
}
