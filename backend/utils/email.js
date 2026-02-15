// Utility for sending emails (stub, replace with nodemailer or similar in production)
async function sendEmail({ to, subject, text, html }) {
  // Implement with nodemailer or any email service
  console.log("Sending email:", { to, subject, text, html });
  // In production, integrate with real email provider
}

module.exports = sendEmail;
