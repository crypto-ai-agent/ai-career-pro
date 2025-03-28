import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface DownloadButtonProps {
  content: string;
  filename: string;
  className?: string;
}

export function DownloadButton({ content, filename, className }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const sanitizedFilename = filename.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizedFilename}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Download
    </Button>
  );
}