// state.js - AppState, AutoSave, RealTimeValidator, collectAllFormData

import { t } from './i18n.js';

export const appState = {
  currentStep: 'home',
  data: {},
  selectedAI: null
};

// === SYSTEME DE SAUVEGARDE AUTOMATIQUE ===
export class AutoSave {
  constructor() {
    this.saveInterval = 30000;
    this.storageKey = 'grid_autosave_draft';
    this.lastSaveTime = 0;
    this.isDirty = false;
  }

  collectFormData() {
    const formData = {};
    document.querySelectorAll('input, textarea, select').forEach(element => {
      if (element.id && (element.value || element.checked)) {
        formData[element.id] = element.type === 'checkbox' ? element.checked : element.value;
      }
    });
    return {
      data: formData,
      timestamp: Date.now(),
      version: '2.0.0'
    };
  }

  saveToStorage() {
    if (!this.isDirty) return;
    try {
      const formData = this.collectFormData();
      localStorage.setItem(this.storageKey, JSON.stringify(formData));
      this.lastSaveTime = Date.now();
      this.isDirty = false;
    } catch (error) {
      console.error('Erreur auto-save:', error);
    }
  }

  restoreFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return null;
      const parsedData = JSON.parse(saved);
      const timeDiff = Date.now() - parsedData.timestamp;
      if (timeDiff > 24 * 60 * 60 * 1000) {
        this.clearSave();
        return null;
      }
      return parsedData;
    } catch (error) {
      console.error('Erreur restore auto-save:', error);
      this.clearSave();
      return null;
    }
  }

  restoreFormFields() {
    const savedData = this.restoreFromStorage();
    if (!savedData || !savedData.data) return false;
    let restored = 0;
    Object.entries(savedData.data).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
        restored++;
      }
    });
    if (restored > 0) {
      return true;
    }
    return false;
  }

  clearSave() {
    localStorage.removeItem(this.storageKey);
  }

  markDirty() {
    this.isDirty = true;
  }

  init() {
    setInterval(() => {
      this.saveToStorage();
    }, this.saveInterval);
    document.addEventListener('input', () => {
      this.markDirty();
    });
    document.addEventListener('change', () => {
      this.markDirty();
    });
  }
}

// === SYSTEME DE VALIDATION TEMPS REEL ===
export class RealTimeValidator {
  constructor() {
    this.rules = {
      'objective': { minLength: 20, required: true, messageKey: 'valid_objective' },
      'context': { minLength: 10, required: false, messageKey: 'valid_context' },
      'instructions': { minLength: 5, required: false, messageKey: 'valid_min5' },
      'success-criteria': { minLength: 10, required: false, messageKey: 'valid_criteria' },
      'role-custom': { minLength: 10, required: false, messageKey: 'valid_role' },
      'skills': { minLength: 5, required: false, messageKey: 'valid_skills' },
      'examples': { minLength: 20, required: false, messageKey: 'valid_examples' }
    };
  }

  validateField(fieldId, value) {
    const rule = this.rules[fieldId];
    if (!rule) return { isValid: true };
    const isValid = this.checkRule(rule, value);
    const message = isValid ? '' : t(rule.messageKey);
    return { isValid, message, rule };
  }

  checkRule(rule, value) {
    if (rule.required && !value.trim()) return false;
    if (rule.minLength && value.trim().length < rule.minLength) return false;
    return true;
  }

  showFeedback(fieldId, validation) {
    const field = document.getElementById(fieldId);
    const container = field?.closest('.form-group');
    if (!field || !container) return;
    this.clearFieldFeedback(container);
    if (validation.isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
      this.showErrorMessage(container, validation.message);
    }
    if (validation.rule && validation.rule.minLength) {
      this.showCharacterCount(container, field.value.length, validation.rule.minLength);
    }
  }

  clearFieldFeedback(container) {
    const existingError = container.querySelector('.validation-error');
    const existingCounter = container.querySelector('.char-counter');
    if (existingError) existingError.remove();
    if (existingCounter) existingCounter.remove();
  }

  showErrorMessage(container, message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'validation-error';
    errorEl.textContent = message;
    container.appendChild(errorEl);
  }

  showCharacterCount(container, currentLength, minLength) {
    const counterEl = document.createElement('div');
    counterEl.className = 'char-counter';
    const isValid = currentLength >= minLength;
    counterEl.textContent = `${currentLength}/${minLength} ${t('valid_chars')}`;
    counterEl.classList.toggle('valid', isValid);
    container.appendChild(counterEl);
  }

  validateAllFields() {
    let isFormValid = true;
    Object.keys(this.rules).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && field.offsetParent !== null) {
        const validation = this.validateField(fieldId, field.value || '');
        this.showFeedback(fieldId, validation);
        if (!validation.isValid && this.rules[fieldId].required) {
          isFormValid = false;
        }
      }
    });
    return isFormValid;
  }

  init() {
    Object.keys(this.rules).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        let timeout;
        field.addEventListener('input', () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            const validation = this.validateField(fieldId, field.value);
            this.showFeedback(fieldId, validation);
          }, 500);
        });
        field.addEventListener('blur', () => {
          const validation = this.validateField(fieldId, field.value);
          this.showFeedback(fieldId, validation);
        });
      }
    });
  }
}

// === CLIPBOARD FALLBACK ===
export function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try { document.execCommand('copy'); } catch (err) { /* noop */ }
  document.body.removeChild(textArea);
}

// === COLLECTE DE DONNEES ===
export function collectAllFormData() {
  // Text fields mapping: elementId -> stateKey
  const textFields = {
    'objective': 'objective',
    'context': 'context',
    'instructions': 'instructions',
    'criteres': 'criteres',
    'role-custom': 'roleCustom',
    'competences': 'competences',
    'exemples': 'exemples',
    'prefill': 'prefill',
    'user-data': 'userData',
    'constraints': 'constraints'
  };

  // Select fields
  const selectFields = {
    'role': 'role',
    'tone': 'tone',
    'uncertainty': 'uncertainty',
    'longueur': 'longueur',
    'creativite': 'creativite',
    'format': 'format',
    'reasoning': 'reasoning',
    'eagerness': 'autonomie',
    'reasoning-effort': 'profondeur',
    'verbosity': 'verbosity'
  };

  Object.entries(textFields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) appState.data[key] = (el.value || '').trim();
  });

  Object.entries(selectFields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) appState.data[key] = el.value;
  });

  // Multi-select: audience
  const audienceSelect = document.getElementById('audience');
  if (audienceSelect) {
    appState.data.audience = Array.from(audienceSelect.selectedOptions).map(opt => opt.value);
  }

  // Checkboxes
  const checkboxes = {
    'allow-unknown': 'allowUnknown',
    'require-sources': 'requireSources',
    'use-xml': 'useXml'
  };
  Object.entries(checkboxes).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) appState.data[key] = el.checked;
  });

  return appState.data;
}
