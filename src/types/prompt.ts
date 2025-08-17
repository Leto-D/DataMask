export interface ObjectiveStep {
  title: string;
  description: string;
  targetAudience: string;
  actionRequired: string;
  suggestions: string[];
}

export interface PromptExample {
  input: string;
  output: string;
  description?: string;
}

export interface StructureStep {
  role: string;
  personality: string;
  skills: string[];
  examples: PromptExample[];
  useXml: boolean;
}

export type OutputFormat = 'text' | 'json' | 'xml' | 'markdown';
export type PromptLength = 'short' | 'medium' | 'detailed';
export type CreativityLevel = 'factual' | 'balanced' | 'creative';

export interface CustomizeStep {
  outputFormat: OutputFormat;
  length: PromptLength;
  creativity: CreativityLevel;
  prefillResponse?: string;
  allowIdk: boolean;
  requireSources: boolean;
}

export interface PromptConfig {
  objective: ObjectiveStep;
  structure: StructureStep;
  customize: CustomizeStep;
}

export interface GeneratedPrompt {
  id: string;
  config: PromptConfig;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  isFavorite: boolean;
}

export interface PromptMetadata {
  wordCount: number;
  estimatedTokens: number;
  complexity: 'simple' | 'medium' | 'complex';
  tags: string[];
}