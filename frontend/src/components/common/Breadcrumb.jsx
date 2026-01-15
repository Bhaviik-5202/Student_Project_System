import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link to="/" className="hover:text-primary-600 transition-colors">
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={name} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="text-gray-800 font-medium capitalize">
                {name.replace(/-/g, " ")}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 transition-colors capitalize"
              >
                {name.replace(/-/g, " ")}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
