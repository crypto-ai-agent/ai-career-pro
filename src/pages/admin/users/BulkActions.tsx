import React from 'react';
import { Users, Shield, Ban, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useConfirmation } from '../../../hooks/useConfirmation';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface BulkActionsProps {
  selectedUsers: string[];
  onActionComplete: () => void;
}

export function BulkActions({ selectedUsers, onActionComplete }: BulkActionsProps) {
  const { addToast } = useToast();
  const { confirm } = useConfirmation();

  const handleBulkAction = async (action: string) => {
    if (!selectedUsers.length) {
      addToast('error', 'No users selected');
      return;
    }

    const messages = {
      delete: `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`,
      verify: `Are you sure you want to verify ${selectedUsers.length} users?`,
      suspend: `Are you sure you want to suspend ${selectedUsers.length} users?`
    };

    confirm(async () => {
      try {
        switch (action) {
          case 'delete':
            await supabase
              .from('profiles')
              .delete()
              .in('id', selectedUsers);
            break;

          case 'verify':
            await supabase.rpc('bulk_verify_users', { user_ids: selectedUsers });
            break;

          case 'suspend':
            await supabase.rpc('bulk_suspend_users', { user_ids: selectedUsers });
            break;

          default:
            throw new Error('Invalid action');
        }

        addToast('success', `Bulk action "${action}" completed successfully`);
        onActionComplete();
      } catch (error) {
        console.error('Error performing bulk action:', error);
        addToast('error', 'Failed to perform bulk action');
      }
    }, {
      title: `Confirm Bulk ${action}`,
      message: messages[action as keyof typeof messages],
      confirmLabel: action === 'delete' ? 'Delete' : 'Confirm',
      isDestructive: action === 'delete'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">
            {selectedUsers.length} users selected
          </span>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => handleBulkAction('verify')}
            disabled={!selectedUsers.length}
          >
            <Shield className="h-4 w-4 mr-2" />
            Verify Selected
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('suspend')}
            disabled={!selectedUsers.length}
          >
            <Ban className="h-4 w-4 mr-2" />
            Suspend Selected
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleBulkAction('delete')}
            disabled={!selectedUsers.length}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
}