export interface RecentItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

export interface CoverLetterItem extends RecentItem {
  company: string;
}

export interface CVItem extends RecentItem {
  industry: string;
}

export interface EmailItem extends RecentItem {
  recipient: string;
}