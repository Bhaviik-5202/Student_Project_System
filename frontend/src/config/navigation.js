/**
 * Navigation Configuration
 * Centralized source of truth for all app navigation, breadcrumbs, and role permissions.
 */

export const ROLE_COMBINATIONS = Object.freeze({
  ALL: ["admin", "faculty", "student"],
  ADMIN_ONLY: ["admin"],
  FACULTY_ONLY: ["faculty"],
  STUDENT_ONLY: ["student"],
  ADMIN_FACULTY: ["admin", "faculty"],
  FACULTY_STUDENT: ["faculty", "student"],
  STAFF_ADMIN: ["admin", "faculty"], // Legacy naming support
});

export const navigationItems = [
  {
    title: "Dashboard",
    icon: "home",
    path: "/dashboard",
    roles: ROLE_COMBINATIONS.ALL,
  },
  {
    title: "Projects",
    icon: "project-diagram",
    path: "/projects",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "All Projects", path: "/projects", roles: ROLE_COMBINATIONS.ALL },
      { title: "Project Proposal", path: "/project-proposal", roles: ROLE_COMBINATIONS.FACULTY_STUDENT },
      { title: "Project Groups", path: "/project-groups", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
      { title: "Guide Allocation", path: "/guide-allocation", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
      { title: "Timeline", path: "/timeline", roles: ROLE_COMBINATIONS.ALL },
      { title: "Milestones", path: "/milestones", roles: ROLE_COMBINATIONS.ALL },
    ],
  },
  {
    title: "Students",
    icon: "user-graduate",
    path: "/students",
    roles: ROLE_COMBINATIONS.ADMIN_FACULTY,
    submenu: [
      { title: "Student List", path: "/students", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
      { title: "Attendance", path: "/attendance", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
    ],
  },
  {
    title: "Meetings",
    icon: "calendar-alt",
    path: "/meetings",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "Calendar", path: "/meetings", roles: ROLE_COMBINATIONS.ALL },
      { title: "Meeting List", path: "/meetings/list", roles: ROLE_COMBINATIONS.ALL },
      { title: "Schedule Meeting", path: "/meetings/new", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
    ],
  },
  {
    title: "Courses",
    icon: "book",
    path: "/courses",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "My Courses", path: "/courses", roles: ROLE_COMBINATIONS.ALL },
      { title: "Course Catalog", path: "/course-catalog", roles: ROLE_COMBINATIONS.ALL },
      { title: "Course Materials", path: "/course-materials", roles: ROLE_COMBINATIONS.ALL },
    ],
  },
  {
    title: "Assignments",
    icon: "tasks",
    path: "/assignments",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "All Assignments", path: "/assignments", roles: ROLE_COMBINATIONS.ALL },
      { title: "Upload Assignment", path: "/assignments/upload", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
      { title: "Submission History", path: "/submission-history", roles: ROLE_COMBINATIONS.ALL },
    ],
  },
  {
    title: "Resources",
    icon: "folder-open",
    path: "/resources",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "Browse Resources", path: "/resources", roles: ROLE_COMBINATIONS.ALL },
      { title: "Document Library", path: "/documents", roles: ROLE_COMBINATIONS.ALL },
      { title: "Templates", path: "/templates", roles: ROLE_COMBINATIONS.ALL },
    ],
  },
  {
    title: "Collaboration",
    icon: "users",
    path: "/chat",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "Team Chat", path: "/chat", roles: ROLE_COMBINATIONS.ALL },
      { title: "Discussions", path: "/discussions", roles: ROLE_COMBINATIONS.ALL },
      { title: "File Sharing", path: "/file-sharing", roles: ROLE_COMBINATIONS.ALL },
    ],
  },
  {
    title: "Admin",
    icon: "cogs",
    path: "/admin-dashboard",
    roles: ROLE_COMBINATIONS.ADMIN_ONLY,
    submenu: [
      { title: "Admin Dashboard", path: "/admin-dashboard", roles: ROLE_COMBINATIONS.ADMIN_ONLY },
      { title: "User Management", path: "/user-management", roles: ROLE_COMBINATIONS.ADMIN_ONLY },
      { title: "System Settings", path: "/system-settings", roles: ROLE_COMBINATIONS.ADMIN_ONLY },
      { title: "Audit Log", path: "/audit-log", roles: ROLE_COMBINATIONS.ADMIN_ONLY },
    ],
  },
  {
    title: "Analytics",
    icon: "chart-bar",
    path: "/analytics",
    roles: ROLE_COMBINATIONS.ADMIN_FACULTY,
    submenu: [
      { title: "Dashboard", path: "/analytics", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
      { title: "Performance", path: "/analytics/performance", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
      { title: "Reports", path: "/reports", roles: ROLE_COMBINATIONS.ADMIN_FACULTY },
    ],
  },
  {
    title: "Help",
    icon: "question-circle",
    path: "/help",
    roles: ROLE_COMBINATIONS.ALL,
    submenu: [
      { title: "Help Center", path: "/help", roles: ROLE_COMBINATIONS.ALL },
      { title: "FAQ", path: "/faq", roles: ROLE_COMBINATIONS.ALL },
      { title: "Support", path: "/support", roles: ROLE_COMBINATIONS.ALL },
    ],
  },
];
