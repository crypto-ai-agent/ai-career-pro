import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart,
  Settings, 
  Users, 
  CreditCard, 
  Webhook, 
  Key, 
  FileText,
  Mail,
  GitBranch,
  Activity,
  ChevronRight,
  ArrowLeft,
  Wrench
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Content Management', href: '/admin/content', icon: FileText },
  { name: 'Services Management', href: '/admin/services', icon: Wrench },
  { name: 'Email Management', href: '/admin/email', icon: Mail },
  { name: 'Integrations', href: '/admin/integrations', icon: GitBranch },
  { name: 'System Health', href: '/admin/system', icon: Activity },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Subscription Plans', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Webhook Config', href: '/admin/webhooks', icon: Webhook },
  { name: 'API Keys', href: '/admin/api-keys', icon: Key },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to User Dashboard
        </Link>

        <h2 className="text-xl font-bold text-indigo-400">Admin Panel</h2>
        <p className="text-sm text-gray-400">System Management</p>
      </div>

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
                  ? 'bg-indigo-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              <ChevronRight className={cn(
                'h-4 w-4 transition-transform',
                isActive ? 'transform rotate-90' : ''
              )} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}