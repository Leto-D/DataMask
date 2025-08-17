import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { TemplateCard } from './TemplateCard';
import { Template, TemplateCategory } from '@/types';

interface TemplateLibraryProps {
  onBack: () => void;
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Article de blog',
    category: 'business',
    description: 'Créer un article de blog engageant et SEO-friendly',
    structure: {
      objective: {
        title: 'Rédiger un article de blog',
        description: 'Créer un article informatif et engageant sur un sujet donné',
        targetAudience: 'general',
        actionRequired: 'Rédige',
        suggestions: []
      },
      structure: {
        role: 'expert_marketing',
        personality: 'Expert en marketing de contenu',
        skills: ['Rédaction web', 'SEO', 'Engagement'],
        examples: [],
        useXml: true
      }
    },
    tags: ['blog', 'marketing', 'contenu'],
    isPremium: false,
    isUserCreated: false,
    usageCount: 45,
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Analyse de code',
    category: 'technical',
    description: 'Analyser et optimiser du code informatique',
    structure: {
      objective: {
        title: 'Analyser du code',
        description: 'Réviser et proposer des améliorations pour du code',
        targetAudience: 'expert',
        actionRequired: 'Analyse',
        suggestions: []
      },
      structure: {
        role: 'developer',
        personality: 'Développeur senior expérimenté',
        skills: ['Architecture', 'Optimisation', 'Sécurité'],
        examples: [],
        useXml: true
      }
    },
    tags: ['code', 'développement', 'analyse'],
    isPremium: false,
    isUserCreated: false,
    usageCount: 32,
    rating: 4.6,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const CATEGORIES: { value: TemplateCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'general', label: 'Général' },
  { value: 'business', label: 'Business' },
  { value: 'technical', label: 'Technique' },
  { value: 'creative', label: 'Créatif' },
  { value: 'analysis', label: 'Analyse' }
];

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [templates] = useState<Template[]>(MOCK_TEMPLATES);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
          >
            ← Retour
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">Bibliothèque</h2>
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Rechercher un template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          
          <div className="flex space-x-2">
            <Select
              options={CATEGORIES}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | 'all')}
              placeholder="Catégorie"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun template trouvé</p>
            <p className="text-sm text-gray-400 mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 gap-3' 
              : 'space-y-2'
            }
          `}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                viewMode={viewMode}
                onUse={(template) => {
                  console.log('Using template:', template);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};