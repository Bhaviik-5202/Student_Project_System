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
  // --- DOCUMENTS ---
  {
    title: 'Senior Year Project Guidelines & Policy 2024-25',
    description:
      'Official department handbook detailing milestone deadlines, rubric evaluations, guide allocation rules, and submission protocols.',
    type: 'document',
    category: 'Guidelines',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    downloadsCount: 184,
    status: 'active',
    tags: ['Guidelines', 'Policy', 'Handbook', 'Milestones'],
    url: '/uploads/guidelines_2024.pdf',
  },
  {
    title: 'IEEE Conference Format Guidelines',
    description:
      'Standard double-column IEEE format instructions, reference styling, and manuscript guidelines for final project reports.',
    type: 'document',
    category: 'Documentation',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    downloadsCount: 245,
    status: 'active',
    tags: ['IEEE', 'Formatting', 'Standards', 'Paper'],
    url: '/uploads/ieee_format_guide.pdf',
  },
  {
    title: 'Academic Calendar & Evaluation Schedule 2024',
    description:
      'Key dates for synopsis defense, mid-term review, poster presentation, and final viva voce examination.',
    type: 'document',
    category: 'Guidelines',
    fileSize: '850 KB',
    fileType: 'pdf',
    downloadsCount: 112,
    status: 'active',
    tags: ['Calendar', 'Deadlines', 'Schedule', 'Exams'],
    url: '/uploads/academic_calendar.pdf',
  },
  {
    title: 'Plagiarism Policy & Turnitin Check Protocol',
    description:
      'Guidelines on acceptable similarity index (<15%), citation conventions, and plagiarism verification procedures.',
    type: 'document',
    category: 'Guidelines',
    fileSize: '1.1 MB',
    fileType: 'pdf',
    downloadsCount: 96,
    status: 'active',
    tags: ['Plagiarism', 'Ethics', 'Turnitin', 'Rules'],
    url: '/uploads/plagiarism_policy.pdf',
  },
  {
    title: 'Project Evaluation & Grading Rubric',
    description:
      'Detailed point breakdown for innovation, methodology, code quality, presentation skills, and Q&A defense.',
    type: 'document',
    category: 'Reports',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    downloadsCount: 156,
    status: 'active',
    tags: ['Rubric', 'Grading', 'Evaluation', 'Marks'],
    url: '/uploads/grading_rubric.pdf',
  },

  // --- TEMPLATES ---
  {
    title: 'Project Proposal Template',
    description:
      'Official project proposal document with problem statement, objective, literature review, and proposed methodology sections.',
    type: 'template',
    category: 'Project Proposal',
    fileSize: '620 KB',
    fileType: 'docx',
    downloadsCount: 310,
    status: 'active',
    tags: ['Proposal', 'Synopsis', 'Starter', 'Docx'],
    url: '/uploads/project_proposal_template.docx',
  },
  {
    title: 'Software Requirements Specification (SRS) Template',
    description:
      'Complete IEEE 830 compliant SRS template including functional/non-functional requirements, use cases, and hardware specs.',
    type: 'template',
    category: 'Documentation Template',
    fileSize: '1.2 MB',
    fileType: 'docx',
    downloadsCount: 289,
    status: 'active',
    tags: ['SRS', 'Requirements', 'IEEE830', 'Docx'],
    url: '/uploads/srs_template.docx',
  },
  {
    title: 'Project Progress Report Template',
    description:
      'Bi-weekly and monthly progress report template to track sprint velocity, completed deliverables, and roadmaps.',
    type: 'template',
    category: 'Progress Report',
    fileSize: '480 KB',
    fileType: 'docx',
    downloadsCount: 175,
    status: 'active',
    tags: ['Progress', 'Sprint', 'Status', 'BiWeekly'],
    url: '/uploads/progress_report_template.docx',
  },
  {
    title: 'Final Project Report (IEEE Format)',
    description:
      'Comprehensive final dissertation template pre-formatted with IEEE styling, table of contents, and reference formatting.',
    type: 'template',
    category: 'Final Report',
    fileSize: '2.1 MB',
    fileType: 'docx',
    downloadsCount: 420,
    status: 'active',
    tags: ['FinalReport', 'Dissertation', 'Thesis', 'IEEE'],
    url: '/uploads/final_report_template.docx',
  },
  {
    title: 'Mid-Term & Final Presentation Template',
    description:
      'Official slide deck template with department branding, diagrams, demo screens, and evaluation slide structure.',
    type: 'template',
    category: 'Presentation Template',
    fileSize: '4.8 MB',
    fileType: 'pptx',
    downloadsCount: 380,
    status: 'active',
    tags: ['Presentation', 'Slides', 'PPTX', 'Viva'],
    url: '/uploads/presentation_template.pptx',
  },
  {
    title: 'System Architecture & Design Document',
    description:
      'High-level and low-level architecture design template including ERD, UML sequence diagrams, and API contracts.',
    type: 'template',
    category: 'Documentation Template',
    fileSize: '1.6 MB',
    fileType: 'pdf',
    downloadsCount: 215,
    status: 'active',
    tags: ['Architecture', 'UML', 'ERD', 'SystemDesign'],
    url: '/uploads/architecture_design_template.pdf',
  },
  {
    title: 'Guide Meeting Minutes Template',
    description:
      'Standardized format for logging discussions, supervisor feedback, and action items during weekly guide meetings.',
    type: 'template',
    category: 'Meeting Minutes',
    fileSize: '310 KB',
    fileType: 'docx',
    downloadsCount: 142,
    status: 'active',
    tags: ['Minutes', 'Guide', 'Meeting', 'Log'],
    url: '/uploads/meeting_minutes_template.docx',
  },
  {
    title: 'External Review & Feedback Form',
    description:
      'Form used by industry examiners and external reviewers during project expo and final defense.',
    type: 'template',
    category: 'Review Form',
    fileSize: '520 KB',
    fileType: 'pdf',
    downloadsCount: 98,
    status: 'active',
    tags: ['Review', 'Feedback', 'Examiner', 'Form'],
    url: '/uploads/review_form_template.pdf',
  },

  // --- VIDEOS / MEDIA ---
  {
    title: 'Project Architecture & Tech Stack Selection',
    description:
      'Video guide explaining how to structure full-stack React + Node.js applications and select appropriate database architectures.',
    type: 'video',
    category: 'Tutorials',
    fileSize: '45.0 MB',
    fileType: 'mp4',
    downloadsCount: 260,
    status: 'active',
    tags: ['Video', 'Tutorial', 'Architecture', 'React'],
    url: 'https://www.youtube.com/embed/SqcY0GlETPk',
  },
  {
    title: 'RESTful API Design & MongoDB Integration',
    description:
      'In-depth tutorial covering Express controllers, Mongoose schemas, JWT security, and file handling.',
    type: 'video',
    category: 'Tutorials',
    fileSize: '38.5 MB',
    fileType: 'mp4',
    downloadsCount: 210,
    status: 'active',
    tags: ['Video', 'API', 'NodeJS', 'MongoDB'],
    url: 'https://www.youtube.com/embed/vjf774RKrLc',
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding resources...');

    // Get or create an admin/staff user
    let admin = await User.findOne({ role: { $in: ['admin', 'faculty'] } });
    if (!admin) {
      admin = await User.findOne({});
    }
    if (!admin) {
      console.log(
        'No existing user found. Creating default Academic Admin user...'
      );
      admin = await User.create({
        name: 'Academic Administrator',
        email: 'admin@university.edu',
        password:
          '$2b$12$eImiTXuWVxfM37uY4JANjO2B.8.s3Bf/8QcI8Xm2a4x1234567890', // bcrypt hash for Password123!
        role: 'admin',
        department: 'Computer Science',
      });
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
