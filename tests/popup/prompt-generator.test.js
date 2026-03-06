import { describe, it, expect, beforeEach } from 'vitest';
import { translateSelectValue, adaptPromptForAI, PromptScorer } from '../../src/popup/modules/prompt-generator.js';
import { appState } from '../../src/popup/modules/state.js';
import { i18n } from '../../src/popup/modules/i18n.js';

// escapeXml is not exported, so we test it indirectly via buildPrompt
// We can test it through the XML output containing escaped chars

describe('translateSelectValue()', () => {
  it('translates longueur values in FR', () => {
    i18n.currentLanguage = 'fr';
    expect(translateSelectValue('longueur', 'courte')).toBe('courte');
    expect(translateSelectValue('longueur', 'moyenne')).toBe('moyenne');
    expect(translateSelectValue('longueur', 'detaillee')).toBe('detaillee');
  });

  it('translates longueur values in EN', () => {
    i18n.currentLanguage = 'en';
    expect(translateSelectValue('longueur', 'courte')).toBe('short');
    expect(translateSelectValue('longueur', 'moyenne')).toBe('medium');
  });

  it('translates longueur values in DE', () => {
    i18n.currentLanguage = 'de';
    expect(translateSelectValue('longueur', 'courte')).toBe('kurz');
  });

  it('translates tone values', () => {
    i18n.currentLanguage = 'en';
    expect(translateSelectValue('tone', 'professional')).toBe('professional');
    expect(translateSelectValue('tone', 'friendly')).toBe('friendly');
    expect(translateSelectValue('tone', 'academic')).toBe('academic');
  });

  it('translates format values', () => {
    i18n.currentLanguage = 'fr';
    expect(translateSelectValue('format', 'rapport')).toBe('rapport');
    expect(translateSelectValue('format', 'json')).toBe('json');
  });

  it('returns raw value for unknown category', () => {
    expect(translateSelectValue('unknown_cat', 'something')).toBe('something');
  });

  it('returns raw value for unknown value in known category', () => {
    expect(translateSelectValue('longueur', 'ultra_long')).toBe('ultra_long');
  });

  it('translates all categories', () => {
    i18n.currentLanguage = 'fr';
    const testValues = {
      longueur: 'courte', creativite: 'factuelle', format: 'texte',
      reasoning: 'step-by-step', autonomie: 'low', profondeur: 'low',
      verbosity: 'concise', tone: 'professional', uncertainty: 'say-unsure'
    };
    for (const [cat, value] of Object.entries(testValues)) {
      const result = translateSelectValue(cat, value);
      expect(typeof result).toBe('string');
    }
  });
});

describe('adaptPromptForAI()', () => {
  const xmlPrompt = '<role>Expert</role>\n\n<task>Analyse</task>\n\n<parameters>\nCreativite: moderee\n</parameters>';
  const mdPrompt = '## ROLE\nExpert\n\n## TACHE\nAnalyse\n\n## PARAMETRES\nCreativite: moderee';

  it('keeps XML for Claude', () => {
    expect(adaptPromptForAI(xmlPrompt, 'claude', true)).toBe(xmlPrompt);
  });

  it('keeps Markdown for Claude', () => {
    expect(adaptPromptForAI(mdPrompt, 'claude', false)).toBe(mdPrompt);
  });

  it('converts XML to Markdown for ChatGPT', () => {
    const result = adaptPromptForAI(xmlPrompt, 'chatgpt', true);
    expect(result).toContain('## ROLE');
    expect(result).toContain('## TASK');
    expect(result).not.toContain('<role>');
  });

  it('keeps Markdown as-is for ChatGPT', () => {
    const result = adaptPromptForAI(mdPrompt, 'chatgpt', false);
    expect(result).toBe(mdPrompt);
  });

  it('removes parameters for Gemini', () => {
    const result = adaptPromptForAI(xmlPrompt, 'gemini', true);
    expect(result).not.toContain('<parameters>');
    expect(result).not.toContain('Creativite');
  });

  it('removes parameters and output for Perplexity', () => {
    const withOutput = xmlPrompt + '\n\n<output>\nFormat: texte\n</output>';
    const result = adaptPromptForAI(withOutput, 'perplexity', true);
    expect(result).not.toContain('<parameters>');
    expect(result).not.toContain('<output>');
  });

  it('converts XML to Markdown for Mistral', () => {
    const result = adaptPromptForAI(xmlPrompt, 'mistral', true);
    expect(result).toContain('## ROLE');
    expect(result).not.toContain('<role>');
  });

  it('converts XML to Markdown for Copilot', () => {
    const result = adaptPromptForAI(xmlPrompt, 'copilot', true);
    expect(result).toContain('## ROLE');
  });

  it('converts XML to Markdown for custom/unknown AI', () => {
    const result = adaptPromptForAI(xmlPrompt, 'custom_12345', true);
    expect(result).toContain('## ROLE');
  });
});

