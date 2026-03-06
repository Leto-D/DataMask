// settings.js - PasteProtect anonymization settings
// Loads/saves settings from chrome.storage.local

const DEFAULTS = {
  pasteProtectEnabled: true,
  enabledCategories: ['contact', 'financial', 'identity', 'technical'],
  blacklist: { categories: ['SECU_FR', 'CARD', 'API_KEY'], customPatterns: [] },
  confidenceThreshold: 'medium',
  retentionDays: 30
};

export function initSettings() {
  loadSettings();

  // PasteProtect toggle
  document.getElementById('settings-pp-enabled')?.addEventListener('change', saveSettings);

  // Category toggles
  document.querySelectorAll('[data-category]').forEach(el => {
    el.addEventListener('change', saveSettings);
  });

  // Blacklist toggles
  document.querySelectorAll('[data-bl-category]').forEach(el => {
    el.addEventListener('change', saveSettings);
  });

  // Confidence threshold
  document.getElementById('settings-confidence')?.addEventListener('change', saveSettings);

  // Retention
  document.getElementById('settings-retention')?.addEventListener('change', saveSettings);
}

function loadSettings() {
  if (!chrome.storage?.local) return;

  chrome.storage.local.get(
    ['pasteProtectEnabled', 'enabledCategories', 'blacklist', 'confidenceThreshold', 'retentionDays'],
    (data) => {
      const enabled = data.pasteProtectEnabled !== undefined ? data.pasteProtectEnabled : DEFAULTS.pasteProtectEnabled;
      const categories = data.enabledCategories || DEFAULTS.enabledCategories;
      const blacklist = data.blacklist || DEFAULTS.blacklist;
      const confidence = data.confidenceThreshold || DEFAULTS.confidenceThreshold;
      const retention = data.retentionDays || DEFAULTS.retentionDays;

      // PasteProtect toggle
      const ppToggle = document.getElementById('settings-pp-enabled');
      if (ppToggle) ppToggle.checked = enabled;

      // Category toggles
      document.querySelectorAll('[data-category]').forEach(el => {
        el.checked = categories.includes(el.getAttribute('data-category'));
      });

      // Blacklist toggles
      const blCategories = blacklist.categories || [];
      document.querySelectorAll('[data-bl-category]').forEach(el => {
        el.checked = blCategories.includes(el.getAttribute('data-bl-category'));
      });

      // Confidence
      const confSelect = document.getElementById('settings-confidence');
      if (confSelect) confSelect.value = confidence;

      // Retention
      const retSelect = document.getElementById('settings-retention');
      if (retSelect) retSelect.value = retention;
    }
  );
}

function saveSettings() {
  if (!chrome.storage?.local) return;

  const enabled = document.getElementById('settings-pp-enabled')?.checked ?? true;

  const categories = [];
  document.querySelectorAll('[data-category]').forEach(el => {
    if (el.checked) categories.push(el.getAttribute('data-category'));
  });

  const blCategories = [];
  document.querySelectorAll('[data-bl-category]').forEach(el => {
    if (el.checked) blCategories.push(el.getAttribute('data-bl-category'));
  });

  const confidence = document.getElementById('settings-confidence')?.value || 'medium';
  const retention = parseInt(document.getElementById('settings-retention')?.value || '30', 10);

  chrome.storage.local.set({
    pasteProtectEnabled: enabled,
    enabledCategories: categories,
    blacklist: { categories: blCategories, customPatterns: [] },
    confidenceThreshold: confidence,
    retentionDays: retention
  });
}
