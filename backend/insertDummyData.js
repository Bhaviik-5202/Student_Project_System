// Dummy data insertion script for all models
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/user.model");
const Staff = require("./models/staff.model");
const Student = require("./models/student.model");
const Project = require("./models/project.model");
const Course = require("./models/course.model");
const Assignment = require("./models/assignment.model");
const Submission = require("./models/submission.model");
const Attendance = require("./models/attendance.model");
const Activity = require("./models/activity.model");
const AuditLog = require("./models/auditlog.model");
const Permission = require("./models/permission.model");
const Notification = require("./models/notification.model");
const Message = require("./models/message.model");
const Chat = require("./models/chat.model");
const Backup = require("./models/backup.model");
const Timeline = require("./models/timeline.model");
const Evaluation = require("./models/evaluation.model");
const File = require("./models/file.model");
const SupportTicket = require("./models/supportticket.model");
const Portfolio = require("./models/portfolio.model");
const Resource = require("./models/resource.model");
const Setting = require("./models/setting.model");
const FAQ = require("./models/faq.model");
const KnowledgeBase = require("./models/knowledgebase.model");
const Meeting = require("./models/meeting.model");

async function insertDummyData() {
  await mongoose.connect("mongodb://localhost:27017/student_project_system");

  // Clear collections
  await Promise.all([
    User.deleteMany({}),
    Staff.deleteMany({}),
    Student.deleteMany({}),
    Project.deleteMany({}),
    Course.deleteMany({}),
    Assignment.deleteMany({}),
    Submission.deleteMany({}),
    Attendance.deleteMany({}),
    Activity.deleteMany({}),
    AuditLog.deleteMany({}),
    Permission.deleteMany({}),
    Notification.deleteMany({}),
    Message.deleteMany({}),
    Chat.deleteMany({}),
    Backup.deleteMany({}),
    Timeline.deleteMany({}),
    Evaluation.deleteMany({}),
    File.deleteMany({}),
    SupportTicket.deleteMany({}),
    Portfolio.deleteMany({}),
    Resource.deleteMany({}),
    Setting.deleteMany({}),
    FAQ.deleteMany({}),
    KnowledgeBase.deleteMany({}),
    Meeting.deleteMany({}),
  ]);

  // Generate multiple users
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: passwordHash,
      role: "admin",
    },
    {
      name: "Faculty User",
      email: "faculty@example.com",
      password: passwordHash,
      role: "faculty",
    },
    {
      name: "Student User",
      email: "student@example.com",
      password: passwordHash,
      role: "student",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: passwordHash,
      role: "student",
    },
    {
      name: "Prof. Lee",
      email: "lee@example.com",
      password: passwordHash,
      role: "faculty",
    },
  ]);
  const [admin, faculty, studentUser, janeUser, profLee] = users;

  // Staff
  const staffList = await Staff.insertMany([
    {
      name: "Dr. Smith",
      email: "smith@example.com",
      department: "Computer Science",
      role: "faculty",
    },
    {
      name: "Dr. Lee",
      email: "lee@example.com",
      department: "Electronics",
      role: "faculty",
    },
  ]);
  const [staff, staff2] = staffList;

  // Courses
  const courses = await Course.insertMany([
    {
      name: "Software Engineering",
      code: "CSE301",
      description: "Project-based course",
      faculty: staff._id,
    },
    {
      name: "AI Fundamentals",
      code: "CSE401",
      description: "Intro to AI",
      faculty: staff2._id,
    },
  ]);
  const [course, course2] = courses;

  // Projects
  const projects = await Project.insertMany([
    {
      title: "AI Chatbot",
      description: "A chatbot for student queries",
      status: "in_progress",
      members: [],
      guide: faculty._id,
    },
    {
      title: "Attendance System",
      description: "Automated attendance tracking",
      status: "planning",
      members: [],
      guide: profLee._id,
    },
  ]);
  const [project, project2] = projects;

  // Students
  const students = await Student.insertMany([
    {
      name: "John Doe",
      email: "john.doe@example.com",
      rollNumber: "CS2026001",
      department: "Computer Science",
      year: 3,
      projects: [project._id],
      grades: [{ project: project._id, grade: "A" }],
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      rollNumber: "CS2026002",
      department: "Electronics",
      year: 2,
      projects: [project2._id],
      grades: [{ project: project2._id, grade: "B+" }],
    },
  ]);
  const [student, jane] = students;
  project.members.push(student._id);
  project2.members.push(jane._id);
  await project.save();
  await project2.save();

  // Assignments
  const assignments = await Assignment.insertMany([
    {
      title: "Chatbot Design",
      description: "Design the architecture of the chatbot",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      course: course._id,
      submissions: [],
    },
    {
      title: "Attendance App UI",
      description: "Create UI for attendance app",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      course: course2._id,
      submissions: [],
    },
  ]);
  const [assignment, assignment2] = assignments;

  // Submissions
  const submissions = await Submission.insertMany([
    {
      student: student._id,
      assignment: assignment._id,
      fileUrl: "http://example.com/submissions/chatbot_design.pdf",
      grade: "A",
      feedback: "Excellent work!",
    },
    {
      student: jane._id,
      assignment: assignment2._id,
      fileUrl: "http://example.com/submissions/attendance_ui.pdf",
      grade: "B+",
      feedback: "Good UI, needs improvement.",
    },
  ]);
  assignment.submissions.push(submissions[0]._id);
  assignment2.submissions.push(submissions[1]._id);
  await assignment.save();
  await assignment2.save();

  // Attendance
  await Attendance.insertMany([
    { student: student._id, date: new Date(), status: "present" },
    { student: jane._id, date: new Date(), status: "late" },
  ]);

  // Activities
  await Activity.insertMany([
    { user: studentUser._id, action: "login", details: "Student logged in." },
    {
      user: janeUser._id,
      action: "submit",
      details: "Jane submitted assignment.",
    },
  ]);

  // AuditLogs
  await AuditLog.insertMany([
    {
      action: "create",
      user: admin._id,
      details: "Created project AI Chatbot.",
    },
    {
      action: "update",
      user: faculty._id,
      details: "Updated attendance system.",
    },
  ]);

  // Permissions
  await Permission.insertMany([
    {
      user: admin._id,
      module: "project",
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      user: faculty._id,
      module: "assignment",
      canRead: true,
      canWrite: true,
      canDelete: false,
    },
  ]);

  // Notifications
  await Notification.insertMany([
    {
      user: studentUser._id,
      message: "Assignment graded.",
      type: "info",
      read: false,
    },
    {
      user: janeUser._id,
      message: "New project assigned.",
      type: "info",
      read: false,
    },
  ]);

  // Chat & Message
  const chat = await Chat.create({
    name: "Project Chat",
    members: [studentUser._id, faculty._id],
    isGroup: true,
  });
  const message = await Message.create({
    sender: studentUser._id,
    content: "Hello team!",
    chat: chat._id,
  });
  chat.messages.push(message._id);
  await chat.save();

  // Backup
  await Backup.create({
    fileName: "backup_2026_02_15.zip",
    createdBy: admin._id,
  });

  // Timeline
  await Timeline.insertMany([
    {
      project: project._id,
      milestones: [
        {
          title: "Design Complete",
          description: "Chatbot design finished",
          dueDate: new Date(),
          completed: true,
        },
      ],
      sprints: [
        {
          name: "Sprint 1",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          tasks: ["Design chatbot", "Write docs"],
        },
      ],
    },
    {
      project: project2._id,
      milestones: [
        {
          title: "UI Complete",
          description: "Attendance UI finished",
          dueDate: new Date(),
          completed: true,
        },
      ],
      sprints: [
        {
          name: "Sprint 1",
          startDate: new Date(),
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          tasks: ["Design UI", "Test app"],
        },
      ],
    },
  ]);

  // Evaluation
  await Evaluation.insertMany([
    {
      evaluator: faculty._id,
      evaluatee: studentUser._id,
      project: project._id,
      assignment: assignment._id,
      criteria: [{ criterion: "Design", score: 10, feedback: "Great design." }],
      type: "faculty",
    },
    {
      evaluator: profLee._id,
      evaluatee: janeUser._id,
      project: project2._id,
      assignment: assignment2._id,
      criteria: [{ criterion: "UI", score: 8, feedback: "Good UI." }],
      type: "faculty",
    },
  ]);

  // Files
  await File.insertMany([
    {
      uploader: studentUser._id,
      fileName: "chatbot_design.pdf",
      fileUrl: "http://example.com/files/chatbot_design.pdf",
      chat: chat._id,
    },
    {
      uploader: janeUser._id,
      fileName: "attendance_ui.pdf",
      fileUrl: "http://example.com/files/attendance_ui.pdf",
      chat: chat._id,
    },
  ]);

  // SupportTickets
  await SupportTicket.insertMany([
    {
      user: studentUser._id,
      subject: "Login Issue",
      description: "Unable to login sometimes.",
      status: "open",
    },
    {
      user: janeUser._id,
      subject: "UI Bug",
      description: "Button not working.",
      status: "pending",
    },
  ]);

  // Portfolios
  await Portfolio.insertMany([
    {
      student: student._id,
      projects: [project._id],
      skills: ["Node.js", "AI"],
      badges: ["Top Performer"],
      transcriptUrl: "http://example.com/transcripts/john_doe.pdf",
    },
    {
      student: jane._id,
      projects: [project2._id],
      skills: ["React", "UI Design"],
      badges: ["UI Star"],
      transcriptUrl: "http://example.com/transcripts/jane_smith.pdf",
    },
  ]);

  // Resources
  await Resource.insertMany([
    {
      title: "Chatbot Template",
      description: "Template for chatbot",
      type: "template",
      url: "http://example.com/resources/chatbot_template.docx",
      uploadedBy: faculty._id,
    },
    {
      title: "Attendance App Docs",
      description: "Documentation for attendance app",
      type: "document",
      url: "http://example.com/resources/attendance_docs.pdf",
      uploadedBy: profLee._id,
    },
  ]);

  // Settings
  await Setting.insertMany([
    { key: "site_name", value: "Student Project System" },
    { key: "max_upload_size", value: 10 },
  ]);

  // FAQ
  await FAQ.insertMany([
    {
      question: "How to submit assignment?",
      answer: "Go to assignments and upload your file.",
    },
    { question: "How to join a project?", answer: "Contact your faculty." },
  ]);

  // KnowledgeBase
  await KnowledgeBase.insertMany([
    {
      title: "Chatbot Project Guide",
      content: "Step-by-step guide for chatbot project.",
    },
    { title: "Attendance App Guide", content: "How to use attendance app." },
  ]);

  // Meetings
  await Meeting.insertMany([
    {
      title: "Project Kickoff",
      description: "Initial meeting for project",
      date: new Date(),
      type: "project",
      participants: [studentUser._id, faculty._id],
      project: project._id,
    },
    {
      title: "UI Review",
      description: "Review meeting for attendance UI",
      date: new Date(),
      type: "team",
      participants: [janeUser._id, profLee._id],
      project: project2._id,
    },
  ]);

  console.log("Expanded dummy data inserted successfully!");
  mongoose.disconnect();
}

insertDummyData().catch((err) => {
  console.error("Error inserting dummy data:", err);
  mongoose.disconnect();
});
