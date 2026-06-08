export type Priority = 'high' | 'medium' | 'low';
export type ArticleStatus = 'pending' | 'approved' | 'rejected' | 'returned';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ContentType = 'article' | 'image' | 'video';
export type ScheduleStatus = 'scheduled' | 'published';

export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  priority: Priority;
  status: ArticleStatus;
  submitTime: string;
  deadline: string;
  isOverdue: boolean;
  contentType: ContentType;
  content: string;
  images?: string[];
  videoUrl?: string;
  versions: Version[];
  sensitiveSections: SensitiveSection[];
  riskLevel: RiskLevel;
  publishTime?: string;
}

export interface Version {
  id: string;
  version: number;
  content: string;
  submitTime: string;
  editor: string;
}

export interface SensitiveSection {
  id: string;
  startIndex: number;
  endIndex: number;
  type: string;
  ruleId: string;
  description: string;
}

export interface Opinion {
  id: string;
  content: string;
  category: string;
  usageCount: number;
  isFavorite: boolean;
}

export interface Rule {
  id: string;
  title: string;
  category: string;
  description: string;
  examples: string[];
}

export interface ScheduleItem {
  id: string;
  title: string;
  category: string;
  publishTime: string;
  status: ScheduleStatus;
}

export interface UserStats {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  approvalRate: number;
  categoryStats: CategoryStat[];
  weeklyData: { day: string; count: number }[];
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface DraftOpinion {
  articleId: string;
  content: string;
  savedAt: string;
}
