const faqService = require('../services/faq.service');
const supportticketService = require('../services/supportticket.service');
const sendResponse = require('../utils/response');

/**
 * Help Controller
 * Aggregates FAQ and Support functionality for the Help Center.
 */

/**
 * Get help overview
 * @route   GET /api/help/overview
 * @desc    Retrieve aggregated FAQ list and categories for the help center
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getHelpOverview = async (req, res) => {
  try {
    const faqs = [
      {
        id: '1',
        question: 'How do I create a new project?',
        answer:
          "Navigate to the Projects page and click the 'New Project' button. Fill in the title, description, and team members.",
        category: 'Projects',
      },
      {
        id: '2',
        question: 'How can I invite team members?',
        answer:
          "In the project settings, go to the 'Team' tab and enter the email addresses of the users you want to invite.",
        category: 'Team',
      },
      {
        id: '3',
        question: 'What are milestones?',
        answer:
          "Milestones are major checkpoints in your project timeline. You can set them up in the 'Milestones' tab of your project.",
        category: 'Planning',
      },
      {
        id: '4',
        question: 'How do I submit my report?',
        answer:
          "Go to the 'Submissions' tab within your project, upload your document, and click 'Submit for Review'.",
        category: 'Submissions',
      },
      {
        id: '5',
        question: 'How can I contact my faculty advisor?',
        answer:
          "You can use the 'Discussions' module or schedule a meeting via the 'Meetings' tab.",
        category: 'Communication',
      },
      {
        id: '6',
        question: 'Can I delete a project I created?',
        answer:
          'Yes, but only if no submissions have been made. Go to Project Settings > Advanced > Delete Project.',
        category: 'Projects',
      },
      {
        id: '7',
        question: 'How do I track my attendance?',
        answer:
          "You can view your project meeting attendance in the 'Attendance' section of your dashboard.",
        category: 'Attendance',
      },
      {
        id: '8',
        question: 'What happens if I miss a deadline?',
        answer:
          "The system will mark your submission as 'Late'. Please contact your faculty advisor to discuss any extensions.",
        category: 'Submissions',
      },
      {
        id: '9',
        question: 'How do I change my profile picture?',
        answer:
          'Go to Settings > Profile and click on your current avatar to upload a new image.',
        category: 'Account',
      },
      {
        id: '10',
        question: 'Where can I find project templates?',
        answer:
          "Templates for reports, presentations, and code structures are available in the 'Resource Browser'.",
        category: 'Resources',
      },
    ];

    const groupedFaqs = faqs.reduce((acc, faq) => {
      const category = faq.category || 'General';
      if (!acc[category]) {
        acc[category] = { category, questions: [] };
      }
      acc[category].questions.push({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      });
      return acc;
    }, {});

    const categories = Object.keys(groupedFaqs);
    const faqList = Object.values(groupedFaqs);

    sendResponse(
      res,
      {
        success: true,
        data: {
          faqs: faqs,
          groupedFaqs: faqList,
          categories: categories,
        },
      },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get knowledge base data
 * @route   GET /api/help/kb
 * @desc    Retrieve article categories and popular documentation items
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getKbData = async (req, res) => {
  try {
    const kbData = {
      categories: [
        {
          id: '1',
          name: 'Getting Started',
          articles: [
            { id: 'a1', title: 'System Overview', views: 120 },
            { id: 'a2', title: 'Creating Your First Project', views: 85 },
            { id: 'a3', title: 'Inviting Team Members', views: 64 },
          ],
        },
        {
          id: '2',
          name: 'Project Management',
          articles: [
            { id: 'a4', title: 'Managing Milestones', views: 45 },
            { id: 'a5', title: 'Tracking Progress', views: 32 },
            { id: 'a6', title: 'Exporting Reports', views: 28 },
          ],
        },
      ],
      popularArticles: [
        {
          id: 'a1',
          title: 'System Overview',
          category: 'Getting Started',
          views: 120,
        },
        {
          id: 'a2',
          title: 'Creating Your First Project',
          category: 'Getting Started',
          views: 85,
        },
      ],
    };
    sendResponse(res, { success: true, data: kbData }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Create support ticket
 * @route   POST /api/help/tickets
 * @desc    Open a new support request from the help center
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createTicket = async (req, res) => {
  try {
    const ticketData = { ...req.body, user: req.user.id };
    const { data, error, message } =
      await supportticketService.create(ticketData);
    if (error) throw new Error(message);

    sendResponse(res, { success: true, data, message }, 201);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get user guide
 * @route   GET /api/help/guide
 * @desc    Retrieve the comprehensive system user guide and walkthroughs
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getGuide = async (req, res) => {
  try {
    const guideData = [
      {
        id: 1,
        title: '1. Introduction to Project Point',
        sections: [
          {
            title: 'What is Project Point?',
            content:
              'Project Point is a comprehensive management system for student-led academic projects, facilitating collaboration between students and faculty.',
          },
          {
            title: 'System Roles',
            content:
              'Learn about the different permissions for Students, Faculty Advisors, and Administrators.',
          },
        ],
      },
      {
        id: 2,
        title: '2. Standard Workflow',
        sections: [
          {
            title: 'Proposal Stage',
            content:
              'Every project starts with a proposal that must be approved by a faculty member before execution begins.',
          },
          {
            title: 'Execution & Monitoring',
            content:
              'Track your week-by-week progress using the integrated Gantt chart and milestone tracker.',
          },
        ],
      },
      {
        id: 3,
        title: '3. Team Collaboration',
        sections: [
          {
            title: 'Inviting Members',
            content:
              "Add teammates via their student ID or email in the 'Team' tab of your project dashboard.",
          },
          {
            title: 'Role Assignment',
            content:
              'Assign specific tasks and responsibilities to each team member to ensure accountability.',
          },
        ],
      },
      {
        id: 4,
        title: '4. Submission Guidelines',
        sections: [
          {
            title: 'File Requirements',
            content:
              'Ensure all reports are submitted in PDF format. Code archives should be in .zip or .tar.gz.',
          },
          {
            title: 'Plagiarism Check',
            content:
              'All submissions are automatically scanned for plagiarism. Ensure all sources are properly cited.',
          },
        ],
      },
      {
        id: 5,
        title: '5. Advisor Meetings',
        sections: [
          {
            title: 'Scheduling',
            content:
              "Use the 'Meetings' module to request a slot from your faculty advisor's available calendar.",
          },
          {
            title: 'Meeting Minutes',
            content:
              'Always upload the minutes of your meeting within 24 hours to track decisions and action items.',
          },
        ],
      },
      {
        id: 6,
        title: '6. Analytics & Grading',
        sections: [
          {
            title: 'Performance Metrics',
            content:
              "View your project's health based on milestone completion and timely submissions.",
          },
          {
            title: 'Final Evaluation',
            content:
              'The system aggregates feedback from all advisors for the final project grade.',
          },
        ],
      },
    ];
    sendResponse(res, { success: true, data: guideData }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get tutorials
 * @route   GET /api/help/tutorials
 * @desc    Retrieve curated video and interactive tutorials for the system
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTutorials = async (req, res) => {
  try {
    const tutorials = [
      {
        id: 1,
        title: 'Quickstart Guide',
        description: 'Get your project up and running in under 5 minutes.',
        duration: '04:15',
        category: 'Basics',
        completed: true,
      },
      {
        id: 2,
        title: 'Mastering the Gantt Chart',
        description: 'Advanced scheduling and dependency management.',
        duration: '12:30',
        category: 'Advanced',
        completed: false,
      },
      {
        id: 3,
        title: 'Effective Communication',
        description: 'How to use the built-in discussion boards and meeting tools.',
        duration: '06:45',
        category: 'Basics',
        completed: false,
      },
      {
        id: 4,
        title: 'Reporting & Analytics',
        description: 'Learn how to generate and interpret project reports.',
        duration: '08:20',
        category: 'Advanced',
        completed: false,
      },
      {
        id: 5,
        title: 'Advisor Best Practices',
        description: 'How to effectively collaborate with your faculty guide.',
        duration: '05:50',
        category: 'Basics',
        completed: false,
      },
    ];
    sendResponse(
      res,
      {
        success: true,
        data: { tutorials, categories: ['Basics', 'Advanced'] },
      },
      200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};
