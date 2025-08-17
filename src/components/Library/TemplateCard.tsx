import React from 'react';
import { Star, Play, MoreVertical, Users, TrendingUp } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  viewMode: 'grid' | 'list';
  onUse: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, viewMode, onUse }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      business: 'bg-blue-100 text-blue-800',
      technical: 'bg-green-100 text-green-800',
      creative: 'bg-purple-100 text-purple-800',
      analysis: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <Card className="p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
              {template.isPremium && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{template.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                {renderStars(template.rating)}
                <span>({template.rating})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{template.usageCount}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              onClick={() => onUse(template)}
              size="sm"
            >
              <Play className="w-4 h-4 mr-1" />
              Utiliser
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
            {template.category}
          </span>
          {template.isPremium && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Premium
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
          >
            {tag}
          </span>
        ))}
        {template.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            +{template.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            {renderStars(template.rating)}
            <span>({template.rating})</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{template.usageCount}</span>
          </div>
        </div>
        <Button
          onClick={() => onUse(template)}
          size="sm"
        >
          <Play className="w-4 h-4 mr-1" />
          Utiliser
        </Button>
      </div>
    </Card>
  );
};