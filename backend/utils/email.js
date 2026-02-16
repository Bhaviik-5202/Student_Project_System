/**
 * Email Utility
 * ------------------------------------------------------------------
 * Sends emails using Nodemailer (production-ready).
 * Falls back to console logging in development if no SMTP is configured.
 * Environment Variables Required (for SMTP):
 *   EMAIL_HOST
 *   EMAIL_PORT
 *   EMAIL_USER
 *   EMAIL_PASS
 *   EMAIL_FROM
 */

const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  if (!process.env.EMAIL_HOST) {
    console.log("📧 [DEV EMAIL LOG]");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Text:", text);
    console.log("HTML:", html);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
