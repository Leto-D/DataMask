// ai-selector.js - Selecteur IA, IA personnalisees, envoi vers IA

import { appState, fallbackCopy } from './state.js';
import { i18n } from './i18n.js';

function loadCustomAIs() {
  try {
    const saved = localStorage.getItem('grid-custom-ais');
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error('Erreur lors du chargement des IA personnalisees:', error);
  }
  return {};
}

function saveCustomAIs(customAIs) {
  try {
    localStorage.setItem('grid-custom-ais', JSON.stringify(customAIs));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des IA personnalisees:', error);
  }
}

export function updateAISelector() {
  const aiSelector = document.getElementById('ai-selector');
  if (!aiSelector) return;

  const defaultOptions = [
    { value: "", key: "ai_selector_choose" },
    { value: "chatgpt", text: "ChatGPT" },
    { value: "claude", text: "Claude" },
    { value: "gemini", text: "Gemini" },
    { value: "copilot", text: "Copilot" },
    { value: "perplexity", text: "Perplexity" },
    { value: "mistral", text: "Mistral" }
  ];

  const customAIs = loadCustomAIs();
  const currentValue = aiSelector.value;

  aiSelector.innerHTML = '';

  defaultOptions.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    if (option.key) {
      optionEl.setAttribute('data-i18n-option', option.key);
      optionEl.textContent = i18n.t(option.key);
    } else {
      optionEl.textContent = option.text;
    }
    aiSelector.appendChild(optionEl);
  });

  Object.keys(customAIs).forEach(id => {
    const ai = customAIs[id];
    const optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.textContent = ai.name;
    aiSelector.appendChild(optionEl);
  });

  const customOptionEl = document.createElement('option');
  customOptionEl.value = 'custom';
  customOptionEl.setAttribute('data-i18n-option', 'ai_selector_custom');
  customOptionEl.textContent = i18n.t('ai_selector_custom');
  aiSelector.appendChild(customOptionEl);

  aiSelector.value = currentValue;
}

function loadSelectedAI() {
  try {
    const saved = localStorage.getItem('grid-selected-ai');
    if (saved) {
      appState.selectedAI = saved;
      const aiSelector = document.getElementById('ai-selector');
      if (aiSelector) aiSelector.value = saved;
      return saved;
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'IA:', error);
  }
  return null;
}

function saveSelectedAI(aiValue) {
  try {
    localStorage.setItem('grid-selected-ai', aiValue);
    appState.selectedAI = aiValue;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'IA:', error);
  }
}

function getAIUrls() {
  return {
    'chatgpt': 'https://chatgpt.com/',
    'claude': 'https://claude.ai/chat',
    'gemini': 'https://gemini.google.com/app',
    'copilot': 'https://copilot.microsoft.com/',
    'perplexity': 'https://www.perplexity.ai/',
    'mistral': 'https://chat.mistral.ai/chat'
  };
}

function getAIName(aiValue) {
  const names = {
    'chatgpt': 'ChatGPT',
    'claude': 'Claude',
    'gemini': 'Gemini',
    'copilot': 'Copilot',
    'perplexity': 'Perplexity',
    'mistral': 'Mistral'
  };
  if (!names[aiValue]) {
    const customAIs = loadCustomAIs();
    if (customAIs[aiValue]) return customAIs[aiValue].name;
  }
  return names[aiValue] || 'IA selectionnee';
}

function updateSendToAIButton() {
  const btn = document.querySelector('[data-action="send-to-ai"]');
  if (btn && appState.selectedAI) {
    const aiName = getAIName(appState.selectedAI);
    btn.title = `Vers ${aiName}`;
  }
}

function getAIUrlWithPrompt(aiValue, prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  switch(aiValue) {
    case 'chatgpt':
      return `https://chatgpt.com/?q=${encodedPrompt}`;
    case 'claude':
      return 'https://claude.ai/chat';
    case 'gemini':
      return 'https://gemini.google.com/app';
    case 'copilot':
      return 'https://copilot.microsoft.com/';
    case 'perplexity':
      return `https://www.perplexity.ai/?q=${encodedPrompt}`;
    case 'mistral':
      return 'https://chat.mistral.ai/chat';
    default: {
      const customAIs = loadCustomAIs();
      if (customAIs[aiValue]) return customAIs[aiValue].url;
      return getAIUrls()[aiValue];
    }
  }
}

