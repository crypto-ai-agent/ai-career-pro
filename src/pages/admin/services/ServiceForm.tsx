import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import type { ServiceConfig } from '../../../services/services';

interface ServiceFormProps {
  service: ServiceConfig;
  onSave: (service: ServiceConfig) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServiceForm({ service, onSave, onCancel, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = React.useState(service);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Service Name">
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </FormField>

      <FormField label="Description">
        <TextArea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </FormField>

      <FormField label="Webhook URL">
        <Input
          value={formData.webhook_url}
          onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
          required
        />
      </FormField>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Input Fields</h4>
        {formData.input_fields.map((field, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <FormField label="Field Name">
                <Input
                  value={field.name}
                  onChange={(e) => {
                    const newFields = [...formData.input_fields];
                    newFields[index] = { ...field, name: e.target.value };
                    setFormData(prev => ({ ...prev, input_fields: newFields }));
                  }}
                  required
                />
              </FormField>

              <FormField label="Field Type">
                <Select
                  value={field.type}
                  onChange={(e) => {
                    const newFields = [...formData.input_fields];
                    newFields[index] = { ...field, type: e.target.value as any };
                    setFormData(prev => ({ ...prev, input_fields: newFields }));
                  }}
                >
                  <option value="text">Text</option>
                  <option value="textarea">Text Area</option>
                  <option value="select">Select</option>
                  <option value="number">Number</option>
                  <option value="file">File</option>
                </Select>
              </FormField>

              <FormField label="Description">
                <Input
                  value={field.description}
                  onChange={(e) => {
                    const newFields = [...formData.input_fields];
                    newFields[index] = { ...field, description: e.target.value };
                    setFormData(prev => ({ ...prev, input_fields: newFields }));
                  }}
                  required
                />
              </FormField>

              {field.type === 'select' && (
                <FormField label="Options">
                  <TextArea
                    value={field.options?.join('\n') || ''}
                    onChange={(e) => {
                      const newFields = [...formData.input_fields];
                      newFields[index] = {
                        ...field,
                        options: e.target.value.split('\n').filter(Boolean)
                      };
                      setFormData(prev => ({ ...prev, input_fields: newFields }));
                    }}
                    placeholder="One option per line"
                    rows={3}
                  />
                </FormField>
              )}

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const newFields = [...formData.input_fields];
                      newFields[index] = { ...field, required: e.target.checked };
                      setFormData(prev => ({ ...prev, input_fields: newFields }));
                    }}
                    className="mr-2"
                  />
                  Required
                </label>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newFields = formData.input_fields.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, input_fields: newFields }));
                  }}
                >
                  Remove Field
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={() => {
            const newField = {
              name: '',
              type: 'text' as const,
              required: true,
              description: ''
            };
            setFormData(prev => ({
              ...prev,
              input_fields: [...prev.input_fields, newField]
            }));
          }}
        >
          Add Input Field
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Pricing</h4>
        {(['free', 'pro', 'enterprise'] as const).map(tier => (
          <Card key={tier} className="p-4">
            <h5 className="font-medium text-gray-700 capitalize mb-4">{tier} Tier</h5>
            
            <div className="space-y-4">
              <FormField label="Price">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricing[tier].price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      [tier]: {
                        ...prev.pricing[tier],
                        price: Number(e.target.value)
                      }
                    }
                  }))}
                  required
                />
              </FormField>

              <FormField label="Monthly Limit">
                <Input
                  type="number"
                  min="-1"
                  value={formData.pricing[tier].limits.monthly}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      [tier]: {
                        ...prev.pricing[tier],
                        limits: {
                          ...prev.pricing[tier].limits,
                          monthly: Number(e.target.value)
                        }
                      }
                    }
                  }))}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use -1 for unlimited
                </p>
              </FormField>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}