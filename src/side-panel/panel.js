// panel.js — Side Panel entry point for the Builder
// Imports same modules as popup for shared logic

import { AutoSave, RealTimeValidator } from '../popup/modules/state.js';
import { i18n, t, updateTranslations } from '../popup/modules/i18n.js';
import { buildPrompt, PromptScorer } from '../popup/modules/prompt-generator.js';
import { appState, collectAllFormData, fallbackCopy } from '../popup/modules/state.js';
import { PasteProtect } from '../popup/paste-protect/interceptor.js';

document.addEventListener('DOMContentLoaded', function () {
  try {
    // Apply theme from storage + listen for changes
    chrome.storage.local.get('theme', (data) => {
      document.documentElement.dataset.theme = data.theme === 'dark' ? 'dark' : '';
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.theme) {
        document.documentElement.dataset.theme = changes.theme.newValue === 'dark' ? 'dark' : '';
      }
    });

    // Language
    i18n.updateDOM(document);

    // AutoSave & Validator
    const autoSave = new AutoSave();
    const validator = new RealTimeValidator();

    // Init accordions
    initPanelAccordions();

    // Init live preview
    initPanelLivePreview();

    // Init section statuses
    initPanelSectionStatuses();

    // Suggestion tags
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const type = tag.getAttribute('data-suggestion');
        let targetInput;
        if (type === 'competence') targetInput = document.getElementById('competences');
        else if (type === 'objectif') targetInput = document.getElementById('objective');
        if (targetInput) {
          const current = targetInput.value;
          const suggestion = tag.textContent;
          if (current && !current.includes(suggestion)) {
            targetInput.value = current + ', ' + suggestion;
          } else if (!current) {
            targetInput.value = suggestion;
          }
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });

    // Role custom toggle
    const roleSelect = document.getElementById('role');
    const roleCustom = document.getElementById('role-custom');
    if (roleSelect && roleCustom) {
      roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'personnalise') {
          roleCustom.classList.remove('hidden');
          roleCustom.focus();
        } else {
          roleCustom.classList.add('hidden');
          roleCustom.value = '';
        }
      });
    }

    // PasteProtect
    const pasteProtect = new PasteProtect((result) => {
      const banner = document.getElementById('paste-protect-banner');
      if (!banner) return;

      if (result.error) {
        banner.className = 'shield-banner error';
        banner.textContent = result.error;
        banner.classList.remove('hidden');
      } else if (result.detections && result.detections.length > 0) {
        banner.className = result.hasArt9 ? 'shield-banner warning' : 'shield-banner';
        banner.textContent = `${result.detections.length} ${t('pp_detected')}`;
        banner.classList.remove('hidden');
        updatePanelPasteProtectPanel(pasteProtect);
      }
    });

    // PasteProtect toggle
    const ppToggle = document.getElementById('paste-protect-toggle');
    if (ppToggle) {
      chrome.storage.local.get('pasteProtectEnabled', (data) => {
        const enabled = data?.pasteProtectEnabled !== false;
        ppToggle.checked = enabled;
        pasteProtect.toggle(enabled);
      });
      ppToggle.addEventListener('change', () => {
        pasteProtect.toggle(ppToggle.checked);
        chrome.storage.local.set({ pasteProtectEnabled: ppToggle.checked });
      });
    }

    // PasteProtect panel toggle
    const ppPanelToggle = document.getElementById('pp-panel-toggle');
    const ppPanelBody = document.getElementById('pp-panel-body');
    if (ppPanelToggle && ppPanelBody) {
      ppPanelToggle.addEventListener('click', () => {
        const isExpanded = ppPanelToggle.getAttribute('aria-expanded') === 'true';
        ppPanelToggle.setAttribute('aria-expanded', !isExpanded);
        ppPanelBody.classList.toggle('hidden');
      });
    }

    // PasteProtect reset
    document.getElementById('pp-reset')?.addEventListener('click', () => {
      pasteProtect.getEngine().reset();
      updatePanelPasteProtectPanel(pasteProtect);
    });

    // Generate button
    const generateBtn = document.querySelector('[data-action="generate-prompt"]');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        generateFromPanel(autoSave);
      });
    }

    // Restore previous session
    setTimeout(() => {
      autoSave.restoreFormFields();
      validator.validateAllFields();
    }, 500);

    // Load template if passed via URL params
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('template');
    if (templateId) {
      loadTemplateById(templateId);
    }

  } catch (error) {
    console.error('Erreur lors de l\'initialisation du panel:', error);
  }
});

