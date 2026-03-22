const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Project = require('../models/project.model');
const Staff = require('../models/staff.model');
const db = require('../config/db');

async function diagnose() {
  try {
    await db();
    console.log('Database connected.');

    const projects = await Project.find({}).populate('guide');
    console.log(`Found ${projects.length} total projects.`);

    projects.forEach((p) => {
      console.log(`Project: ${p.title} (Slug: ${p.slug || 'MISSING'})`);
      console.log(
        `- Guide ID in DB: ${p.guide ? p.guide._id || p.guide : 'None'}`
      );
      console.log(`- Is Populated? ${p.guide && p.guide.name ? 'Yes' : 'No'}`);
      if (p.guide && p.guide.name) {
        console.log(`- Guide Name: ${p.guide.name}`);
      } else if (p.guide) {
        console.log('- Guide object keys:', Object.keys(p.guide));
      }
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

diagnose();
