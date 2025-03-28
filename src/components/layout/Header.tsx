import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to} 
      className={cn(
        'transition-colors hover:text-primary',
        isActive(to) ? 'text-primary' : 'text-white/70'
      )}
    >
      {children}
    </Link>
  );

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled 
          ? "bg-[#13111C]/95 backdrop-blur-sm shadow-md" 
          : "bg-[#13111C]/90 backdrop-blur-sm",
        "border-b border-white/10"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Brain className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-white">AI Career Pro</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/">Home</NavLink>
              <div className="relative group">
                <button className="text-white/70 hover:text-white transition-colors">
                  Services
                </button>
                <div className="absolute left-0 mt-2 w-64 rounded-lg bg-white shadow-lg py-2 hidden group-hover:block">
                  <Link 
                    to="/services"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Overview
                  </Link>
                  <Link 
                    to="/services/cv"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    CV Optimizer
                  </Link>
                  <Link 
                    to="/services/cover-letter"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Cover Letter Generator
                  </Link>
                  <Link 
                    to="/services/email"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Email Preparer
                  </Link>
                  <Link 
                    to="/services/interview"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Interview Coach
                  </Link>
                </div>
              </div>
              <NavLink to="/pricing">Pricing</NavLink>
              <NavLink to="/coming-soon" className="relative group">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white group-hover:from-indigo-600 group-hover:to-purple-700 transition-all">
                  Coming Soon
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                </span>
              </NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <Button
              variant="outline"
              className="md:hidden"
              aria-label="Open menu"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      <div className="h-16" /> {/* Spacer for fixed header */}

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        user={user}
      />
    </>
  );
}

export { Header };