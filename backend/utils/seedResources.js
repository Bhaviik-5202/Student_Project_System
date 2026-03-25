/**
 * Resource Seeding Utility
 * Populates the system with essential academic assets, templates, and multimedia tutorials.
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Resource = require('../models/resource.model');
const User = require('../models/user.model');
const connectDB = require('../config/db');

const resourceData = [
  // Documents
  {
    title: 'Project Guidelines 2024',
    description:
      'Official guidelines for senior year project development and documentation.',
    type: 'document',
    url: '/uploads/guidelines_2024.pdf',
  },
  {
    title: 'IEEE Format Template',
    description: 'Standard IEEE conference paper format for project reports.',
    type: 'document',
    url: '/uploads/ieee_template.docx',
  },
  {
    title: 'Academic Calendar Fall 2024',
    description: 'Important dates for submissions, evaluations, and holidays.',
    type: 'document',
    url: '/uploads/calendar_fall_2024.pdf',
  },
  // Templates
  {
    title: 'SRS Template',
    description:
      'Software Requirements Specification template with detailed sections.',
    type: 'template',
    url: '/uploads/srs_template.docx',
  },
  {
    title: 'System Architecture Design',
    description:
      'Template for creating architectural diagrams and component descriptions.',
    type: 'template',
    url: '/uploads/architecture_template.pdf',
  },
  {
    title: 'Project Presentation PPT',
    description:
      'Official slide deck template for mid-semester and final reviews.',
    type: 'template',
    url: '/uploads/presentation_style.pptx',
  },
  // Videos
  {
    title: 'Getting Started with React',
    description:
      'Comprehensive tutorial on building your first frontend with React and Vite.',
    type: 'video',
    url: 'https://www.youtube.com/embed/SqcY0GlETPk',
  },
  {
    title: 'Node.js API Development',
    description:
      'Step-by-step guide to creating RESTful services with Express and MongoDB.',
    type: 'video',
    url: 'https://www.youtube.com/embed/vjf774RKrLc',
  },
  {
    title: 'Database Normalization',
    description:
      'Understanding 1NF, 2NF, and 3NF for efficient database design.',
    type: 'video',
    url: 'https://www.youtube.com/embed/5lsC10Osqt0',
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding resources...');

    // Get an admin/staff user
    const admin = await User.findOne({ role: { $in: ['admin', 'faculty'] } });
    if (!admin) {
      console.error('No admin/faculty user found to assign as uploader.');
      process.exit(1);
    }

    // Clear existing
    await Resource.deleteMany({});
    console.log('Cleared existing resources.');

    const resourcesWithUser = resourceData.map((r) => ({
      ...r,
      uploadedBy: admin._id,
    }));

    await Resource.insertMany(resourcesWithUser);
    console.log(`Successfully seeded ${resourcesWithUser.length} resources.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seed();
