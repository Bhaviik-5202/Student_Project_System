/**
 * Course Seeding Utility
 * Initializes the academic catalog with a comprehensive set of foundational and advanced computer science courses.
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('../models/courses.model');
const Staff = require('../models/staff.model');
const Student = require('../models/student.model');
const User = require('../models/user.model');

const coursesData = [
  {
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description:
      'Foundational concepts of computing, programming, and algorithm design using Python.',
    semester: 'Fall 2024',
    credits: 4,
    schedule: 'Mon, Wed 09:00 AM',
    room: 'LT-101',
    syllabus: [
      {
        week: 1,
        topic: 'Computational Thinking',
        description: 'Binary systems and logical gates.',
      },
      {
        week: 2,
        topic: 'Python Basics',
        description: 'Variables, loops, and control structures.',
      },
      {
        week: 3,
        topic: 'Functions & Scope',
        description: 'Modular programming concepts.',
      },
    ],
  },
  {
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    description:
      'Study of advanced data structures like trees, heaps, and graphs along with sorting and searching algorithms.',
    semester: 'Fall 2024',
    credits: 4,
    schedule: 'Tue, Thu 11:00 AM',
    room: 'Lab-204',
    syllabus: [
      {
        week: 1,
        topic: 'Complexity Analysis',
        description: 'Big O notation and efficiency.',
      },
      {
        week: 2,
        topic: 'Linked Lists',
        description: 'Dynamic memory and node-based structures.',
      },
    ],
  },
  {
    name: 'Database Management Systems',
    code: 'CS302',
    description:
      'Relational database design, SQL, normalization, and overview of NoSQL databases.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Wed, Fri 02:00 PM',
    room: 'LT-302',
  },
  {
    name: 'Operating Systems',
    code: 'CS401',
    description:
      'Internal mechanics of OS, process management, memory allocation, and file systems.',
    semester: 'Fall 2024',
    credits: 4,
    schedule: 'Mon, Thu 10:30 AM',
    room: 'LT-401',
  },
  {
    name: 'Web Application Development',
    code: 'CS205',
    description:
      'Modern web technologies including HTML5, CSS3, JavaScript (React), and Node.js backend.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Tue, Fri 09:00 AM',
    room: 'Web Lab',
  },
  {
    name: 'Discrete Mathematics',
    code: 'MAT105',
    description:
      'Logic, set theory, combinatorics, and graph theory applied to computer science.',
    semester: 'Fall 2024',
    credits: 4,
    schedule: 'Wed, Sat 11:00 AM',
    room: 'LT-102',
  },
  {
    name: 'Machine Learning Foundations',
    code: 'AI301',
    description:
      'Introduction to supervised and unsupervised learning, regression, and neural networks.',
    semester: 'Fall 2024',
    credits: 4,
    schedule: 'Mon, Wed 03:30 PM',
    room: 'AI Lab',
  },
  {
    name: 'Computer Networks',
    code: 'CS305',
    description:
      'Networking protocols (TCP/IP), OSI model, routing, and network security basics.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Tue, Thu 01:30 PM',
    room: 'Net-Lab',
  },
  {
    name: 'Software Engineering',
    code: 'CS310',
    description:
      'Software development life cycle, Agile methodologies, and design patterns.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Thu, Sat 10:00 AM',
    room: 'Seminar-1',
  },
  {
    name: 'Artificial Intelligence',
    code: 'AI402',
    description:
      'Heuristic search, logic-based reasoning, and knowledge representation.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Mon, Fri 12:00 PM',
    room: 'LT-105',
  },
  {
    name: 'Cloud Computing',
    code: 'CS415',
    description:
      'Virtualization, distributed systems, and services provided by AWS/Azure/GCP.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Wed, Sat 09:00 AM',
    room: 'Lab-405',
  },
  {
    name: 'Cyber Security Fundamentals',
    code: 'CS420',
    description:
      'Cryptography, network security threats, and defensive programming techniques.',
    semester: 'Fall 2024',
    credits: 3,
    schedule: 'Tue, Fri 03:00 PM',
    room: 'Sec-Lab',
  },
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('No MongoDB URI found in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Get or create a Faculty Staff
    let faculty = await Staff.findOne({ role: 'faculty' });
    if (!faculty) {
      faculty = await Staff.create({
        name: 'Dr. Alan Turing',
        email: 'alan.turing@example.com',
        department: 'Computer Science',
        role: 'faculty',
      });
      console.log('Created default faculty member: Dr. Alan Turing');
    }

    // 2. Clear existing courses (to remove dummy data)
    await Course.deleteMany({});
    console.log('Cleared existing courses.');

    // 3. Insert new courses
    const coursesWithFaculty = coursesData.map((c) => ({
      ...c,
      faculty: faculty._id,
    }));
    const insertedCourses = await Course.insertMany(coursesWithFaculty);
    console.log(`Successfully seeded ${insertedCourses.length} courses.`);

    // 4. Enroll current user (if any student user exists)
    const studentUser = await User.findOne({ role: 'student' });
    if (studentUser) {
      console.log(
        `Found student user: ${studentUser.email}. Setting up profile...`
      );
      let studentProfile = await Student.findOne({ email: studentUser.email });
      if (!studentProfile) {
        studentProfile = await Student.create({
          name: studentUser.name,
          email: studentUser.email,
          rollNumber: `S-${Date.now().toString().slice(-6)}`,
          department: 'Computer Science',
          year: 2,
        });
      }

      // Enroll in first 6 courses for a full-looking journey
      const courseIds = insertedCourses.slice(0, 6).map((c) => c._id);
      await Student.findByIdAndUpdate(studentProfile._id, {
        $set: { enrolledCourses: courseIds },
      });
      console.log(`Enrolled student ${studentUser.email} in 6 courses.`);
    } else {
      console.log('No student user found to auto-enroll. Seeded catalog only.');
    }

    console.log('Seeding process completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seed();
