import React from 'react';
import { Settings, FileText, Sliders, CheckCircle } from 'lucide-react';
import { Card, Toggle, Input } from '@/components/ui';
import { CustomizeStep as CustomizeStepType, OutputFormat, PromptLength, CreativityLevel } from '@/types';

interface CustomizeStepProps {
  data?: Partial<CustomizeStepType>;
  onChange: (data: CustomizeStepType) => void;
}

const OUTPUT_FORMATS: { value: OutputFormat; label: string; description: string }[] = [
  { value: 'text', label: 'Texte libre', description: 'Réponse en langage naturel' },
  { value: 'json', label: 'JSON', description: 'Format structuré pour les données' },
  { value: 'xml', label: 'XML', description: 'Balisage structuré' },
  { value: 'markdown', label: 'Markdown', description: 'Formatage léger avec mise en forme' }
];

const LENGTH_OPTIONS: { value: PromptLength; label: string; description: string }[] = [
  { value: 'short', label: 'Court', description: 'Réponse concise et directe' },
  { value: 'medium', label: 'Moyen', description: 'Équilibre entre détail et concision' },
  { value: 'detailed', label: 'Détaillé', description: 'Explication complète et approfondie' }
];

const CREATIVITY_OPTIONS: { value: CreativityLevel; label: string; description: string }[] = [
  { value: 'factual', label: 'Factuel', description: 'Basé sur les faits, objectif' },
  { value: 'balanced', label: 'Équilibré', description: 'Mélange de faits et de créativité' },
  { value: 'creative', label: 'Créatif', description: 'Approche innovante et originale' }
];

export const CustomizeStep: React.FC<CustomizeStepProps> = ({ data = {}, onChange }) => {
  const updateField = (field: keyof CustomizeStepType, value: any) => {
    onChange({
      outputFormat: data.outputFormat || 'text',
      length: data.length || 'medium',
      creativity: data.creativity || 'balanced',
      prefillResponse: data.prefillResponse || '',
      allowIdk: data.allowIdk || false,
      requireSources: data.requireSources || false,
      ...{ [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Format de sortie</h3>
        </div>
        
        <div className="space-y-3">
          {OUTPUT_FORMATS.map((format) => (
            <label key={format.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="outputFormat"
                value={format.value}
                checked={data.outputFormat === format.value}
                onChange={(e) => updateField('outputFormat', e.target.value)}
                className="mt-1 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-gray-900">{format.label}</div>
                <div className="text-sm text-gray-500">{format.description}</div>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sliders className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Paramètres de réponse</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longueur de la réponse
            </label>
            <div className="space-y-2">
              {LENGTH_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="length"
                    value={option.value}
                    checked={data.length === option.value}
                    onChange={(e) => updateField('length', e.target.value)}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de créativité
            </label>
            <div className="space-y-2">
              {CREATIVITY_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="creativity"
                    value={option.value}
                    checked={data.creativity === option.value}
                    onChange={(e) => updateField('creativity', e.target.value)}
                    className="mt-1 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Settings className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Options avancées</h3>
        </div>
        
        <div className="space-y-4">
          <Toggle
            checked={data.allowIdk || false}
            onChange={(checked) => updateField('allowIdk', checked)}
            label="Autoriser 'Je ne sais pas'"
            description="L'IA peut répondre qu'elle ne connaît pas la réponse"
          />

          <Toggle
            checked={data.requireSources || false}
            onChange={(checked) => updateField('requireSources', checked)}
            label="Exiger des sources"
            description="Demande à l'IA de citer ses sources quand possible"
          />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Préremplir la réponse (optionnel)</h3>
        </div>
        
        <Input
          placeholder="Commencez la réponse par..."
          value={data.prefillResponse || ''}
          onChange={(e) => updateField('prefillResponse', e.target.value)}
          helpText="L'IA continuera à partir de ce texte"
        />
      </Card>
    </div>
  );
};