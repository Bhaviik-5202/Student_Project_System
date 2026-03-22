const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Project = require("../models/project.model");
const Staff = require("../models/staff.model");
const db = require("../config/db");

async function testAssignment() {
  try {
    await db();
    console.log("Database connected.");

    // Find a project and a staff member
    const project = await Project.findOne();
    const staff = await Staff.findOne();

    if (!project || !staff) {
      console.log("Missing project or staff records.");
      process.exit(1);
    }

    console.log(`Assigning Staff ${staff.name} (${staff._id}) to Project ${project.title} (${project._id})`);

    // Assign guide
    project.guide = staff._id;
    await project.save();
    console.log("Saved guide to project.");

    // Fetch again with populate
    const updatedProject = await Project.findById(project._id).populate("guide");
    console.log(`Re-fetched Project Guide: ${updatedProject.guide?.name || "Ref failed"}`);

    if (updatedProject.guide?.name === staff.name) {
      console.log("SUCCESS: Assignment persisted and populated correctly.");
    } else {
      console.log("FAILURE: Assignment did not persist correctly.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAssignment();
