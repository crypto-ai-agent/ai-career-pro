import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmptyState } from './EmptyState';
import { LucideIcon } from 'lucide-react';

interface GeneratedContentProps {
  content: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}

export function GeneratedContent({ 
  content, 
  icon: Icon,
  emptyTitle,
  emptyDescription
}: GeneratedContentProps) {
  return content ? (
    <Card>
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <Button
          variant="outline"
          onClick={() => navigator.clipboard.writeText(content)}
        >
          Copy to Clipboard
        </Button>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  ) : (
    <EmptyState
      icon={Icon}
      title={emptyTitle}
      description={emptyDescription}
    />
  );
}