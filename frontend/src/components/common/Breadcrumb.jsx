import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map route names to display names
  const routeNames = {
    dashboard: "Dashboard",
    projects: "Projects",
    students: "Students",
    meetings: "Meetings",
    reports: "Reports",
    profile: "Profile",
    settings: "Settings",
    admin: "Admin",
    faculty: "Faculty",
  };

  return (
    <nav
      className="flex items-center text-sm text-gray-600 mb-4"
      aria-label="Breadcrumb"
    >
      <Link
        to="/dashboard"
        className="hover:text-primary-600 transition-colors"
      >
        <i className="fas fa-home mr-2"></i>
        Home
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName =
          routeNames[name] ||
          name.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={name}>
            <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
            {isLast ? (
              <span className="font-medium text-gray-900">{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
