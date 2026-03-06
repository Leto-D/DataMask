// prompt-generator.js - Generateur RTCCO (XML plat / Markdown) + adaptation IA

import { appState } from './state.js';
import { i18n, t } from './i18n.js';

// === TRADUCTION DES VALEURS DE SELECT ===
export function translateSelectValue(category, value) {
  const map = {
    longueur: {
      'courte': { fr: 'courte', en: 'short', de: 'kurz' },
      'moyenne': { fr: 'moyenne', en: 'medium', de: 'mittel' },
      'detaillee': { fr: 'detaillee', en: 'detailed', de: 'detailliert' }
    },
    creativite: {
      'factuelle': { fr: 'factuelle', en: 'factual', de: 'sachlich' },
      'moderee': { fr: 'moderee', en: 'moderate', de: 'moderat' },
      'creative': { fr: 'creative', en: 'creative', de: 'kreativ' }
    },
    format: {
      'texte': { fr: 'texte', en: 'text', de: 'text' },
      'rapport': { fr: 'rapport', en: 'report', de: 'bericht' },
      'liste': { fr: 'liste', en: 'list', de: 'liste' },
      'json': { fr: 'json', en: 'json', de: 'json' },
      'tableau': { fr: 'tableau', en: 'table', de: 'tabelle' }
    },
    reasoning: {
      'none': { fr: 'aucun', en: 'none', de: 'keine' },
      'step-by-step': { fr: 'etape par etape', en: 'step-by-step', de: 'schritt fuer schritt' },
      'justification': { fr: 'justification', en: 'justification', de: 'begruendung' }
    },
    autonomie: {
      'low': { fr: 'faible', en: 'low', de: 'niedrig' },
      'medium': { fr: 'moyenne', en: 'medium', de: 'mittel' },
      'high': { fr: 'elevee', en: 'high', de: 'hoch' }
    },
    profondeur: {
      'low': { fr: 'superficielle', en: 'superficial', de: 'oberflaechlich' },
      'medium': { fr: 'standard', en: 'standard', de: 'standard' },
      'high': { fr: 'approfondie', en: 'deep', de: 'tiefgehend' }
    },
    verbosity: {
      'concise': { fr: 'concise', en: 'concise', de: 'praegnant' },
      'balanced': { fr: 'equilibree', en: 'balanced', de: 'ausgewogen' },
      'detailed': { fr: 'detaillee', en: 'detailed', de: 'ausfuehrlich' }
    },
    tone: {
      'professional': { fr: 'professionnel', en: 'professional', de: 'professionell' },
      'friendly': { fr: 'amical', en: 'friendly', de: 'freundlich' },
      'academic': { fr: 'academique', en: 'academic', de: 'akademisch' },
      'direct': { fr: 'direct', en: 'direct', de: 'direkt' }
    },
    uncertainty: {
      'say-unsure': { fr: 'dire "je ne suis pas sur"', en: 'say "I\'m not sure"', de: '"Ich bin nicht sicher" sagen' },
      'ask-question': { fr: 'poser une question', en: 'ask a question', de: 'eine Frage stellen' },
      'show-confidence': { fr: 'indiquer le niveau de confiance', en: 'indicate confidence level', de: 'Konfidenzniveau angeben' }
    }
  };

  const cat = map[category];
  if (cat && cat[value]) {
    return cat[value][i18n.currentLanguage] || value;
  }
  return value;
}

// === XML ESCAPING ===
function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// === RESOLVE ROLE NAME ===
function getRoleName() {
  const d = appState.data;
  if (d.roleCustom) return d.roleCustom;
  if (d.role && d.role !== '' && d.role !== 'personnalise') {
    const roleNames = {
      'consultant-senior': i18n.t('roles.senior_consultant'),
      'analyste-donnees': i18n.t('roles.data_analyst'),
      'expert-marketing': i18n.t('roles.marketing_expert'),
      'developpeur-senior': i18n.t('roles.senior_developer'),
      'redacteur-technique': i18n.t('roles.technical_writer')
    };
    return roleNames[d.role] || i18n.t('roles.expert', 'Expert dans le domaine');
  }
  return '';
}

