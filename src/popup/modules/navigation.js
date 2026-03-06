// navigation.js - Navigation for popup (4 tab views) + Side Panel opener
// v2.1: Builder moved to Side Panel, popup has Home/Library/Result/Settings

import { appState, collectAllFormData, fallbackCopy } from './state.js';
import { buildPrompt, PromptScorer } from './prompt-generator.js';
import { t } from './i18n.js';

// === TAB NAVIGATION ===
export function showView(viewId) {
  try {
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
      appState.currentStep = viewId.replace('-view', '');
    }

    // Update tab bar active state
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.tab === viewId) {
        tab.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Erreur dans showView:', error);
  }
}

export function goHome() {
  showView('home-view');
}

export function showLibrary() {
  showView('library-view');
}

export function showResult() {
  showView('result-view');
}

export function showSettings() {
  showView('settings-view');
}

// === SIDE PANEL — BUILDER ===
export function openBuilderSidePanel(templateId) {
  try {
    if (chrome.sidePanel && chrome.sidePanel.open) {
      // Set side panel path with optional template parameter
      const path = templateId
        ? `src/side-panel/index.html?template=${encodeURIComponent(templateId)}`
        : 'src/side-panel/index.html';

      chrome.sidePanel.setOptions({ path, enabled: true }).then(() => {
        chrome.sidePanel.open({ windowId: chrome.windows?.WINDOW_ID_CURRENT });
        // Close popup so it doesn't interfere with side panel input
        window.close();
      }).catch(err => {
        console.warn('Side panel open failed, falling back:', err);
      });
    } else {
      console.warn('chrome.sidePanel API not available');
    }
  } catch (err) {
    console.error('Error opening side panel:', err);
  }
}

// Legacy aliases for compatibility
export function startBuilder() {
  openBuilderSidePanel();
}

export function goToBuilder() {
  openBuilderSidePanel();
}

// === GENERATE PROMPT (called from popup when receiving message from side panel) ===
export function generatePrompt(autoSaveInstance) {
  collectAllFormData();
  const generatedPrompt = buildPrompt();
  if (!generatedPrompt.trim()) {
    return;
  }
  const promptDisplay = document.getElementById('generated-prompt');
  if (promptDisplay) {
    promptDisplay.textContent = generatedPrompt;
  }

  // Update score in result view
  const scoreResult = PromptScorer.score(appState.data);
  updateResultScore(scoreResult);

  if (autoSaveInstance) {
    autoSaveInstance.clearSave();
  }
  showView('result-view');
}

// === DISPLAY PROMPT FROM SIDE PANEL MESSAGE ===
export function displayGeneratedPrompt(prompt, scoreData) {
  const promptDisplay = document.getElementById('generated-prompt');
  if (promptDisplay) {
    promptDisplay.textContent = prompt;
  }
  if (scoreData) {
    updateResultScore(scoreData);
  }
  showView('result-view');
}

function updateResultScore(scoreData) {
  const scoreNum = document.getElementById('result-score-num');
  const scoreFill = document.getElementById('result-score-fill');
  if (scoreNum) {
    scoreNum.textContent = scoreData.score;
    // Color based on score
    if (scoreData.score >= 70) scoreNum.style.color = 'var(--status-success)';
    else if (scoreData.score >= 40) scoreNum.style.color = 'var(--amber-600)';
    else scoreNum.style.color = 'var(--status-error)';
  }
  if (scoreFill) {
    scoreFill.style.width = scoreData.score + '%';
    if (scoreData.score >= 70) scoreFill.style.background = 'var(--status-success)';
    else if (scoreData.score >= 40) scoreFill.style.background = 'var(--amber-600)';
    else scoreFill.style.background = 'var(--status-error)';
  }
}

