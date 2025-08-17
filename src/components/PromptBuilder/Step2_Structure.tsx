import React, { useState } from 'react';
import { User, Tags, Code, Plus, X } from 'lucide-react';
import { Card, Input, Select, Button, Toggle } from '@/components/ui';
import { StructureStep as StructureStepType, PromptExample } from '@/types';

interface StructureStepProps {
  data?: Partial<StructureStepType>;
  onChange: (data: StructureStepType) => void;
}

const ROLES = [
  { value: 'expert_marketing', label: 'Expert en marketing' },
  { value: 'developer', label: 'Développeur expérimenté' },
  { value: 'writer', label: 'Rédacteur professionnel' },
  { value: 'analyst', label: 'Analyste de données' },
  { value: 'consultant', label: 'Consultant en stratégie' },
  { value: 'teacher', label: 'Professeur/Formateur' },
  { value: 'researcher', label: 'Chercheur' },
  { value: 'custom', label: 'Personnalisé...' }
];

const SKILLS = [
  'Analyse critique', 'Créativité', 'Communication claire', 'Expertise technique',
  'Recherche approfondie', 'Synthèse', 'Pédagogie', 'Innovation',
  'Logique structurée', 'Empathie', 'Vision stratégique', 'Précision'
];

export const StructureStep: React.FC<StructureStepProps> = ({ data = {}, onChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newExample, setNewExample] = useState<Partial<PromptExample>>({});

  const updateField = (field: keyof StructureStepType, value: any) => {
    onChange({
      role: data.role || '',
      personality: data.personality || '',
      skills: data.skills || [],
      examples: data.examples || [],
      useXml: data.useXml || false,
      ...{ [field]: value }
    });
  };

  const addSkill = (skill: string) => {
    const skills = data.skills || [];
    if (!skills.includes(skill)) {
      updateField('skills', [...skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    const skills = data.skills || [];
    updateField('skills', skills.filter(s => s !== skill));
  };

  const addCustomSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const addExample = () => {
    if (newExample.input && newExample.output) {
      const examples = data.examples || [];
      updateField('examples', [...examples, newExample as PromptExample]);
      setNewExample({});
    }
  };

  const removeExample = (index: number) => {
    const examples = data.examples || [];
    updateField('examples', examples.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <User className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Rôle et personnalité</h3>
        </div>
        
        <Select
          label="Rôle de l'IA"
          placeholder="Choisissez un rôle"
          options={ROLES}
          value={data.role || ''}
          onChange={(e) => updateField('role', e.target.value)}
          className="mb-3"
        />

        {data.role === 'custom' && (
          <Input
            label="Rôle personnalisé"
            placeholder="Ex: Expert en cybersécurité spécialisé en blockchain"
            value={data.personality || ''}
            onChange={(e) => updateField('personality', e.target.value)}
            className="mb-3"
          />
        )}

        <Input
          label="Personnalité (optionnel)"
          placeholder="Ex: Pédagogue, bienveillant, précis dans les détails"
          value={data.personality || ''}
          onChange={(e) => updateField('personality', e.target.value)}
          helpText="Définit le ton et l'approche de l'IA"
        />
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Tags className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Compétences requises</h3>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences suggérées
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => {
              const isSelected = (data.skills || []).includes(skill);
              return (
                <Button
                  key={skill}
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => isSelected ? removeSkill(skill) : addSkill(skill)}
                  className="text-xs"
                >
                  {skill}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Ajouter une compétence personnalisée"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
          />
          <Button
            onClick={addCustomSkill}
            size="sm"
            disabled={!newSkill.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {(data.skills || []).length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Compétences sélectionnées:</p>
            <div className="flex flex-wrap gap-1">
              {(data.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Code className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">Exemples et format</h3>
        </div>
        
        <Toggle
          checked={data.useXml || false}
          onChange={(checked) => updateField('useXml', checked)}
          label="Utiliser le formatage XML"
          description="Structure le prompt avec des balises XML pour plus de clarté"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exemples entrée/sortie (optionnel)
          </label>
          
          {(data.examples || []).map((example, index) => (
            <div key={index} className="bg-gray-50 rounded p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-700">Exemple {index + 1}</span>
                <button
                  onClick={() => removeExample(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-600">
                <div className="mb-1"><strong>Entrée:</strong> {example.input}</div>
                <div><strong>Sortie:</strong> {example.output}</div>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Input
              placeholder="Exemple d'entrée"
              value={newExample.input || ''}
              onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
              size="sm"
            />
            <Input
              placeholder="Exemple de sortie attendue"
              value={newExample.output || ''}
              onChange={(e) => setNewExample(prev => ({ ...prev, output: e.target.value }))}
              size="sm"
            />
            <Button
              onClick={addExample}
              variant="outline"
              size="sm"
              disabled={!newExample.input || !newExample.output}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter l'exemple
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};