import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  active: boolean;
}

export function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      addToast('error', 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert({
          question: formData.get('question'),
          answer: formData.get('answer'),
          category: formData.get('category'),
          display_order: faqs.length,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      setFaqs(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'FAQ created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating FAQ:', error);
      addToast('error', 'Failed to create FAQ');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<FAQ>) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, ...updates } : faq
      ));
      setEditing(null);
      addToast('success', 'FAQ updated successfully');
    } catch (error) {
      console.error('Error updating FAQ:', error);
      addToast('error', 'Failed to update FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFaqs(prev => prev.filter(faq => faq.id !== id));
      addToast('success', 'FAQ deleted successfully');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      addToast('error', 'Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            FAQ Management
          </h3>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <FormField label="Question">
              <Input name="question" required />
            </FormField>

            <FormField label="Answer">
              <TextArea name="answer" rows={4} required />
            </FormField>

            <FormField label="Category">
              <Input name="category" required />
            </FormField>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create FAQ
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <div className="p-6">
              {editing === faq.id ? (
                <div className="space-y-4">
                  <FormField label="Question">
                    <Input
                      value={faq.question}
                      onChange={(e) => setFaqs(prev => prev.map(f =>
                        f.id === faq.id ? { ...f, question: e.target.value } : f
                      ))}
                    />
                  </FormField>

                  <FormField label="Answer">
                    <TextArea
                      value={faq.answer}
                      onChange={(e) => setFaqs(prev => prev.map(f =>
                        f.id === faq.id ? { ...f, answer: e.target.value } : f
                      ))}
                      rows={4}
                    />
                  </FormField>

                  <FormField label="Category">
                    <Input
                      value={faq.category}
                      onChange={(e) => setFaqs(prev => prev.map(f =>
                        f.id === faq.id ? { ...f, category: e.target.value } : f
                      ))}
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
                      onClick={() => handleUpdate(faq.id, faq)}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdate(faq.id, { active: !faq.active })}
                      >
                        {faq.active ? 'Active' : 'Hidden'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditing(faq.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Category: {faq.category}
                  </p>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}