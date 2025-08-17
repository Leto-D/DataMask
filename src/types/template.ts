import { PromptConfig } from './prompt';

export type TemplateCategory = 'general' | 'business' | 'technical' | 'creative' | 'analysis';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  structure: Partial<PromptConfig>;
  tags: string[];
  isPremium: boolean;
  isUserCreated: boolean;
  usageCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCollection {
  id: string;
  name: string;
  description: string;
  templateIds: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  tags?: string[];
  isPremium?: boolean;
  isUserCreated?: boolean;
  searchQuery?: string;
  minRating?: number;
}