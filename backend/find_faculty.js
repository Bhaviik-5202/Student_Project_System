const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

async function findFaculty() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const faculty = await User.findOne({ role: 'faculty' });
    if (faculty) {
      console.log('Found Faculty:', {
        name: faculty.name,
        email: faculty.email,
        role: faculty.role,
      });
    } else {
      console.log('No faculty found.');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

findFaculty();
