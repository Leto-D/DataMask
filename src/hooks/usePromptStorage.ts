import { useState, useEffect } from 'react';
import { GeneratedPrompt, Template, UserSettings } from '@/types';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'fr',
  autoSave: true,
  showPreview: true,
  defaultOutputFormat: 'text',
  maxRecentPrompts: 10,
  enableAnalytics: false,
  enableKeyboardShortcuts: true
};

export const usePromptStorage = () => {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await chrome.storage.local.get([
        'prompts',
        'templates',
        'settings'
      ]);

      setPrompts(result.prompts ? JSON.parse(result.prompts) : []);
      setTemplates(result.templates ? JSON.parse(result.templates) : []);
      setSettings(result.settings ? JSON.parse(result.settings) : DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async (prompt: GeneratedPrompt): Promise<void> => {
    try {
      const updatedPrompts = [...prompts, prompt];
      setPrompts(updatedPrompts);
      await chrome.storage.local.set({
        prompts: JSON.stringify(updatedPrompts)
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
      throw error;
    }
  };

  const updatePrompt = async (id: string, updates: Partial<GeneratedPrompt>): Promise<void> => {
    try {
      const updatedPrompts = prompts.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      );
      setPrompts(updatedPrompts);
      await chrome.storage.local.set({
        prompts: JSON.stringify(updatedPrompts)
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  };

  const deletePrompt = async (id: string): Promise<void> => {
    try {
      const updatedPrompts = prompts.filter(p => p.id !== id);
      setPrompts(updatedPrompts);
      await chrome.storage.local.set({
        prompts: JSON.stringify(updatedPrompts)
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  };

  const saveTemplate = async (template: Template): Promise<void> => {
    try {
      const updatedTemplates = [...templates, template];
      setTemplates(updatedTemplates);
      await chrome.storage.local.set({
        templates: JSON.stringify(updatedTemplates)
      });
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await chrome.storage.local.set({
        settings: JSON.stringify(updatedSettings)
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const exportData = async (): Promise<string> => {
    const data = {
      prompts,
      templates: templates.filter(t => t.isUserCreated),
      settings,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = async (jsonData: string): Promise<void> => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.prompts) {
        setPrompts(data.prompts);
        await chrome.storage.local.set({
          prompts: JSON.stringify(data.prompts)
        });
      }
      
      if (data.templates) {
        const userTemplates = data.templates.filter((t: Template) => t.isUserCreated);
        const updatedTemplates = [...templates.filter(t => !t.isUserCreated), ...userTemplates];
        setTemplates(updatedTemplates);
        await chrome.storage.local.set({
          templates: JSON.stringify(updatedTemplates)
        });
      }
      
      if (data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        await chrome.storage.local.set({
          settings: JSON.stringify({ ...DEFAULT_SETTINGS, ...data.settings })
        });
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  };

  const clearAllData = async (): Promise<void> => {
    try {
      await chrome.storage.local.clear();
      setPrompts([]);
      setTemplates([]);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  return {
    prompts,
    templates,
    settings,
    loading,
    savePrompt,
    updatePrompt,
    deletePrompt,
    saveTemplate,
    updateSettings,
    exportData,
    importData,
    clearAllData
  };
};