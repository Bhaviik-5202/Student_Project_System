/**
 * Email Utility
 * ------------------------------------------------------------------
 * Sends emails using Nodemailer. Falls back to console logging in 
 * development if no SMTP configuration is present.
 */

const nodemailer = require("nodemailer");

/**
 * Dispatch an email message
 * @param {Object} options - Email recipient and content details
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body content
 * @returns {Promise<void>}
 */
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
