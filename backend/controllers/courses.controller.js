// courses.controller.js
const Course = require('../models/course.model'); // You need to create this model

exports.createCourse = async (req, res) => {
  try {
    const { name, code, description, faculty } = req.body;
    const course = new Course({ name, code, description, faculty });
    await course.save();
    res.status(201).json({ error: false, data: course, message: 'Course created successfully' });
  } catch (error) {
    res.status(500).json({ error: true, data: null, message: error.message });
  }
};
