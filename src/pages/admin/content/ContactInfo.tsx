import React, { useState, useEffect } from 'react';
import { Mail, Clock, Phone } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getContactInfo, updateContactInfo } from '../../../services/cms';
import type { ContactInfo as ContactInfoType } from '../../../services/cms';

const icons = {
  email: Mail,
  office_hours: Clock,
  response_time: Clock,
  phone: Phone
};

export function ContactInfo() {
  const [info, setInfo] = useState<ContactInfoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const data = await getContactInfo();
      setInfo(data);
    } catch (error) {
      console.error('Error loading contact info:', error);
      addToast('error', 'Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, value: string) => {
    try {
      await updateContactInfo(id, value);
      addToast('success', 'Contact information updated successfully');
      setEditing(null);
      loadContactInfo();
    } catch (error) {
      console.error('Error updating contact info:', error);
      addToast('error', 'Failed to update contact information');
    }
  };

  return (
    <div className="space-y-6">
      {info.map((item) => {
        const Icon = icons[item.type as keyof typeof icons] || Mail;
        return (
          <Card key={item.id}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {item.type.replace(/_/g, ' ')}
                  </h3>
                </div>
                <Button
                  onClick={() => setEditing(editing === item.id ? null : item.id)}
                >
                  Edit
                </Button>
              </div>

              {editing === item.id ? (
                <div className="space-y-4">
                  <FormField label="Value">
                    {item.type === 'office_hours' || item.type === 'response_time' ? (
                      <TextArea
                        rows={3}
                        value={item.value}
                        onChange={(e) => setInfo(prev => prev.map(i =>
                          i.id === item.id ? { ...i, value: e.target.value } : i
                        ))}
                      />
                    ) : (
                      <Input
                        type={item.type === 'email' ? 'email' : 'text'}
                        value={item.value}
                        onChange={(e) => setInfo(prev => prev.map(i =>
                          i.id === item.id ? { ...i, value: e.target.value } : i
                        ))}
                      />
                    )}
                  </FormField>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleUpdate(item.id, item.value)}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">
                  {item.value}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}