// === GENERATE PROMPT AND SEND TO POPUP ===
function generateFromPanel(autoSaveInstance) {
  collectAllFormData();
  const generatedPrompt = buildPrompt();
  if (!generatedPrompt.trim()) {
    const objectiveField = document.getElementById('objective');
    if (objectiveField) {
      objectiveField.style.outline = '2px solid var(--status-error)';
      objectiveField.focus();
      setTimeout(() => { objectiveField.style.outline = ''; }, 2000);
    }
    return;
  }

  // Show generated prompt in live preview
  const previewEl = document.getElementById('live-prompt-preview');
  const previewContent = document.getElementById('live-preview-content');
  const livePreview = document.getElementById('live-preview');
  if (previewEl) {
    previewEl.textContent = generatedPrompt;
  }
  // Expand live preview to show the result
  if (previewContent) previewContent.classList.remove('hidden');
  if (livePreview) livePreview.classList.remove('collapsed');

  // Update score display
  updatePanelScore();

  // Auto-copy to clipboard
  navigator.clipboard.writeText(generatedPrompt).then(() => {
    showGenerateSuccess();
  }).catch(() => {
    fallbackCopy(generatedPrompt);
    showGenerateSuccess();
  });

  // Send to background for storage (popup can retrieve it later)
  chrome.runtime.sendMessage({
    type: 'GRID_PROMPT_GENERATED',
    prompt: generatedPrompt,
    score: PromptScorer.score(appState.data)
  });

  if (autoSaveInstance) {
    autoSaveInstance.clearSave();
  }
}

// Show success feedback on the generate button
function showGenerateSuccess() {
  const btn = document.querySelector('[data-action="generate-prompt"]');
  if (!btn) return;
  const originalText = btn.textContent;
  btn.textContent = '✓ Copié !';
  btn.style.background = 'var(--status-success)';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 2000);
}

// === PASTE PROTECT PANEL UPDATE ===
function updatePanelPasteProtectPanel(pp) {
  const panel = document.getElementById('paste-protect-panel');
  const tbody = document.getElementById('pp-table-body');
  const countEl = document.getElementById('pp-count');
  if (!panel || !tbody || !pp) return;

  const engine = pp.getEngine();
  if (!engine) return;

  const mappings = engine.getMappings();
  if (!mappings || mappings.length === 0) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  countEl.textContent = mappings.length;
  tbody.innerHTML = '';

  mappings.forEach(m => {
    const tr = document.createElement('tr');
    const tdPseudo = document.createElement('td');
    tdPseudo.style.fontFamily = 'var(--font-mono)';
    tdPseudo.style.fontSize = '11px';
    tdPseudo.textContent = m.pseudonym;
    const tdCat = document.createElement('td');
    tdCat.textContent = m.category || '—';
    const tdRgpd = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = m.rgpdCategory === 'art9' ? 'pp-badge-art9' : 'pp-badge-art4';
    badge.textContent = m.rgpdCategory === 'art9' ? 'Art.9' : 'Art.4';
    tdRgpd.appendChild(badge);
    tr.appendChild(tdPseudo);
    tr.appendChild(tdCat);
    tr.appendChild(tdRgpd);
    tbody.appendChild(tr);
  });
}