// === BUILD PROMPT XML PLAT ===
function buildXmlPrompt() {
  const d = appState.data;
  const sections = [];

  // ROLE
  const roleName = getRoleName();
  const competences = (d.competences || '').trim().replace(/,\s*$/, '');
  const tone = d.tone ? translateSelectValue('tone', d.tone) : '';
  if (roleName || competences || tone) {
    let roleText = '';
    if (roleName) roleText += `${t('prompt_you_are')} ${roleName}`;
    if (competences) roleText += (roleText ? ` ${t('prompt_with_expertise')} ${competences}` : competences);
    if (tone) roleText += (roleText ? `. ${t('prompt_tone')} : ${tone}` : `${t('prompt_tone')} : ${tone}`);
    if (roleText) roleText += '.';
    sections.push(`<role>${escapeXml(roleText)}</role>`);
  }

  // TASK
  const objective = (d.objective || '').trim();
  const instructions = (d.instructions || '').trim();
  if (objective || instructions) {
    let taskText = '';
    if (objective) taskText += objective;
    if (instructions) taskText += (taskText ? `\n\n${t('prompt_instructions')} :\n` : `${t('prompt_instructions')} :\n`) + instructions;
    sections.push(`<task>\n${escapeXml(taskText)}\n</task>`);
  }

  // CONTEXT
  const context = (d.context || '').trim();
  const audience = (d.audience || []).filter(a => a).join(', ');
  const userData = (d.userData || '').trim();
  if (context || audience || userData) {
    let ctxText = '';
    if (context) ctxText += context;
    if (audience) ctxText += (ctxText ? '\n' : '') + `${t('prompt_audience')} : ${audience}`;
    if (userData) ctxText += (ctxText ? '\n' : '') + `${t('prompt_data')} : ${userData}`;
    sections.push(`<context>\n${escapeXml(ctxText)}\n</context>`);
  }

  // EXAMPLES
  const exemples = (d.exemples || '').trim();
  if (exemples) {
    sections.push(`<examples>\n${escapeXml(exemples)}\n</examples>`);
  }

  // CONSTRAINTS
  const constraints = (d.constraints || '').trim();
  const uncertainty = d.uncertainty ? translateSelectValue('uncertainty', d.uncertainty) : '';
  const requireSources = d.requireSources;
  const criteres = (d.criteres || '').trim();
  if (constraints || uncertainty || requireSources || criteres) {
    let cText = '';
    if (constraints) cText += constraints;
    if (uncertainty) cText += (cText ? '\n' : '') + `${t('prompt_uncertainty')} : ${uncertainty}`;
    if (requireSources) cText += (cText ? '\n' : '') + t('prompt_sources_required');
    if (criteres) cText += (cText ? '\n' : '') + `${t('prompt_criteria')} : ${criteres}`;
    sections.push(`<constraints>\n${escapeXml(cText)}\n</constraints>`);
  }

  // OUTPUT
  const format = d.format ? translateSelectValue('format', d.format) : '';
  const longueur = d.longueur ? translateSelectValue('longueur', d.longueur) : '';
  const prefill = (d.prefill || '').trim();
  if (format || longueur || prefill) {
    let oText = '';
    if (format) oText += `${t('prompt_format')} : ${format}`;
    if (longueur) oText += (oText ? '\n' : '') + `${t('prompt_length')} : ${longueur}`;
    if (prefill) oText += (oText ? '\n' : '') + `${t('prompt_prefill')} : ${prefill}`;
    sections.push(`<output>\n${escapeXml(oText)}\n</output>`);
  }

  // PARAMETERS
  const creativite = d.creativite ? translateSelectValue('creativite', d.creativite) : '';
  const reasoning = (d.reasoning && d.reasoning !== 'none') ? translateSelectValue('reasoning', d.reasoning) : '';
  const profondeur = d.profondeur ? translateSelectValue('profondeur', d.profondeur) : '';
  const autonomie = d.autonomie ? translateSelectValue('autonomie', d.autonomie) : '';
  const verbosity = d.verbosity ? translateSelectValue('verbosity', d.verbosity) : '';
  const parts = [];
  if (creativite) parts.push(`${t('prompt_creativity')} : ${creativite}`);
  if (reasoning) parts.push(`${t('prompt_reasoning')} : ${reasoning}`);
  if (profondeur) parts.push(`${t('prompt_depth')} : ${profondeur}`);
  if (autonomie) parts.push(`${t('prompt_autonomy')} : ${autonomie}`);
  if (verbosity) parts.push(`${t('prompt_verbosity')} : ${verbosity}`);
  if (parts.length > 0) {
    sections.push(`<parameters>\n${escapeXml(parts.join(' | '))}\n</parameters>`);
  }

  return sections.join('\n\n');
}

