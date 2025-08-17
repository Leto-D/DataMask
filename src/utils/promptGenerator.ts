import { PromptConfig } from '@/types';

export class PromptGenerator {
  static generatePrompt(config: PromptConfig): string {
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
      const audienceMap = {
        beginner: 'un public débutant',
        intermediate: 'un public intermédiaire',
        expert: 'un public expert',
        general: 'le grand public',
        technical: 'un public technique spécialisé'
      };
      const audienceText = audienceMap[objective.targetAudience as keyof typeof audienceMap] || objective.targetAudience;
      prompt += `Le public cible est : ${audienceText}.\n\n`;
    }

    if (customize.requireSources) {
      prompt += 'Cite tes sources quand c\'est possible.\n';
    }

    if (customize.allowIdk) {
      prompt += 'Si tu ne connais pas la réponse, dis-le clairement.\n';
    }

    if (customize.outputFormat && customize.outputFormat !== 'text') {
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
      prompt += '</instructions>';
    }

    return prompt.trim();
  }

  static formatWithXml(prompt: string): string {
    const sections = [
      { tag: 'contexte', content: '' },
      { tag: 'instructions', content: prompt },
      { tag: 'format', content: '' },
      { tag: 'exemples', content: '' }
    ];

    return sections
      .filter(section => section.content)
      .map(section => `<${section.tag}>\n${section.content}\n</${section.tag}>`)
      .join('\n\n');
  }

  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  static analyzeComplexity(config: PromptConfig): 'simple' | 'medium' | 'complex' {
    let complexityScore = 0;

    if (config.structure.examples && config.structure.examples.length > 0) complexityScore += 2;
    if (config.structure.skills && config.structure.skills.length > 3) complexityScore += 1;
    if (config.structure.useXml) complexityScore += 1;
    if (config.customize.outputFormat !== 'text') complexityScore += 1;
    if (config.customize.requireSources) complexityScore += 1;

    if (complexityScore <= 2) return 'simple';
    if (complexityScore <= 4) return 'medium';
    return 'complex';
  }
}