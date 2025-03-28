import React from 'react';
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, Home, Settings, History, FileText, Mail, MessageSquareText, UserRound } from 'lucide-react';
import { Button } from '../ui/Button';
import type { User as AuthUser } from '@supabase/supabase-js';
import { cn } from '../../lib/utils';
import { MobileMenu } from '../shared/MobileMenu';

// note
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
}

export function MobileNav({ isOpen, onClose, user }: MobileNavProps) {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/services', label: 'Services', icon: FileText },
    { path: '/pricing', label: 'Pricing', icon: Mail },
    { path: '/about', label: 'About', icon: User },
    { path: '/contact', label: 'Contact', icon: Mail }
  ];

  const dashboardLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/tools/cv', label: 'CV Optimizer', icon: FileText },
    { path: '/tools/cover-letter', label: 'Cover Letters', icon: MessageSquareText },
    { path: '/tools/email', label: 'Email Preparer', icon: Mail },
    { path: '/tools/interview', label: 'Interview Coach', icon: UserRound },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const links = user ? dashboardLinks : publicLinks;

  return (
    <MobileMenu isOpen={isOpen} onClose={onClose} title="Menu">
      <nav className="px-4 py-6 space-y-2" ref={menuRef}>
        {links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            aria-current={isActive(path) ? 'page' : undefined}
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
              isActive(path)
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>
            <Link
              to="/settings"
              onClick={onClose}
              className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Settings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary rounded-md"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </MobileMenu>
  );
}