// === BUILD PROMPT MARKDOWN ===
function buildMarkdownPrompt() {
  const d = appState.data;
  const sections = [];

  // ROLE
  const roleName = getRoleName();
  const competences = (d.competences || '').trim().replace(/,\s*$/, '');
  const tone = d.tone ? translateSelectValue('tone', d.tone) : '';
  if (roleName || competences || tone) {
    let roleText = '## ROLE\n';
    if (roleName) roleText += `${t('prompt_you_are')} ${roleName}`;
    if (competences) roleText += (roleName ? ` ${t('prompt_with_expertise')} ${competences}` : competences);
    if (tone) roleText += (roleName || competences ? `. ${t('prompt_tone')} : ${tone}` : `${t('prompt_tone')} : ${tone}`);
    if (roleName || competences || tone) roleText += '.';
    sections.push(roleText);
  }

  // TASK
  const objective = (d.objective || '').trim();
  const instructions = (d.instructions || '').trim();
  if (objective || instructions) {
    let taskText = `## ${t('prompt_md_task')}\n`;
    if (objective) taskText += objective;
    if (instructions) taskText += (objective ? `\n\n### ${t('prompt_instructions')}\n` : `### ${t('prompt_instructions')}\n`) + instructions;
    sections.push(taskText);
  }

  // CONTEXT
  const context = (d.context || '').trim();
  const audience = (d.audience || []).filter(a => a).join(', ');
  const userData = (d.userData || '').trim();
  if (context || audience || userData) {
    let ctxText = `## ${t('prompt_md_context')}\n`;
    if (context) ctxText += context;
    if (audience) ctxText += (context ? '\n' : '') + `**${t('prompt_audience')}** : ${audience}`;
    if (userData) ctxText += `\n**${t('prompt_data')}** : ` + userData;
    sections.push(ctxText);
  }

  // EXAMPLES
  const exemples = (d.exemples || '').trim();
  if (exemples) {
    sections.push(`## ${t('prompt_md_examples')}\n` + exemples);
  }

  // CONSTRAINTS
  const constraints = (d.constraints || '').trim();
  const uncertainty = d.uncertainty ? translateSelectValue('uncertainty', d.uncertainty) : '';
  const requireSources = d.requireSources;
  const criteres = (d.criteres || '').trim();
  if (constraints || uncertainty || requireSources || criteres) {
    let cText = `## ${t('prompt_md_constraints')}\n`;
    if (constraints) cText += constraints;
    if (uncertainty) cText += (constraints ? '\n' : '') + `**${t('prompt_uncertainty')}** : ${uncertainty}`;
    if (requireSources) cText += `\n**${t('prompt_sources_required')}**`;
    if (criteres) cText += `\n**${t('prompt_criteria')}** : ` + criteres;
    sections.push(cText);
  }

  // OUTPUT
  const format = d.format ? translateSelectValue('format', d.format) : '';
  const longueur = d.longueur ? translateSelectValue('longueur', d.longueur) : '';
  const prefill = (d.prefill || '').trim();
  if (format || longueur || prefill) {
    let oText = `## ${t('prompt_md_output')}\n`;
    const oParts = [];
    if (format) oParts.push(`${t('prompt_format')} : ${format}`);
    if (longueur) oParts.push(`${t('prompt_length')} : ${longueur}`);
    if (prefill) oParts.push(`${t('prompt_prefill')} : ${prefill}`);
    oText += oParts.join(' | ');
    sections.push(oText);
  }

  // PARAMETERS
  const creativite = d.creativite ? translateSelectValue('creativite', d.creativite) : '';
  const reasoning = (d.reasoning && d.reasoning !== 'none') ? translateSelectValue('reasoning', d.reasoning) : '';
  const profondeur = d.profondeur ? translateSelectValue('profondeur', d.profondeur) : '';
  const autonomie = d.autonomie ? translateSelectValue('autonomie', d.autonomie) : '';
  const verbosity = d.verbosity ? translateSelectValue('verbosity', d.verbosity) : '';
  const pParts = [];
  if (creativite) pParts.push(`${t('prompt_creativity')} : ${creativite}`);
  if (reasoning) pParts.push(`${t('prompt_reasoning')} : ${reasoning}`);
  if (profondeur) pParts.push(`${t('prompt_depth')} : ${profondeur}`);
  if (autonomie) pParts.push(`${t('prompt_autonomy')} : ${autonomie}`);
  if (verbosity) pParts.push(`${t('prompt_verbosity')} : ${verbosity}`);
  if (pParts.length > 0) {
    sections.push(`## ${t('prompt_md_parameters')}\n` + pParts.join(' | '));
  }

  return sections.join('\n\n');
}

// === XML -> MARKDOWN CONVERTER ===
function xmlToMarkdown(prompt) {
  return prompt.replace(/<(\w+)>\n?([\s\S]*?)\n?<\/\1>/g, (_, tag, content) => {
    return `## ${tag.toUpperCase()}\n${content.trim()}`;
  });
}

