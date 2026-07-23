const sendResponse = require('../utils/response');

/**
 * Help Controller
 * Serves Help Center overview, role-based user guides, troubleshooting, and FAQs.
 */

const FAQS = [
  {
    id: 1,
    category: 'Login & Access',
    question: 'How do I log into the Student Project System?',
    answer: 'Use your registered institutional email and password on the Login page. Select your role (Student, Faculty, or Admin) to access your personalized dashboard.',
  },
  {
    id: 2,
    category: 'Registration',
    question: 'What happens after I register a new student or faculty account?',
    answer: 'A 6-digit verification code (OTP) is dispatched to your registered email. Enter the OTP code on the verification screen to activate your profile.',
  },
  {
    id: 3,
    category: 'Project Submission',
    question: 'How do I submit a new Project Proposal?',
    answer: 'Navigate to Projects → New Proposal. Fill out the project title, project type (Web, Mobile, AI/ML, etc.), classification (Major/Minor/UDP/IDP), assign active team members, select your Project Guide, and click Submit.',
  },
  {
    id: 4,
    category: 'Guide Allocation',
    question: 'How are Faculty Guides assigned to project groups?',
    answer: 'Admins and Department Coordinators can assign active faculty members through the Guide Allocation page under the Projects module.',
  },
  {
    id: 5,
    category: 'Meetings',
    question: 'How do project synchronization meetings work?',
    answer: 'Admins and Faculty guides can schedule review meetings via Meetings → Schedule Meeting. Scheduled meetings appear live on all participant dashboards.',
  },
  {
    id: 6,
    category: 'Resources',
    question: 'Where can I download templates and project documentation guidelines?',
    answer: 'Go to Resources → Document Library or Resource Browser. You can preview or download official university templates, syllabus guidelines, and rubrics directly.',
  },
  {
    id: 7,
    category: 'Reports & Analytics',
    question: 'Can I export project status reports as PDF or CSV?',
    answer: 'Yes! Admins and Faculty can generate dynamic project reports under Reports, with instant export options for PDF, Excel, and CSV formats.',
  },
  {
    id: 8,
    category: 'Roles & Permissions',
    question: 'What are the permission differences between Student, Faculty, and Admin?',
    answer: 'Students can manage their project progress and attend meetings. Faculty can review proposals, evaluate milestones, grade projects, and host sync meetings. Admins have full system control, user management, and audit rights.',
  },
];

const CATEGORIES = [
  'Login & Access',
  'Registration',
  'Project Submission',
  'Guide Allocation',
  'Meetings',
  'Resources',
  'Reports & Analytics',
  'Roles & Permissions',
];

const GETTING_STARTED_STEPS = [
  { step: 1, title: 'Complete Profile', desc: 'Ensure your department and contact details are updated.' },
  { step: 2, title: 'Form or Join a Team', desc: 'Assign active student teammates for your project.' },
  { step: 3, title: 'Submit Proposal', desc: 'Submit project abstract, type, and request guide allocation.' },
  { step: 4, title: 'Track Milestones', desc: 'Attend sync meetings and update progress sliders.' },
];

/**
 * Get Help Center Overview
 * @route GET /api/v1/help/overview
 * @access Public / Authenticated
 */
exports.getHelpOverview = async (req, res) => {
  try {
    sendResponse(
      res,
      {
        success: true,
        message: 'Help overview fetched successfully',
        data: {
          categories: CATEGORIES,
          faqs: FAQS,
          gettingStarted: GETTING_STARTED_STEPS,
          supportContact: {
            email: 'support@sps-univ.edu',
            phone: '+1 (800) 555-0199',
            hours: 'Mon - Fri, 9:00 AM - 5:00 PM EST',
          },
        },
      },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: 'Failed to fetch help overview', error: error.message }, 500);
  }
};

/**
 * Get FAQs
 * @route GET /api/v1/help/faqs
 * @access Public / Authenticated
 */
