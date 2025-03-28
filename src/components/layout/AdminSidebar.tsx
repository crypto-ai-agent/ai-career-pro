import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  CreditCard, 
  Webhook, 
  Key, 
  FileText,
  ChevronRight,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Billing',
    href: '/admin/billing',
    icon: CreditCard,
  },
  {
    name: 'Webhooks',
    href: '/admin/webhooks',
    icon: Webhook,
  },
  {
    name: 'API Keys',
    href: '/admin/api-keys',
    icon: Key,
  },
  {
    name: 'Logs',
    href: '/admin/logs',
    icon: FileText,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <Link to="/dashboard" className="flex items-center">
          <LayoutDashboard className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <Link
          to="/dashboard"
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to User Dashboard
        </Link>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 mr-3',
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                )} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 text-indigo-600" />}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={toggleTheme}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-5 w-5 mr-3" />
              Dark Mode
            </>
          ) : (
            <>
              <Sun className="h-5 w-5 mr-3" />
              Light Mode
            </>
          )}
        </button>
      </div>
    </div>
  );
}