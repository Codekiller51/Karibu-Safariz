import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    const generateBreadcrumbs = () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const items: BreadcrumbItem[] = [];

      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        let label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        if (index === pathSegments.length - 1) {
          label = decodeURIComponent(label);
        }

        items.push({ label, path: currentPath });
      });

      setBreadcrumbs(items);
    };

    generateBreadcrumbs();
  }, [location.pathname]);

  if (breadcrumbs.length === 0 || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </li>

          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-sm font-medium text-gray-700">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
