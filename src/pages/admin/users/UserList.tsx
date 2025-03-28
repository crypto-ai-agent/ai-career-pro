import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserCog, Shield, ShieldOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Form';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';
import { EditUserDialog } from './EditUserDialog';
import { useToast } from '../../../hooks/useToast';
import { getUsers, updateUser, deleteUser } from '../../../services/admin';
import type { UserListResponse } from '../../../types/admin';

export function UserList() {
  const [users, setUsers] = useState<UserListResponse['users']>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserListResponse['users'][0] | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { addToast } = useToast();
  const limit = 10;

  useEffect(() => {
    loadUsers();
  }, [page, searchQuery]);

  const loadUsers = async () => {
    try {
      const response = await getUsers(page, limit, searchQuery);
      setUsers(response.users);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error('Error loading users:', error);
      addToast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUser(userId, { is_admin: !isAdmin });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !isAdmin } : user
      ));
      addToast('success', `Admin status ${!isAdmin ? 'granted' : 'revoked'}`);
    } catch (error) {
      console.error('Error updating user:', error);
      addToast('error', 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser);
      setUsers(users.filter(user => user.id !== selectedUser));
      addToast('success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      addToast('error', 'Failed to delete user');
    } finally {
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingUser) return;

    try {
      const updated = await updateUser(editingUser.id, {
        full_name: data.fullName,
        email: data.email,
        company: data.company,
        job_title: data.jobTitle,
        experience_level: data.experienceLevel,
      });

      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updated } : user
      ));
      
      addToast('success', 'User updated successfully');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      addToast('error', 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete User"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }}
        isDestructive
      />

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSave={handleEdit}
        />
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      {/* User List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <UserCog className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                      className={user.is_admin ? 'text-indigo-600' : ''}
                    >
                      {user.is_admin ? (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </>
                      ) : (
                        <>
                          <ShieldOff className="w-4 h-4 mr-2" />
                          User
                        </>
                      )}
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.subscriptions?.[0]?.plan || 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 border border-gray-300 bg-white text-gray-700">
                    {page}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}