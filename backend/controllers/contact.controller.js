const sendEmail = require('../utils/email');
const sendResponse = require('../utils/response');
const Inquiry = require('../models/inquiry.model');

const TARGET_EMAIL = 'er.bhavik5202@gmail.com';

/**
 * Submit support inquiry email and save to MongoDB
 * @route POST /api/v1/contact/inquiry
 */
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, subject, message, role } = req.body;
    const userRole = role || (req.user ? req.user.role : 'Guest');
    const dateStr = new Date().toLocaleString();

    // 1. Save Inquiry in Database
    const inquiry = new Inquiry({
      name: name || 'Anonymous',
      email: email || 'No email provided',
      subject: subject || 'General Inquiry',
      message: message || '',
      role: userRole,
      type: 'Inquiry',
      submittedAt: new Date(),
    });
    await inquiry.save();

    // 2. Dispatch Email to Support Email (er.bhavik5202@gmail.com)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">New Support Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User Role:</strong> ${userRole}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Date & Time:</strong> ${dateStr}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #4f46e5; margin-top: 15px;">
          <p style="margin: 0; font-weight: bold;">Message:</p>
          <p style="margin-top: 5px; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: TARGET_EMAIL,
        subject: `[Support Inquiry] ${subject || 'New Message from ' + name}`,
        html: htmlContent,
        text: `New Support Inquiry from ${name} (${email}, Role: ${userRole}):\nSubject: ${subject}\nDate: ${dateStr}\n\nMessage:\n${message}`,
      });
    } catch (emailErr) {
      console.warn('Email notification fallback:', emailErr.message);
    }

    sendResponse(res, {
      success: true,
      message: 'Support inquiry submitted successfully',
      data: inquiry,
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to submit support inquiry',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Submit feedback email and save to MongoDB
 * @route POST /api/v1/contact/feedback
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, category, feedback, role } = req.body;
    const userRole = role || (req.user ? req.user.role : 'Guest');
    const dateStr = new Date().toLocaleString();

    // 1. Save Feedback in Database
    const inquiry = new Inquiry({
      name: name || 'Anonymous',
      email: email || 'No email provided',
      subject: `Feedback: ${category || 'General'}`,
      message: feedback || '',
      rating: Number(rating) || 5,
      category: category || 'General',
      role: userRole,
      type: 'Feedback',
      submittedAt: new Date(),
    });
    await inquiry.save();

    // 2. Dispatch Email to Support Email (er.bhavik5202@gmail.com)
    const stars = '⭐'.repeat(Number(rating) || 5);
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">New Platform Feedback Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User Role:</strong> ${userRole}</p>
        <p><strong>Rating:</strong> ${stars} (${rating} / 5)</p>
        <p><strong>Category:</strong> ${category || 'General'}</p>
        <p><strong>Date & Time:</strong> ${dateStr}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #8b5cf6; margin-top: 15px;">
          <p style="margin: 0; font-weight: bold;">Feedback Comments:</p>
          <p style="margin-top: 5px; white-space: pre-wrap;">${feedback}</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: TARGET_EMAIL,
        subject: `[Platform Feedback] ${stars} Rating from ${name}`,
        html: htmlContent,
        text: `New Platform Feedback from ${name} (${email}, Role: ${userRole}):\nRating: ${rating}/5\nCategory: ${category}\nDate: ${dateStr}\n\nFeedback:\n${feedback}`,
      });
    } catch (emailErr) {
      console.warn('Email notification fallback:', emailErr.message);
    }

    sendResponse(res, {
      success: true,
      message: 'Feedback submitted successfully',
      data: inquiry,
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to submit feedback',
        error: error.message,
      },
      500
    );
  }
};
