export interface CVFormData {
  currentCV: File | null;
  targetRole: string;
  industry: string;
  experienceLevel: 'entry-level' | 'mid-level' | 'senior' | 'executive';
  keySkills: string;
}