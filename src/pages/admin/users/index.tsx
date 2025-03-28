import React from 'react';
import { Users } from 'lucide-react';
import { UserList } from './UserList';

export function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
        </div>
      

        <div className="bg-white rounded-lg shadow-sm">
          <UserList />
        </div>
      </div>
    </div>
  );
}