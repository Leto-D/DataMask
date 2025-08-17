export type Theme = 'light' | 'dark' | 'system';
export type Language = 'fr' | 'en';

export interface UserSettings {
  theme: Theme;
  language: Language;
  autoSave: boolean;
  showPreview: boolean;
  defaultOutputFormat: 'text' | 'json' | 'xml' | 'markdown';
  maxRecentPrompts: number;
  enableAnalytics: boolean;
  enableKeyboardShortcuts: boolean;
}

export interface AppState {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export interface StorageData {
  prompts: string[];
  templates: string[];
  collections: string[];
  settings: UserSettings;
  recentPrompts: string[];
}