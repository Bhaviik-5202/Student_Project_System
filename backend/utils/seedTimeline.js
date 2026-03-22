const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Project = require('../models/project.model');
const Timeline = require('../models/timeline.model');
const connectDB = require('../config/db');

const seedTimelines = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Cleaning up existing timelines...');
    await Timeline.deleteMany({});

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects. Seeding timelines...`);

    if (projects.length === 0) {
      console.log('No projects found. Please seed projects first.');
      process.exit(0);
    }

    const timelinesData = projects.map((project, index) => {
      // Offset dates based on index to make them look realistic
      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() - 2 + index);

      return {
        project: project._id,
        milestones: [
          {
            title: 'Project Initiation & Setup',
            description:
              'Initialize repository, setup environment, and define core architecture.',
            dueDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
            completed: true,
          },
          {
            title: 'Requirements & Schema Design',
            description:
              'Finalize database schema and functional requirements document.',
            dueDate: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000),
            completed: true,
          },
          {
            title: 'MVP Development Phase',
            description:
              'Complete core features and basic UI/UX implementation.',
            dueDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000),
            completed: index === 0,
          },
          {
            title: 'Testing & Bug Fixing',
            description: 'Rigorous testing and resolution of critical issues.',
            dueDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000),
            completed: false,
          },
          {
            title: 'Final Submission & Presentation',
            description: 'Prepare final report and project demonstration.',
            dueDate: new Date(baseDate.getTime() + 75 * 24 * 60 * 60 * 1000),
            completed: false,
          },
        ],
        sprints: [
          {
            name: 'Sprint 1: Core Essentials',
            startDate: new Date(baseDate.getTime()),
            endDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000),
            tasks: ['User Auth', 'Main Dashboard', 'Database Setup'],
          },
          {
            name: 'Sprint 2: Feature Implementation',
            startDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000),
            endDate: new Date(baseDate.getTime() + 29 * 24 * 60 * 60 * 1000),
            tasks: ['Project Catalog', 'Student Management', 'File Sharing'],
          },
          {
            name: 'Sprint 3: Refinement & Polish',
            startDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
            endDate: new Date(baseDate.getTime() + 44 * 24 * 60 * 60 * 1000),
            tasks: ['Performance Tuning', 'UI Polish', 'Unit Tests'],
          },
        ],
      };
    });

    await Timeline.insertMany(timelinesData);
    console.log('Timeline data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedTimelines();
