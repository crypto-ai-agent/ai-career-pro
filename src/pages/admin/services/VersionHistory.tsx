import React from 'react';
import { History, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useConfirmation } from '../../../hooks/useConfirmation';
import { useToast } from '../../../hooks/useToast';
import { getServiceVersions, rollbackToVersion } from '../../../services/admin/versions';
import type { ServiceVersion } from '../../../services/admin/versions';

interface VersionHistoryProps {
  serviceId: string;
  onRollback: () => void;
}

export function VersionHistory({ serviceId, onRollback }: VersionHistoryProps) {
  const [versions, setVersions] = React.useState<ServiceVersion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showConfig, setShowConfig] = React.useState<Record<string, boolean>>({});
  const { addToast } = useToast();
  const { confirm } = useConfirmation({
    title: 'Confirm Rollback',
    message: 'Are you sure you want to rollback to this version? This will override the current configuration.',
    confirmLabel: 'Rollback',
    isDestructive: true
  });

  React.useEffect(() => {
    loadVersions();
  }, [serviceId]);

  const loadVersions = async () => {
    try {
      const data = await getServiceVersions(serviceId);
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
      addToast('error', 'Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: number) => {
    confirm(async () => {
      try {
        await rollbackToVersion(serviceId, version);
        addToast('success', 'Successfully rolled back to version ' + version);
        onRollback();
      } catch (error) {
        console.error('Error rolling back:', error);
        addToast('error', 'Failed to rollback to version ' + version);
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <History className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Version History</h3>
        </div>

        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Version {version.version}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(version.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfig(prev => ({
                      ...prev,
                      [version.id]: !prev[version.id]
                    }))}
                  >
                    {showConfig[version.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRollback(version.version)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Rollback
                  </Button>
                </div>
              </div>

              {version.comment && (
                <p className="text-sm text-gray-600 mb-2">
                  {version.comment}
                </p>
              )}

              {showConfig[version.id] && (
                <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-sm">
                  {JSON.stringify(version.config, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {versions.length === 0 && (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No version history</h3>
              <p className="mt-1 text-sm text-gray-500">
                Changes to this service will be tracked here
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}