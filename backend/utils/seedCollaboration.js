/**
 * Collaboration Seeding Utility
 * Populates the database with sample project discussions and shared files.
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const Discussion = require('../models/discussion.model');
const SharedFile = require('../models/sharedFile.model');

const seedCollaboration = async () => {
  try {
    await connectDB();
    console.log('Connected to database for seeding collaboration data...');

    // 1. Get Users
    const admin = await User.findOne({ role: 'admin' });
    const faculty = await User.findOne({ role: 'faculty' });
    const students = await User.find({ role: 'student' }).limit(3);

    if (!admin || !faculty || students.length < 2) {
      console.error('Required users not found. Please run seedUsers first.');
      process.exit(1);
    }

    // 2. Get a Project
    const project = await Project.findOne();
    if (!project) {
      console.error('No project found. Please run seedProjects first.');
      process.exit(1);
    }

    console.log(`Seeding data for project: ${project.title}`);

    // --- Cleanup Existing Collaboration Data for this Project ---
    await Discussion.deleteMany({ project: project._id });
    await SharedFile.deleteMany({ project: project._id });

    // 5. Create Discussions
    const discussions = [
      {
        title: 'Frontend Framework Choice',
        content: 'Should we use React or Vue for the project dashboard?',
        author: students[0]._id,
        category: 'Technical',
        project: project._id,
        replies: [
          {
            author: students[1]._id,
            content: 'React has better community support.',
          },
          {
            author: faculty._id,
            content: "React is preferred for this project's requirements.",
          },
        ],
      },
      {
        title: 'Database Schema Update',
        content: "I've updated the ER diagram for the user module.",
        author: students[1]._id,
        category: 'Project',
        project: project._id,
      },
      {
        title: 'Weekly Sync Announcement',
        content: 'Meeting moved to 3 PM tomorrow.',
        author: faculty._id,
        category: 'Announcement',
        project: project._id,
      },
    ];
    await Discussion.insertMany(discussions);

    // 6. Create Shared Files
    const sharedFiles = [
      {
        name: 'Project_Proposal_V1.pdf',
        url: 'uploads/resources/sample-doc.pdf',
        size: '1.2 MB',
        type: 'pdf',
        sharedBy: students[0]._id,
        project: project._id,
        downloads: 5,
      },
      {
        name: 'Database_Schema_ERD.png',
        url: 'uploads/resources/sample-image.png',
        size: '850 KB',
        type: 'image',
        sharedBy: students[1]._id,
        project: project._id,
        downloads: 2,
      },
      {
        name: 'Presentation_Draft.pptx',
        url: 'uploads/resources/sample-template.docx',
        size: '4.5 MB',
        type: 'pptx',
        sharedBy: students[0]._id,
        project: project._id,
        downloads: 0,
      },
    ];
    await SharedFile.insertMany(sharedFiles);

    console.log('Collaboration data seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding collaboration data:', err);
    process.exit(1);
  }
};

seedCollaboration();
