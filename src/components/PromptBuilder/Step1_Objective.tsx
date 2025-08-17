import React from 'react';
import { Target, Users, Zap, HelpCircle } from 'lucide-react';
import { Card, Input, Select, Button } from '@/components/ui';
import { ObjectiveStep as ObjectiveStepType } from '@/types';

interface ObjectiveStepProps {
  data?: Partial<ObjectiveStepType>;
  onChange: (data: ObjectiveStepType) => void;
}

const SUGGESTIONS = [
  'Rédiger un article de blog',
  'Analyser des données',
  'Créer un plan marketing',
  'Résoudre un problème technique',
  'Écrire du code',
  'Résumer un document',
  'Traduire du contenu',
  'Brainstormer des idées'
];

const AUDIENCES = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'expert', label: 'Expert' },
  { value: 'general', label: 'Grand public' },
  { value: 'technical', label: 'Technique spécialisé' }
];

export const ObjectiveStep: React.FC<ObjectiveStepProps> = ({ data = {}, onChange }) => {
  const updateField = (field: keyof ObjectiveStepType, value: any) => {
    onChange({
      title: data.title || '',
      description: data.description || '',
      targetAudience: data.targetAudience || '',
      actionRequired: data.actionRequired || '',
      suggestions: data.suggestions || [],
      ...{ [field]: value }
    });
  };

  const addSuggestion = (suggestion: string) => {
    updateField('title', suggestion);
    updateField('description', `Aide-moi à ${suggestion.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Objectif principal</h3>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        
        <Input
          label="Titre de votre demande"
          placeholder="Ex: Rédiger un article de blog sur l'IA"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="mb-3"
        />

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggestions rapides
          </label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => addSuggestion(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        <Input
          label="Description détaillée"
          placeholder="Décrivez précisément ce que vous souhaitez obtenir..."
          value={data.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          helpText="Plus vous êtes précis, meilleur sera le résultat"
        />
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Audience cible</h3>
        </div>
        
        <Select
          label="Niveau d'expertise de votre audience"
          placeholder="Sélectionnez le niveau"
          options={AUDIENCES}
          value={data.targetAudience || ''}
          onChange={(e) => updateField('targetAudience', e.target.value)}
          helpText="Adapte le niveau de vocabulaire et d'explication"
        />
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Action attendue</h3>
        </div>
        
        <Input
          label="Que doit faire l'IA exactement ?"
          placeholder="Ex: Rédigez, analysez, listez, expliquez..."
          value={data.actionRequired || ''}
          onChange={(e) => updateField('actionRequired', e.target.value)}
          helpText="Utilisez des verbes d'action clairs"
        />
      </Card>
    </div>
  );
};