exports.getFaqs = async (req, res) => {
  try {
    sendResponse(
      res,
      {
        success: true,
        message: 'FAQs fetched successfully',
        data: FAQS,
      },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: 'Failed to fetch FAQs', error: error.message }, 500);
  }
};

const CHAPTERS = [
  {
    id: 1,
    title: '1. Login & Authentication',
    sections: [
      {
        title: 'Account Authentication & OTP Verification',
        content: 'Access the system by selecting your assigned role (Student, Faculty, or Admin) on the Login screen. Enter your institutional email address and password. First-time registrations generate a 6-digit One-Time Password (OTP) sent to your inbox to activate your credentials.',
      },
    ],
  },
  {
    id: 2,
    title: '2. Role-Based Dashboards',
    sections: [
      {
        title: 'Personalized Workspace Dashboards',
        content: 'The system renders customized dashboards based on user permissions: Admin Dashboard provides system oversight, user management, and global reports. Faculty Dashboard displays guided projects, review queues, and sync meetings. Student Dashboard tracks assigned projects, guide updates, upcoming deadlines, and notifications.',
      },
    ],
  },
  {
    id: 3,
    title: '3. Project Management',
    sections: [
      {
        title: 'Submitting & Editing Project Proposals',
        content: 'Students create proposals under Projects → New Proposal. Select project category (Web, Mobile, AI/ML, Cyber Security, etc.), classification (Major Project, Minor Project, UDP, IDP, Academic), assign active student teammates, and choose a Faculty Guide.',
      },
    ],
  },
  {
    id: 4,
    title: '4. Faculty Guide Allocation',
    sections: [
      {
        title: 'Guide Assignment & Workload Distribution',
        content: 'Faculty members guide up to 5 project groups. Department heads and administrators can allocate or reassign faculty guides dynamically via the Guide Allocation tool.',
      },
    ],
  },
  {
    id: 5,
    title: '5. Meeting Management',
    sections: [
      {
        title: 'Review Meetings & Event Synchronization',
        content: 'Faculty guides and admins schedule evaluation meetings. Scheduled meetings appear live across Student, Faculty, and Admin dashboards without requiring manual page refreshes.',
      },
    ],
  },
  {
    id: 6,
    title: '6. Resource Management',
    sections: [
      {
        title: 'Document Library, Preview & Downloads',
        content: 'Access project guidelines, SRS templates, evaluation rubrics, and video tutorials under Resources. Authenticated users can preview documents in-browser or download attachments directly.',
      },
    ],
  },
  {
    id: 7,
    title: '7. Reports & Export Capabilities',
    sections: [
      {
        title: 'Dynamic Analytics & Multi-Format Exports',
        content: 'Generate dynamic database reports on project status distribution, guide workloads, and student progress. Export reports to PDF, Excel, or CSV formats with single-click actions.',
      },
    ],
  },
  {
    id: 8,
    title: '8. Notifications & Real-Time Alerts',
    sections: [
      {
        title: 'System Activity Alerts',
        content: 'Receive instant notifications for project status updates, meeting invitations, guide assignments, and milestone deadlines through the top navigation alert bell.',
      },
    ],
  },
  {
    id: 9,
    title: '9. Profile & Settings Management',
    sections: [
      {
        title: 'Account Customization & Security',
        content: 'Update your contact details, profile picture, department information, and change password securely in Profile Settings.',
      },
    ],
  },
  {
    id: 10,
    title: '10. Troubleshooting & Support',
    sections: [
      {
        title: 'Common Issues & Help Contact',
        content: 'If you encounter login errors or document download issues, check your internet connectivity or request a new OTP code. Contact institutional IT support at support@sps-univ.edu for assistance.',
      },
    ],
  },
];

/**
 * Get User Guide Chapters
 * @route GET /api/v1/help/guide
 * @access Public / Authenticated
 */
exports.getGuide = async (req, res) => {
  try {
    sendResponse(
      res,
      {
        success: true,
        message: 'User guide fetched successfully',
        data: CHAPTERS,
      },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: 'Failed to fetch user guide', error: error.message }, 500);
  }
};
