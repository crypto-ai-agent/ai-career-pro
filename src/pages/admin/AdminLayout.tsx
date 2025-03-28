import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '../../components/shared/ThemeToggle';

export function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <div className="border-b border-gray-200 bg-white px-8 py-4 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}