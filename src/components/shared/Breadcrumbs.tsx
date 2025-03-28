import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  'dashboard': 'Dashboard',
  'settings': 'Settings',
  'history': 'History',
  'tools': 'Tools',
  'cv': 'CV Optimizer',
  'cover-letter': 'Cover Letter Generator',
  'email': 'Email Preparer',
  'interview': 'Interview Coach'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-500"
          >
            <Home className="h-5 w-5" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const name = routeNames[value] || value;

          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="h-5 w-5 text-gray-400" />
              <Link
                to={to}
                className={`ml-4 text-sm font-medium ${
                  last
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={last ? 'page' : undefined}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}