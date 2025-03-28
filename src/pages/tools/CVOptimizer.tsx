import React from 'react';
import { FileText } from 'lucide-react';
import { optimizeCV } from '../../services/api';
import { CVFormData } from '../../types/cv';
import { useForm } from '../../hooks/useForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card } from '../../components/ui/Card';
import { FormField, Input, TextArea, Select } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/layout/PageHeader';
import { RecentItems } from '../../components/shared/RecentItems';
import { FileUpload } from '../../components/shared/FileUpload';
import { GeneratedContent } from '../../components/shared/GeneratedContent';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { EXPERIENCE_LEVELS } from '../../lib/constants';

const initialFormData: CVFormData = {
  currentCV: null,
  targetRole: '',
  industry: '',
  experienceLevel: 'mid-level',
  keySkills: '',
};

export function CVOptimizer() {
  const {
    formData,
    setFormData,
    isLoading,
    error,
    handleInputChange,
    handleSubmit
  } = useForm<CVFormData>(initialFormData);

  const [optimizedCV, setOptimizedCV] = React.useState<string>('');
  const [recentCVs, setRecentCVs] = useLocalStorage('recentCVs', []);

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      currentCV: file
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    handleSubmit(e, async (data) => {
      const result = await optimizeCV(data);
      setOptimizedCV(result);
      
      // Add to recent CVs
      const newCV = {
        id: Date.now(),
        title: data.targetRole,
        industry: data.industry,
        date: new Date().toISOString(),
        content: result
      };
      
      setRecentCVs((prev: any[]) => [newCV, ...prev.slice(0, 4)]);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="AI CV Optimizer"
        description="Optimize your CV for your target role"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className={`${optimizedCV ? 'lg:w-1/3' : 'lg:w-2/3'} transition-all duration-300`}>
            <Card>
              {error && <ErrorAlert message={error} />}

              <form onSubmit={onSubmit} className="space-y-6">
                <FormField label="Upload Your CV">
                  <FileUpload
                    id="currentCV"
                    name="currentCV"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    type="CV"
                  />
                </FormField>

                <FormField label="Target Role">
                  <Input
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </FormField>

                <FormField label="Industry">
                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology, Healthcare"
                    required
                  />
                </FormField>

                <FormField label="Experience Level">
                  <Select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                  >
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Key Skills">
                  <TextArea
                    name="keySkills"
                    value={formData.keySkills}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List your key skills, separated by commas"
                    required
                  />
                </FormField>

                <Button type="submit" isLoading={isLoading}>
                  Optimize CV
                </Button>
              </form>
            </Card>
          </div>

          {/* Results Section */}
          <div className={`${optimizedCV ? 'lg:w-2/3' : 'lg:w-1/3'} transition-all duration-300`}>
            <GeneratedContent
              content={optimizedCV}
              icon={FileText}
              emptyTitle="Ready to Optimize"
              emptyDescription="Upload your CV and fill out the form to get optimization suggestions"
            />
          </div>
        </div>

        <RecentItems
          title="Recent CVs"
          items={recentCVs}
          renderItem={(item: any) => (
            <Card key={item.id}>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.industry}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.date).toLocaleDateString()}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([item.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${item.title.replace(/\s+/g, '-')}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download
                </Button>
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
}