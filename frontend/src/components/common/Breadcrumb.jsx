import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = memo(() => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);

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

    return pathnames.map((name, index) => ({
      name,
      routeTo: `/${pathnames.slice(0, index + 1).join("/")}`,
      isLast: index === pathnames.length - 1,
      displayName:
        routeNames[name] ||
        name.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    }));
  }, [location.pathname]);

  return (
    <nav
      className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4"
      aria-label="Breadcrumb"
    >
      <Link
        to="/dashboard"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <i className="fas fa-home mr-2" aria-hidden="true"></i>
        Home
      </Link>

      {breadcrumbs.map(({ name, routeTo, isLast, displayName }) => (
        <React.Fragment key={name}>
          <i
            className="fas fa-chevron-right mx-2 text-gray-400 dark:text-gray-600"
            aria-hidden="true"
          ></i>
          {isLast ? (
            <span
              className="font-medium text-gray-900 dark:text-white"
              aria-current="page"
            >
              {displayName}
            </span>
          ) : (
            <Link
              to={routeTo}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {displayName}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
