import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FileText, Mail, MessageSquareText, UserRound } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getServiceIcon(name: string) {
  const icons = {
    'CV Optimizer': FileText,
    'Cover Letter Generator': MessageSquareText,
    'Email Preparer': Mail,
    'Interview Coach': UserRound
  };
  
  return icons[name as keyof typeof icons] || FileText;
}