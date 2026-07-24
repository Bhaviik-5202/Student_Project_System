/**
 * Email Templates Module
 * Provides modern, responsive, and branded HTML templates for system emails.
 */

/**
 * Generates the base HTML template for emails, including standard head,
 * responsive styles, branding header (Student Project System), and footer.
 *
 * @param {Object} params
 * @param {string} params.title - Title used in the header and document title
 * @param {string} params.preheader - Visually hidden preview text for email clients
 * @param {string} params.contentHtml - Core HTML content of the email
 * @returns {string} Fully styled HTML document
 */
function getBaseEmailTemplate({ title, preheader, contentHtml, subtitle }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    /* Google Fonts import */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Global/client resets */
    body, table, td, a { 
      -webkit-text-size-adjust: 100%; 
      -ms-text-size-adjust: 100%; 
    }
    table, td { 
      mso-table-lspace: 0pt; 
      mso-table-rspace: 0pt; 
    }
    img { 
      -ms-interpolation-mode: bicubic; 
    }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      background-color: #f8fafc;
    }
    
    /* Responsive overrides */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .content-padding {
        padding: 28px 20px !important;
      }
      .header-padding {
        padding: 28px 20px !important;
      }
      .button {
        display: block !important;
        padding: 14px 24px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: center !important;
      }
      .footer-padding {
        padding: 24px 20px !important;
      }
      h1 {
        font-size: 22px !important;
      }
    }
    
    @media only screen and (max-width: 480px) {
      .content-padding {
        padding: 24px 16px !important;
      }
      .header-padding {
        padding: 24px 16px !important;
      }
      .footer-padding {
        padding: 20px 16px !important;
      }
      h1 {
        font-size: 20px !important;
      }
    }
    
    /* Dark Mode Theme Adjustments */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background-color: #0f172a !important;
      }
      .card-bg {
        background-color: #1e293b !important;
        border-color: #334155 !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
      }
      .text-title {
        color: #f8fafc !important;
      }
      .text-body {
        color: #cbd5e1 !important;
      }
      .text-muted {
        color: #94a3b8 !important;
      }
      .fallback-box {
        background-color: #0f172a !important;
        border-color: #334155 !important;
      }
      .fallback-text {
        color: #94a3b8 !important;
      }
      .footer-bg {
        background-color: #0f172a !important;
        border-top-color: #334155 !important;
      }
      .code-container {
        background-color: #0f172a !important;
      }
      .code-text {
        color: #60a5fa !important;
      }
      .header-gradient {
        background-color: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
        border-bottom-color: #334155 !important;
      }
      .divider {
        border-color: #334155 !important;
      }
      .link {
        color: #60a5fa !important;
      }
      .badge {
        background-color: #0f172a !important;
        color: #60a5fa !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin: 0; padding: 0; background-color: #f8fafc;">
  <!-- Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #f8fafc; opacity: 0;">
    ${preheader}
  </div>

  <table class="body-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 40px 0; width: 100%;">
    <tr>
      <td align="center" valign="top">
        <table class="email-container card-bg" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.03);">
          
          <!-- Header -->
          <tr>
            <td class="header-padding header-gradient" style="background-color: #0f172a; background-image: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px; text-align: center; border-bottom: 1px solid #1e293b;">
              <!-- Badge -->
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 4px 16px; border-radius: 20px; margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #ffffff;">
                  Student Project System
                </span>
              </div>
              <h1 style="margin: 8px 0 0 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                ${title}
              </h1>
              <!-- Optional subtitle -->
              ${subtitle ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8; font-weight: 400;">${subtitle}</p>` : ''}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 40px; background-color: transparent;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding footer-bg" style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">
                Student Project System Portal
              </p>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                This is an automated security notification. Please do not reply directly to this message.
              </p>
              <!-- Divider -->
              <div style="width: 60px; height: 1px; background: #e2e8f0; margin: 12px auto 16px auto;"></div>
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td style="font-size: 11px; color: #cbd5e1; line-height: 1.6;">
                    &copy; ${new Date().getFullYear()} Student Project System. All rights reserved.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 11px; color: #94a3b8; line-height: 1.6; padding-top: 4px;">
                    <a href="#" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                    <span style="color: #cbd5e1;">·</span>
                    <a href="#" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                    <span style="color: #cbd5e1;">·</span>
                    <a href="#" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Contact Support</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Returns the HTML for a Password Reset email
 *
 * @param {string} userName - Name of the user receiving the email
 * @param {string} resetUrl - Complete password reset URL
 * @param {number} expiryMinutes - Token expiry time in minutes
 * @returns {string} Final email HTML
 */
function getPasswordResetEmail(userName, resetUrl, expiryMinutes) {
  const title = 'Reset Your Password';
  const preheader =
    'Use this link to securely reset your password for the Student Project System.';

  const contentHtml = `
    <p class="text-title" style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
      Hello ${userName},
    </p>
    <p class="text-body" style="margin: 0 0 24px 0; font-size: 15px; color: #475569; line-height: 1.6;">
      We received a request to reset the password for your Student Project System account. Click the button below to create a new, secure password:
    </p>

    <!-- Button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 32px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" bgcolor="#2563eb" style="border-radius: 12px; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);">
                <a href="${resetUrl}" target="_blank" class="button" style="display: inline-block; padding: 16px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                  Reset My Password
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Expiry Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px 8px 8px 4px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0; font-size: 13.5px; color: #92400e; line-height: 1.5; font-weight: 500;">
            <span style="font-size: 16px; margin-right: 6px; vertical-align: middle;">⏱</span> 
            <strong>Link Expiry:</strong> This secure link expires in ${expiryMinutes} minutes and can only be used once.
          </p>
        </td>
      </tr>
    </table>

    <!-- Security Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px 8px 8px 4px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0; font-size: 13.5px; color: #166534; line-height: 1.5; font-weight: 500;">
            <span style="font-size: 16px; margin-right: 6px; vertical-align: middle;">🛡</span>
            <strong>Security Notice:</strong> If you did not request this change, you can safely ignore this email. Your password will remain secure and unchanged.
          </p>
        </td>
      </tr>
    </table>

    <!-- Fallback Link -->
    <div class="fallback-box" style="background-color: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 10px; padding: 16px 20px;">
      <p class="fallback-text" style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; line-height: 1.4;">
        If the button above does not work, copy and paste this URL into your browser:
      </p>
      <p style="margin: 0; word-break: break-all;">
        <a href="${resetUrl}" style="font-size: 12.5px; color: #2563eb; text-decoration: underline; word-break: break-all; font-family: monospace;">
          ${resetUrl}
        </a>
      </p>
    </div>
  `;

  return getBaseEmailTemplate({ title, preheader, contentHtml });
}

/**
 * Returns the HTML for an OTP verification email (Sign Up or Resend code)
 *
 * @param {string} userName - Name of the user receiving the email
 * @param {string} otp - 6-digit verification code
 * @param {boolean} isResend - True if this is a resubmitted code email
 * @param {number} [resendCount] - Resend attempt number (e.g. 2 of 3)
 * @returns {string} Final email HTML
 */
function getVerificationEmail(
  userName,
  otp,
  isResend = false,
  resendCount = null
) {
  const title = isResend ? 'New Verification Code' : 'Verify Your Account';
  const preheader = isResend
    ? 'Use your new verification code to complete your signup.'
    : 'Thank you for registering with the Student Project System. Verify your email to get started.';

  const contentHtml = `
    <p class="text-title" style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
      Hello ${userName},
    </p>
    <p class="text-body" style="margin: 0 0 24px 0; font-size: 15px; color: #475569; line-height: 1.6;">
      ${
        isResend
          ? 'Here is your new 6-digit verification code to complete your registration.'
          : 'Thank you for registering with the Student Project System. Use the verification code below to complete your registration and verify your email address:'
      }
    </p>

    <!-- Code Block -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 32px 0;">
      <tr>
        <td align="center">
          <table class="code-container" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; border-radius: 14px; width: 260px;">
            <tr>
              <td align="center" style="padding: 18px; font-family: monospace;">
                <span class="code-text" style="font-size: 34px; font-weight: 700; letter-spacing: 6px; color: #1e3a8a; display: block;">
                  ${otp}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Expiry Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px 8px 8px 4px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0; font-size: 13.5px; color: #92400e; line-height: 1.5; font-weight: 500;">
            <span style="font-size: 16px; margin-right: 6px; vertical-align: middle;">⏱</span> 
            <strong>Code Expiry:</strong> This verification code is valid for <strong>5 minutes</strong>.
            ${resendCount ? ` This is attempt <strong>${resendCount} of 3</strong>.` : ''}
          </p>
        </td>
      </tr>
    </table>

    <!-- Security Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px; background-color: #f8fafc; border-left: 4px solid #94a3b8; border-radius: 4px 8px 8px 4px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
            <span style="font-size: 16px; margin-right: 6px; vertical-align: middle;">🛡</span>
            If you did not initiate this request, you can safely ignore this email. No changes will be made to your account.
          </p>
        </td>
      </tr>
    </table>
  `;

  return getBaseEmailTemplate({ title, preheader, contentHtml });
}

module.exports = {
  getPasswordResetEmail,
  getVerificationEmail,
};