// === COMPRESS FOR GEMINI ===
function compressForGemini(prompt) {
  // Remove parameters section
  const withoutParams = prompt
    .replace(/<parameters>[\s\S]*?<\/parameters>\n*/g, '')
    .replace(/## PARAMETRES[\s\S]*?(?=\n## |\n*$)/g, '');
  // Trim extra whitespace
  return withoutParams.replace(/\n{3,}/g, '\n\n').trim();
}

// === COMPRESS FOR PERPLEXITY ===
function compressForPerplexity(prompt) {
  // Remove parameters and output sections (perplexity = research-oriented)
  return prompt
    .replace(/<parameters>[\s\S]*?<\/parameters>\n*/g, '')
    .replace(/<output>[\s\S]*?<\/output>\n*/g, '')
    .replace(/## PARAMETRES[\s\S]*?(?=\n## |\n*$)/g, '')
    .replace(/## FORMAT DE SORTIE[\s\S]*?(?=\n## |\n*$)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// === ADAPTATION PAR MODELE IA ===
export function adaptPromptForAI(prompt, aiModel, useXml) {
  switch(aiModel) {
    case 'claude':
      // Claude gere bien XML et Markdown — garder tel quel
      return prompt;

    case 'chatgpt':
      // GPT prefere Markdown — convertir si XML
      if (useXml) return xmlToMarkdown(prompt);
      return prompt;

    case 'gemini':
      // Gemini : compresser, retirer parameters
      if (useXml) return compressForGemini(prompt);
      return compressForGemini(prompt);

    case 'perplexity':
      // Perplexity : retirer parameters et output
      if (useXml) return compressForPerplexity(prompt);
      return compressForPerplexity(prompt);

    case 'mistral':
    case 'copilot':
      // Markdown standard
      if (useXml) return xmlToMarkdown(prompt);
      return prompt;

    default:
      // Custom AIs: Markdown standard
      if (useXml) return xmlToMarkdown(prompt);
      return prompt;
  }
}

// === PROMPT SCORER ===
// Evalue la qualite du prompt en temps reel (0-100)
// Regle 13 : exemples et donnees collees exclus du decompte de longueur

export class PromptScorer {
  static score(data) {
    let total = 0;
    const tips = [];

    // 1. Role defini (0-15)
    const hasRole = !!(data.role && data.role !== '' && data.role !== 'personnalise') || !!(data.roleCustom);
    const hasCompetences = !!(data.competences && data.competences.trim());
    if (hasRole && hasCompetences) {
      total += 15;
    } else if (hasRole) {
      total += 10;
      tips.push('competences');
    } else {
      tips.push('role');
    }

    // 2. Tache / Objectif (0-25) — le plus important
    const objective = (data.objective || '').trim();
    if (objective.length > 50) {
      total += 25;
    } else if (objective.length > 20) {
      total += 18;
      tips.push('objective_detail');
    } else if (objective.length > 0) {
      total += 10;
      tips.push('objective_detail');
    } else {
      tips.push('objective');
    }

    // 3. Contexte (0-15)
    const context = (data.context || '').trim();
    if (context.length > 30) {
      total += 15;
    } else if (context.length > 0) {
      total += 8;
      tips.push('context_detail');
    } else {
      tips.push('context');
    }

    // 4. Contraintes (0-10)
    const constraints = (data.constraints || '').trim();
    const criteres = (data.criteres || '').trim();
    if (constraints || criteres) {
      total += 10;
    } else {
      tips.push('constraints');
    }

    // 5. Format de sortie (0-10)
    const hasFormat = !!(data.format);
    const hasLongueur = !!(data.longueur);
    if (hasFormat && hasLongueur) {
      total += 10;
    } else if (hasFormat || hasLongueur) {
      total += 5;
    } else {
      tips.push('format');
    }

    // 6. Ton defini (0-5)
    if (data.tone) {
      total += 5;
    }

    // 7. Exemples (0-10 bonus)
    const exemples = (data.exemples || '').trim();
    if (exemples.length > 20) {
      total += 10;
    }

    // 8. Parametres IA (0-5)
    if (data.creativite || data.profondeur || data.verbosity) {
      total += 5;
    }

    // 9. Audience (0-5)
    const audience = (data.audience || []).filter(a => a);
    if (audience.length > 0) {
      total += 5;
    }

    // Cap at 100
    total = Math.min(100, total);

    return {
      score: total,
      tip: tips[0] || null, // Only show first tip
      wordCount: PromptScorer.countWords(data)
    };
  }

  // Compte les mots du prompt (hors exemples et donnees collees — regle 13)
  static countWords(data) {
    const textParts = [
      data.roleCustom || '',
      data.competences || '',
      data.objective || '',
      data.instructions || '',
      data.context || '',
      data.constraints || '',
      data.criteres || ''
      // Exclus : data.exemples, data.userData (regle 13)
    ];
    const text = textParts.join(' ').trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }
}

// === BUILD PROMPT (point d'entree) ===
export function buildPrompt() {
  const d = appState.data;
  const useXml = d.useXml;

  let prompt;
  if (useXml) {
    prompt = buildXmlPrompt();
  } else {
    prompt = buildMarkdownPrompt();
  }

  // Adapter au modele IA si selectionne
  if (appState.selectedAI) {
    prompt = adaptPromptForAI(prompt, appState.selectedAI, useXml);
  }

  return prompt;
}