// === ACCORDIONS ===
function initPanelAccordions() {
  document.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const section = head.getAttribute('data-toggle');
      const body = document.getElementById(section + '-body');
      const isOpen = head.getAttribute('aria-expanded') === 'true';
      const acc = head.closest('.acc');

      // Close all other sections
      document.querySelectorAll('.acc-head').forEach(otherHead => {
        if (otherHead !== head) {
          otherHead.setAttribute('aria-expanded', 'false');
          const otherSection = otherHead.getAttribute('data-toggle');
          const otherBody = document.getElementById(otherSection + '-body');
          if (otherBody) otherBody.classList.remove('open');
          otherHead.closest('.acc')?.classList.remove('active');
        }
      });

      // Toggle current
      head.setAttribute('aria-expanded', !isOpen);
      if (isOpen) {
        body.classList.remove('open');
        acc?.classList.remove('active');
      } else {
        body.classList.add('open');
        acc?.classList.add('active');
        const firstInput = body.querySelector('input, textarea, select');
        if (firstInput) setTimeout(() => firstInput.focus(), 300);
      }
    });
  });

  // Live preview toggle
  const previewToggle = document.getElementById('live-preview-toggle');
  const previewContent = document.getElementById('live-preview-content');
  const livePreview = document.getElementById('live-preview');
  if (previewToggle && previewContent) {
    previewToggle.addEventListener('click', (e) => {
      if (e.target.id === 'live-preview-copy-btn') return;
      previewContent.classList.toggle('hidden');
      livePreview?.classList.toggle('collapsed');
    });
  }

  // Live preview copy
  const previewCopyBtn = document.getElementById('live-preview-copy-btn');
  if (previewCopyBtn) {
    previewCopyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const preview = document.getElementById('live-prompt-preview');
      if (preview && preview.textContent) {
        navigator.clipboard.writeText(preview.textContent).catch(() => {
          fallbackCopy(preview.textContent);
        });
        previewCopyBtn.textContent = '✓';
        setTimeout(() => { previewCopyBtn.textContent = t('copy_button'); }, 1000);
      }
    });
  }
}

// === LIVE PREVIEW ===
let previewTimeout = null;
function initPanelLivePreview() {
  document.addEventListener('input', () => {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      updatePanelLivePreview();
    }, 500);
  });
}

function updatePanelLivePreview() {
  const previewEl = document.getElementById('live-prompt-preview');
  if (!previewEl) return;

  collectAllFormData();
  const prompt = buildPrompt();
  previewEl.textContent = prompt;

  // Update score
  updatePanelScore();
}