describe('PromptScorer', () => {
  it('returns 0 for empty data', () => {
    const result = PromptScorer.score({});
    expect(result.score).toBe(0);
    expect(result.tip).toBe('role');
    expect(result.wordCount).toBe(0);
  });

  it('scores role (10 points without competences)', () => {
    const result = PromptScorer.score({ role: 'consultant-senior' });
    expect(result.score).toBe(10);
    expect(result.tip).toBe('competences');
  });

  it('scores role + competences (15 points)', () => {
    const result = PromptScorer.score({
      role: 'consultant-senior',
      competences: 'Analyse strategique'
    });
    expect(result.score).toBe(15);
  });

  it('scores custom role', () => {
    const result = PromptScorer.score({ roleCustom: 'Expert en cybersecurite' });
    expect(result.score).toBeGreaterThanOrEqual(10);
  });

  it('scores objective (25 points for >50 chars)', () => {
    const result = PromptScorer.score({
      objective: 'Analyser les tendances du marche et proposer des recommandations strategiques detaillees'
    });
    expect(result.score).toBe(25);
  });

  it('scores short objective (10 points for 1-20 chars)', () => {
    const result = PromptScorer.score({ objective: 'Analyser les donnees' });
    expect(result.score).toBe(10);
  });

  it('scores medium objective (18 points for 21-50 chars)', () => {
    const result = PromptScorer.score({ objective: 'Analyser les donnees du marche en profondeur' });
    expect(result.score).toBe(18);
  });

  it('scores context (15 points for >30 chars)', () => {
    const result = PromptScorer.score({
      context: 'Entreprise B2B de logiciels pour PME, secteur tech'
    });
    expect(result.score).toBe(15);
  });

  it('scores constraints (10 points)', () => {
    const result = PromptScorer.score({ constraints: 'Maximum 500 mots' });
    expect(result.score).toBe(10);
  });

  it('scores criteres as constraints alternative', () => {
    const result = PromptScorer.score({ criteres: 'Precision, concision' });
    expect(result.score).toBe(10);
  });

  it('scores format + longueur (10 points for both)', () => {
    const result = PromptScorer.score({ format: 'rapport', longueur: 'detaillee' });
    expect(result.score).toBe(10);
  });

  it('scores format only (5 points)', () => {
    const result = PromptScorer.score({ format: 'rapport' });
    expect(result.score).toBe(5);
  });

  it('scores tone (5 points)', () => {
    const result = PromptScorer.score({ tone: 'professional' });
    expect(result.score).toBe(5);
  });

  it('scores examples (10 bonus for >20 chars)', () => {
    const result = PromptScorer.score({
      exemples: 'Input: Donnees brutes\nOutput: Rapport structure avec recommandations'
    });
    expect(result.score).toBe(10);
  });

  it('scores AI parameters (5 points)', () => {
    const result = PromptScorer.score({ creativite: 'moderee' });
    expect(result.score).toBe(5);
  });

  it('scores audience (5 points)', () => {
    const result = PromptScorer.score({ audience: ['investisseurs'] });
    expect(result.score).toBe(5);
  });

  it('caps at 100', () => {
    const result = PromptScorer.score({
      role: 'consultant-senior',
      competences: 'Analyse strategique, Marketing digital',
      objective: 'Analyser les tendances du marche et proposer des recommandations strategiques detaillees pour une expansion internationale',
      context: 'Entreprise SaaS B2B, 50 employes, levee serie A',
      constraints: 'Maximum 1000 mots, sources academiques uniquement',
      criteres: 'Pertinence, faisabilite, ROI',
      format: 'rapport',
      longueur: 'detaillee',
      tone: 'professional',
      exemples: 'Input: Donnees Q1 2024\nOutput: Rapport avec 5 sections structurees et graphiques',
      creativite: 'moderee',
      audience: ['investisseurs', 'direction']
    });
    expect(result.score).toBe(100);
  });

  it('provides first missing tip', () => {
    const result = PromptScorer.score({ objective: 'Court' });
    // Missing role, so tip should be 'role'
    expect(result.tip).toBe('role');
  });

  describe('countWords()', () => {
    it('counts words excluding exemples and userData (rule 13)', () => {
      const result = PromptScorer.countWords({
        objective: 'Analyser les donnees',
        exemples: 'Cet exemple ne compte pas dans le total',
        userData: 'Ces donnees non plus'
      });
      expect(result).toBe(3); // "Analyser les donnees"
    });

    it('returns 0 for empty data', () => {
      expect(PromptScorer.countWords({})).toBe(0);
    });

    it('counts across multiple fields', () => {
      const result = PromptScorer.countWords({
        roleCustom: 'Expert marketing',
        objective: 'Analyser le marche',
        context: 'Entreprise B2B'
      });
      // 2 + 3 + 2 = 7 words (spaces between joined fields create no extra words)
      expect(result).toBe(7);
    });
  });
});
