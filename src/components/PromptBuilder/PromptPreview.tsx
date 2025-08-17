import React from 'react';
import { Eye, Copy, Download, Star } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { PromptConfig } from '@/types';

interface PromptPreviewProps {
  config: PromptConfig;
  compact?: boolean;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({ config, compact = false }) => {
  const generatePrompt = (): string => {
    const { objective, structure, customize } = config;
    
    let prompt = '';

    if (structure.useXml) {
      prompt += '<instructions>\n';
    }

    if (structure.role) {
      prompt += `Tu es ${structure.role}`;
      if (structure.personality) {
        prompt += `, ${structure.personality}`;
      }
      prompt += '.\n\n';
    }

    if (structure.skills && structure.skills.length > 0) {
      prompt += `Tes compétences principales sont : ${structure.skills.join(', ')}.\n\n`;
    }

    if (objective.title && objective.description) {
      prompt += `${objective.actionRequired || 'Je veux que tu'} : ${objective.description}\n\n`;
    }

    if (objective.targetAudience) {
      prompt += `Le public cible est : ${objective.targetAudience}.\n\n`;
    }

    if (customize.requireSources) {
      prompt += 'Cite tes sources quand c\'est possible.\n';
    }

    if (customize.allowIdk) {
      prompt += 'Si tu ne connais pas la réponse, dis-le clairement.\n';
    }

    if (customize.outputFormat !== 'text') {
      prompt += `Format de réponse souhaité : ${customize.outputFormat.toUpperCase()}.\n`;
    }

    if (customize.length) {
      const lengthMap = {
        short: 'Sois concis et direct.',
        medium: 'Fournis une réponse équilibrée.',
        detailed: 'Donne une explication détaillée et complète.'
      };
      prompt += `${lengthMap[customize.length]}\n`;
    }

    if (customize.creativity) {
      const creativityMap = {
        factual: 'Reste factuel et objectif.',
        balanced: 'Équilibre entre faits et créativité.',
        creative: 'Sois créatif et innovant dans ton approche.'
      };
      prompt += `${creativityMap[customize.creativity]}\n`;
    }

    if (structure.examples && structure.examples.length > 0) {
      prompt += '\nExemples :\n';
      structure.examples.forEach((example, index) => {
        prompt += `${index + 1}. Entrée: "${example.input}" → Sortie: "${example.output}"\n`;
      });
    }

    if (customize.prefillResponse) {
      prompt += `\nCommence ta réponse par : "${customize.prefillResponse}"\n`;
    }

    if (structure.useXml) {
      prompt = prompt.replace('<instructions>\n', '<instructions>\n') + '</instructions>';
    }

    return prompt.trim();
  };

  const promptText = generatePrompt();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([promptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (compact) {
    return (
      <div className="bg-white rounded border p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Aperçu</span>
          </div>
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 max-h-20 overflow-y-auto scrollbar-thin">
          {promptText || 'Votre prompt apparaîtra ici...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Votre prompt est prêt</h3>
          <div className="flex space-x-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copier
            </Button>
            <Button
              onClick={downloadPrompt}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Télécharger
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto scrollbar-thin">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {promptText}
          </pre>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {promptText.split(' ').length} mots • ~{Math.ceil(promptText.length / 4)} tokens
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-1" />
              Sauvegarder
            </Button>
            <Button size="sm">
              Modifier
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};