export function copyPrompt() {
  const promptDisplay = document.getElementById('generated-prompt');
  if (promptDisplay && promptDisplay.textContent) {
    try {
      navigator.clipboard.writeText(promptDisplay.textContent).then(() => {
        const btn = document.getElementById('copy-btn');
        if (btn) {
          const originalText = btn.querySelector('span')?.textContent || btn.textContent;
          if (btn.querySelector('span')) {
            btn.querySelector('span').textContent = '✓';
            setTimeout(() => { btn.querySelector('span').textContent = originalText; }, 1000);
          }
        }
      }).catch(() => {
        fallbackCopy(promptDisplay.textContent);
      });
    } catch (err) {
      fallbackCopy(promptDisplay.textContent);
    }
  }
}

// === TAB BAR INIT ===
function initTabBar() {
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      const viewId = tab.dataset.tab;
      if (viewId) {
        showView(viewId);
      }
    });
  });
}

// === KEYBOARD SUPPORT ===
class KeyboardSupport {
  constructor() {
    this.focusableSelectors = [
      'input:not([disabled]):not([type="hidden"])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'button:not([disabled])',
      '[data-action]:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])'
    ];
  }

  getFocusableElements() {
    const selector = this.focusableSelectors.join(',');
    const elements = Array.from(document.querySelectorAll(selector));
    return elements.filter(el => {
      return el.offsetParent !== null &&
        !el.hasAttribute('hidden') &&
        getComputedStyle(el).visibility !== 'hidden';
    });
  }

  handleKeyNavigation(event) {
    const { key, ctrlKey, metaKey } = event;

    switch (key) {
      case 'Escape':
        this.handleEscape();
        break;
      case 'Enter':
        this.handleEnter(event);
        break;
    }

    if (ctrlKey || metaKey) {
      switch (key) {
        case 'Enter':
          event.preventDefault();
          this.triggerPrimaryAction();
          break;
      }
    }
  }

  handleEscape() {
    const activeModal = document.querySelector('.modal-overlay:not(.hidden)');
    if (activeModal) {
      activeModal.style.display = 'none';
      activeModal.classList.add('hidden');
      return;
    }
    // In popup 4-tab mode, Escape does nothing special (no back nav needed)
  }

  handleEnter(event) {
    const target = event.target;
    if (target.tagName === 'BUTTON' || target.hasAttribute('data-action')) {
      event.preventDefault();
      target.click();
      return;
    }
    if (target.tagName === 'TEXTAREA') return;
  }

  triggerPrimaryAction() {
    const currentView = document.querySelector('.view.active');
    if (!currentView) return;
    const viewId = currentView.id;
    let primaryButton;
    switch (viewId) {
      case 'home-view':
        primaryButton = document.getElementById('btn-open-builder');
        break;
      case 'result-view':
        primaryButton = document.getElementById('copy-btn');
        break;
    }
    if (primaryButton) primaryButton.click();
  }

  enhanceFocusVisibility() {
    const style = document.createElement('style');
    style.textContent = `
      *:focus { outline: 2px solid var(--amber-600) !important; outline-offset: 2px !important; }
      .tab-item:focus { outline: none !important; }
    `;
    document.head.appendChild(style);
  }

  init(autoSaveInstance) {
    document.addEventListener('keydown', (event) => this.handleKeyNavigation(event));
    this.enhanceFocusVisibility();
  }
}

// === INIT NAVIGATION ===
export function initNavigation(autoSaveInstance) {
  const keyboardSupport = new KeyboardSupport();
  keyboardSupport.init(autoSaveInstance);
  initTabBar();
  initActionHandlers();
}

// === ACTION HANDLERS ===
function initActionHandlers() {
  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    switch (action) {
      case 'open-builder':
      case 'open-builder-recent':
        openBuilderSidePanel();
        break;
      case 'open-builder-template':
        openBuilderSidePanel('swot');
        break;
      case 'copy-prompt':
        copyPrompt();
        break;
      case 'send-to-ai':
        // Will be handled by ai-selector module
        break;
      case 'close-custom-ai-modal':
        const modal = document.getElementById('custom-ai-modal');
        if (modal) {
          modal.style.display = 'none';
          modal.classList.add('hidden');
        }
        break;
    }
  });
}
