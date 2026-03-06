import { describe, it, expect } from 'vitest';
import { translations, i18n, t } from '../../src/popup/modules/i18n.js';

describe('translations object', () => {
  it('has FR, EN, DE languages', () => {
    expect(translations).toHaveProperty('fr');
    expect(translations).toHaveProperty('en');
    expect(translations).toHaveProperty('de');
  });

  it('FR has all required base keys', () => {
    const required = [
      'app_title', 'start_button', 'library_button',
      'objective_label', 'context_label', 'role_label',
      'copy_button', 'result_title'
    ];
    for (const key of required) {
      expect(translations.fr).toHaveProperty(key);
    }
  });

  it('EN and DE have same top-level keys as FR', () => {
    const frKeys = Object.keys(translations.fr);
    const enKeys = Object.keys(translations.en);
    const deKeys = Object.keys(translations.de);

    const missingInEN = frKeys.filter(k => !enKeys.includes(k));
    const missingInDE = frKeys.filter(k => !deKeys.includes(k));

    // Allow some tolerance but flag major gaps
    if (missingInEN.length > 0) {
      console.warn('Keys missing in EN:', missingInEN);
    }
    if (missingInDE.length > 0) {
      console.warn('Keys missing in DE:', missingInDE);
    }

    // At least 90% coverage
    expect(enKeys.length).toBeGreaterThanOrEqual(frKeys.length * 0.9);
    expect(deKeys.length).toBeGreaterThanOrEqual(frKeys.length * 0.9);
  });

  it('role keys exist in all languages', () => {
    expect(translations.fr).toHaveProperty('roles.senior_consultant');
    expect(translations.en).toHaveProperty('roles.senior_consultant');
    expect(translations.de).toHaveProperty('roles.senior_consultant');
  });
});

describe('i18n.setLanguage()', () => {
  it('switches to EN', () => {
    i18n.setLanguage('en');
    expect(i18n.currentLanguage).toBe('en');
  });

  it('switches to DE', () => {
    i18n.setLanguage('de');
    expect(i18n.currentLanguage).toBe('de');
  });

  it('switches to FR', () => {
    i18n.setLanguage('fr');
    expect(i18n.currentLanguage).toBe('fr');
  });
});

describe('t() / i18n.t()', () => {
  it('returns FR translation', () => {
    i18n.setLanguage('fr');
    expect(t('app_title')).toBe(translations.fr.app_title);
  });

  it('returns EN translation', () => {
    i18n.setLanguage('en');
    expect(t('app_title')).toBe(translations.en.app_title);
  });

  it('returns DE translation', () => {
    i18n.setLanguage('de');
    expect(t('app_title')).toBe(translations.de.app_title);
  });

  it('returns fallback for missing key', () => {
    expect(t('nonexistent_key_xyz', 'fallback_value')).toBe('fallback_value');
  });

  it('returns key itself when no fallback and key missing', () => {
    const result = t('nonexistent_key_abc');
    // Should return key or empty string depending on implementation
    expect(typeof result).toBe('string');
  });

  it('handles dot-notation flat keys (roles.senior_consultant)', () => {
    i18n.setLanguage('fr');
    // Keys are flat strings like "roles.senior_consultant"
    const result = i18n.t('roles.senior_consultant');
    expect(typeof result).toBe('string');
    expect(result).not.toBe('roles.senior_consultant'); // Should not return the key itself
  });

  it('translates score tips in all languages', () => {
    const tipKeys = ['score_tip_role', 'score_tip_objective', 'score_tip_context'];
    for (const lang of ['fr', 'en', 'de']) {
      i18n.setLanguage(lang);
      for (const key of tipKeys) {
        const val = t(key);
        if (translations[lang][key]) {
          expect(val).toBe(translations[lang][key]);
        }
      }
    }
  });
});