function updatePanelScore() {
  const result = PromptScorer.score(appState.data);
  const scoreEl = document.getElementById('panel-score');
  if (scoreEl) {
    scoreEl.textContent = result.score;
  }

  // Update score card
  const card = document.getElementById('score-card');
  if (!card) return;

  let color = '#DC2626';
  if (result.score >= 70) color = '#059669';
  else if (result.score >= 40) color = '#D97706';

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (result.score / 100) * circumference;

  const tipMap = {
    role: 'score_tip_role',
    competences: 'score_tip_competences',
    objective: 'score_tip_objective',
    objective_detail: 'score_tip_objective_detail',
    context: 'score_tip_context',
    context_detail: 'score_tip_context_detail',
    constraints: 'score_tip_constraints',
    format: 'score_tip_format'
  };
  const tipKey = result.tip ? tipMap[result.tip] : null;
  const tipText = tipKey ? t(tipKey) : '';

  card.classList.remove('hidden');
  card.innerHTML = '';

  const ringWrap = document.createElement('div');
  ringWrap.className = 'score-ring-wrap';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 44 44');
  svg.setAttribute('width', '44');
  svg.setAttribute('height', '44');
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', '22');
  bgCircle.setAttribute('cy', '22');
  bgCircle.setAttribute('r', radius);
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', '#e5e7eb');
  bgCircle.setAttribute('stroke-width', '4');
  const fgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  fgCircle.setAttribute('cx', '22');
  fgCircle.setAttribute('cy', '22');
  fgCircle.setAttribute('r', radius);
  fgCircle.setAttribute('fill', 'none');
  fgCircle.setAttribute('stroke', color);
  fgCircle.setAttribute('stroke-width', '4');
  fgCircle.setAttribute('stroke-dasharray', circumference);
  fgCircle.setAttribute('stroke-dashoffset', offset);
  fgCircle.setAttribute('stroke-linecap', 'round');
  fgCircle.setAttribute('transform', 'rotate(-90 22 22)');
  fgCircle.style.transition = 'stroke-dashoffset 0.5s ease';
  svg.appendChild(bgCircle);
  svg.appendChild(fgCircle);
  const scoreNum = document.createElement('span');
  scoreNum.className = 'score-num';
  scoreNum.style.color = color;
  scoreNum.textContent = result.score;
  ringWrap.appendChild(svg);
  ringWrap.appendChild(scoreNum);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'score-info';
  const titleSpan = document.createElement('span');
  titleSpan.className = 'score-title';
  titleSpan.textContent = t('score_quality');
  const wordsSpan = document.createElement('span');
  wordsSpan.className = 'score-words';
  wordsSpan.textContent = result.wordCount + ' ' + t('score_words');
  infoDiv.appendChild(titleSpan);
  infoDiv.appendChild(wordsSpan);
  if (tipText) {
    const tipSpan = document.createElement('span');
    tipSpan.className = 'score-tip';
    tipSpan.textContent = tipText;
    infoDiv.appendChild(tipSpan);
  }

  card.appendChild(ringWrap);
  card.appendChild(infoDiv);
}

// === SECTION STATUSES ===
let statusTimeout = null;
function initPanelSectionStatuses() {
  document.addEventListener('input', () => {
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      updatePanelSectionStatuses();
    }, 300);
  });
  setTimeout(updatePanelSectionStatuses, 600);
}

function getFieldValue(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  if (el.type === 'checkbox') return el.checked ? 'yes' : '';
  if (el.multiple) {
    return Array.from(el.selectedOptions).map(o => o.value).join(',');
  }
  return (el.value || '').trim();
}

function updatePanelSectionStatuses() {
  const sections = {
    identity: { fields: ['role', 'competences'], key: ['role', 'competences'] },
    task: { fields: ['objective'], key: ['objective'] },
    context: { fields: ['context', 'audience'], key: ['context'] },
    constraints: { fields: ['constraints', 'criteres'], key: [] },
    output: { fields: ['format', 'longueur'], key: [] },
    parameters: { fields: ['creativite', 'reasoning', 'eagerness'], key: [] }
  };

  Object.entries(sections).forEach(([sectionId, config]) => {
    const statusEl = document.getElementById(sectionId + '-status');
    const stepBadge = document.querySelector(`[data-section="${sectionId}"] .step-badge`);
    if (!statusEl) return;

    const fieldValues = config.fields.map(f => getFieldValue(f));
    const filledCount = fieldValues.filter(v => v && v.length > 0).length;

    if (filledCount === 0) {
      statusEl.textContent = '○';
      statusEl.className = 'section-status';
      stepBadge?.classList.remove('complete');
    } else if (filledCount < config.fields.length) {
      statusEl.textContent = '◐';
      statusEl.className = 'section-status partial';
      stepBadge?.classList.remove('complete');
    } else {
      statusEl.textContent = '✓';
      statusEl.className = 'section-status complete';
      stepBadge?.classList.add('complete');
    }
  });
}

// === LOAD TEMPLATE ===
function loadTemplateById(templateId) {
  // Templates will be loaded via chrome.storage.session or chrome.runtime.sendMessage
  chrome.runtime.sendMessage({ type: 'GRID_GET_TEMPLATE', templateId }, (response) => {
    if (response && response.data) {
      const data = response.data;
      Object.entries(data).forEach(([key, value]) => {
        const el = document.getElementById(key);
        if (el) {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }
  });
}

// Keyboard: Escape to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
});
