/**
 * Migration Script: Generate Slugs for Existing Projects
 * Run this script once to populate the slug field for all projects.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Project = require('../models/project.model');

const migrate = async () => {
  try {
    await connectDB();
    console.log('Starting slug migration...');

    const projects = await Project.find({ slug: { $exists: false } });
    console.log(`Found ${projects.length} projects without slugs.`);

    for (const project of projects) {
      try {
        // The pre-save hook will handle slug generation
        // We just need to trigger a save
        await project.save();
        console.log(
          `Generated slug for project: ${project.title} -> ${project.slug}`
        );
      } catch (err) {
        console.error(`Failed to generate slug for project: ${project.title}`);
        console.error(err);
      }
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
