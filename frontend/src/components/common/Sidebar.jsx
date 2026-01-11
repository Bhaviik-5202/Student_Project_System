import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const renderNavLinks = () => {
    const links = [];

    // General
    links.push(
      {
        icon: "fa-tachometer-alt",
        label: "Dashboard",
        path: "/dashboard",
        roles: ["admin", "faculty", "student"],
        section: "General",
      },
      {
        icon: "fa-user",
        label: "Profile",
        path: "/profile",
        roles: ["admin", "faculty", "student"],
        section: "General",
      },
      {
        icon: "fa-cog",
        label: "Settings",
        path: "/settings",
        roles: ["admin", "faculty", "student"],
        section: "General",
      }
    );

    // Administration (Admin only)
    if (user?.role === "admin") {
      links.push(
        {
          icon: "fa-users",
          label: "Students",
          path: "/students",
          roles: ["admin"],
          section: "Administration",
        },
        {
          icon: "fa-chalkboard-teacher",
          label: "Staff",
          path: "/staff",
          roles: ["admin"],
          section: "Administration",
        },
        {
          icon: "fa-project-diagram",
          label: "Project Types",
          path: "/project-types",
          roles: ["admin"],
          section: "Administration",
        }
      );
    }

    // Project Management (Admin & Faculty)
    if (user?.role === "admin" || user?.role === "faculty") {
      links.push(
        {
          icon: "fa-layer-group",
          label: "Project Groups",
          path: "/project-groups",
          roles: ["admin", "faculty"],
          section: "Project Management",
        },
        {
          icon: "fa-user-tie",
          label: "Guide Allocation",
          path: "/guide-allocation",
          roles: ["admin", "faculty"],
          section: "Project Management",
        },
        {
          icon: "fa-calendar-alt",
          label: "Meetings",
          path: "/meetings",
          roles: ["admin", "faculty", "student"],
          section: "Project Management",
        }
      );
    }

    // Student
    if (user?.role === "student") {
      links.push(
        {
          icon: "fa-tasks",
          label: "My Projects",
          path: "/my-projects",
          roles: ["student"],
          section: "My Work",
        },
        {
          icon: "fa-file-upload",
          label: "Submit Proposal",
          path: "/proposal",
          roles: ["student"],
          section: "My Work",
        },
        {
          icon: "fa-clipboard-check",
          label: "Attendance",
          path: "/attendance",
          roles: ["student"],
          section: "My Work",
        }
      );
    }

    // Reports
    links.push({
      icon: "fa-chart-bar",
      label: "Reports",
      path: "/reports",
      roles: ["admin", "faculty", "student"],
      section: "Reports",
    });

    return links;
  };

  const navLinks = renderNavLinks();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link, index) => {
            const showSection =
              index === 0 || navLinks[index - 1].section !== link.section;

            return (
              <div key={link.path}>
                {showSection && (
                  <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">
                    {link.section}
                  </p>
                )}

                <NavLink
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <i className={`fas ${link.icon} mr-3`}></i>
                  {link.label}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900">Need help?</p>
          <p className="text-xs text-gray-500">Contact system administrator</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
