import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  MessageSquareText, 
  UserRound, 
  History, 
  Settings, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Breadcrumbs } from '../shared/Breadcrumbs';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CV Optimizer', href: '/tools/cv', icon: FileText },
  { name: 'Cover Letters', href: '/tools/cover-letter', icon: MessageSquareText },
  { name: 'Email Preparer', href: '/tools/email', icon: Mail },
  { name: 'Interview Coach', href: '/tools/interview', icon: UserRound },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">AI Career Pro</span>
            </Link>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    location.pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 mb-2"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="mr-3 h-5 w-5" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="mr-3 h-5 w-5" />
                  Light Mode
                </>
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="pl-64">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}