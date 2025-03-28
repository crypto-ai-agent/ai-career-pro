import React, { useState, useEffect } from 'react';
import { UserRound, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { useToast } from '../../../hooks/useToast';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../../services/cms';
import type { TeamMember } from '../../../services/cms';

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
      setError(null);
    } catch (error) {
      console.error('Error loading team members:', error);
      setError('Failed to load team members');
      addToast('error', 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (member: {
    name: string;
    role: string;
    bio?: string;
    photo_url?: string;
  }) => {
    try {
      await createTeamMember(member);
      addToast('success', 'Team member added successfully');
      setShowForm(false);
      loadMembers();
    } catch (error) {
      console.error('Error creating team member:', error);
      addToast('error', 'Failed to add team member');
    }
  };

  const handleUpdate = async (id: string, updates: {
    name?: string;
    role?: string;
    bio?: string;
    photo_url?: string;
    active?: boolean;
  }) => {
    try {
      await updateTeamMember(id, updates);
      addToast('success', 'Team member updated successfully');
      setEditing(null);
      loadMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
      addToast('error', 'Failed to update team member');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      await deleteTeamMember(id);
      addToast('success', 'Team member deleted successfully');
      loadMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      addToast('error', 'Failed to delete team member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* New Member Form */}
      {showForm && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Team Member
            </h3>
            <form className="space-y-4">
              <FormField label="Name">
                <Input required />
              </FormField>

              <FormField label="Role">
                <Input required />
              </FormField>

              <FormField label="Bio">
                <TextArea rows={3} />
              </FormField>

              <FormField label="Photo URL">
                <Input type="url" placeholder="https://..." />
              </FormField>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Member
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Team Members List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member) => (
            <Card key={member.id}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserRound className="h-6 w-6 text-indigo-600" />
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleUpdate(member.id, { active: !member.active })}
                    >
                      {member.active ? 'Active' : 'Hidden'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(editing === member.id ? null : member.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editing === member.id ? (
                  <div className="space-y-4">
                    <FormField label="Name">
                      <Input
                        value={member.name}
                        onChange={(e) => setMembers(prev => prev.map(m =>
                          m.id === member.id ? { ...m, name: e.target.value } : m
                        ))}
                        required
                      />
                    </FormField>

                    <FormField label="Role">
                      <Input
                        value={member.role}
                        onChange={(e) => setMembers(prev => prev.map(m =>
                          m.id === member.id ? { ...m, role: e.target.value } : m
                        ))}
                        required
                      />
                    </FormField>

                    <FormField label="Bio">
                      <TextArea
                        rows={3}
                        value={member.bio || ''}
                        onChange={(e) => setMembers(prev => prev.map(m =>
                          m.id === member.id ? { ...m, bio: e.target.value } : m
                        ))}
                      />
                    </FormField>

                    <FormField label="Photo URL">
                      <Input
                        type="url"
                        value={member.photo_url || ''}
                        onChange={(e) => setMembers(prev => prev.map(m =>
                          m.id === member.id ? { ...m, photo_url: e.target.value } : m
                        ))}
                        placeholder="https://..."
                      />
                    </FormField>

                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleUpdate(member.id, {
                          name: member.name,
                          role: member.role,
                          bio: member.bio,
                          photo_url: member.photo_url
                        })}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  member.bio && (
                    <p className="text-gray-600 mt-2">
                      {member.bio}
                    </p>
                  )
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}