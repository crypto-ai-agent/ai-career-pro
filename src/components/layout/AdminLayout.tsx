import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 z-20 flex w-64 flex-col">
        <AdminSidebar />
      </div>
      <div className="flex-1 pl-64">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600"
              >
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}