function sendToAI() {
  if (!appState.selectedAI) {
    const aiSelector = document.getElementById('ai-selector');
    if (aiSelector) {
      aiSelector.style.outline = '2px solid #ef4444';
      setTimeout(() => { aiSelector.style.outline = ''; }, 2000);
    }
    return;
  }

  const promptDisplay = document.getElementById('generated-prompt');
  if (!promptDisplay || !promptDisplay.textContent) return;

  const prompt = promptDisplay.textContent;
  const targetUrl = getAIUrlWithPrompt(appState.selectedAI, prompt);
  const aiName = getAIName(appState.selectedAI);

  const doCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(prompt).catch(() => {
        fallbackCopy(prompt);
      });
    }
    fallbackCopy(prompt);
    return Promise.resolve();
  };

  const btn = document.querySelector('[data-action="send-to-ai"]');

  doCopy().then(() => {
    // Show feedback on button
    if (btn) {
      const originalText = btn.querySelector('span')?.textContent;
      const span = btn.querySelector('span');
      if (span) span.textContent = t('send_ai_copied') || `Copie ! Collez dans ${aiName}`;
      btn.style.background = 'var(--status-success)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--status-success)';
      setTimeout(() => {
        if (span && originalText) span.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2500);
    }
    // Open AI tab
    setTimeout(() => {
      chrome.tabs.create({ url: targetUrl });
    }, 300);
  });
}

function showCustomAIModal() {
  const modal = document.getElementById('custom-ai-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    const nameInput = document.getElementById('custom-ai-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 100);
  }
}

function hideCustomAIModal() {
  const modal = document.getElementById('custom-ai-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    const nameInput = document.getElementById('custom-ai-name');
    const urlInput = document.getElementById('custom-ai-url');
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
  }
}

function saveCustomAI() {
  const nameInput = document.getElementById('custom-ai-name');
  const urlInput = document.getElementById('custom-ai-url');
  if (!nameInput || !urlInput) return;

  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (!name || !url) {
    if (nameInput && !name) nameInput.style.outline = '2px solid #ef4444';
    if (urlInput && !url) urlInput.style.outline = '2px solid #ef4444';
    setTimeout(() => {
      if (nameInput) nameInput.style.outline = '';
      if (urlInput) urlInput.style.outline = '';
    }, 2000);
    return;
  }

  try {
    new URL(url);
  } catch (e) {
    if (urlInput) {
      urlInput.style.outline = '2px solid #ef4444';
      setTimeout(() => { urlInput.style.outline = ''; }, 2000);
    }
    return;
  }

  const id = 'custom_' + Date.now();
  const customAIs = loadCustomAIs();
  customAIs[id] = { name, url };
  saveCustomAIs(customAIs);
  updateAISelector();

  const aiSelector = document.getElementById('ai-selector');
  if (aiSelector) {
    aiSelector.value = id;
    saveSelectedAI(id);
    updateSendToAIButton();
  }

  hideCustomAIModal();
}

export function initAISelector() {
  const aiSelector = document.getElementById('ai-selector');
  if (!aiSelector) return;

  updateAISelector();
  loadSelectedAI();

  aiSelector.addEventListener('change', function(e) {
    const selectedAI = e.target.value;
    if (selectedAI === 'custom') {
      showCustomAIModal();
      e.target.value = appState.selectedAI || '';
    } else if (selectedAI) {
      saveSelectedAI(selectedAI);
      updateSendToAIButton();
    }
  });

  // Modal buttons
  document.querySelectorAll('[data-action="close-custom-ai-modal"]').forEach(btn => {
    btn.addEventListener('click', hideCustomAIModal);
  });

  const saveBtn = document.querySelector('[data-action="save-custom-ai"]');
  if (saveBtn) saveBtn.addEventListener('click', saveCustomAI);

  // Send to AI button
  const sendBtn = document.querySelector('[data-action="send-to-ai"]');
  if (sendBtn) sendBtn.addEventListener('click', sendToAI);

  // Restore button title
  setTimeout(() => updateSendToAIButton(), 500);
}
