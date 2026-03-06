// popup.js - Point d'entrée v2.1
// 4 vues : Home, Library, Result, Settings (Builder dans Side Panel)

import { AutoSave, RealTimeValidator } from './modules/state.js';
import { i18n, t, updateTranslations } from './modules/i18n.js';
import { initNavigation, showView, displayGeneratedPrompt, copyPrompt, openBuilderSidePanel } from './modules/navigation.js';
import { initAISelector, updateAISelector } from './modules/ai-selector.js';
import { initLibrary, renderLibrary } from './modules/library.js';
import { initSettings } from './modules/settings.js';

document.addEventListener('DOMContentLoaded', function () {
  try {
    // === THEME ===
    chrome.storage?.local.get('theme', (data) => {
      if (data?.theme === 'dark') {
        document.documentElement.dataset.theme = 'dark';
      }
    });

    // === LANGUE ===
    // Radio pill language selector
    const langGroup = document.getElementById('language-selector-group');
    if (langGroup) {
      const pills = langGroup.querySelectorAll('.radio-pill');
      // Set active from current language
      pills.forEach(pill => {
        const lang = pill.dataset.lang;
        if (lang === i18n.currentLanguage) {
          pill.classList.add('active');
          pill.querySelector('input').checked = true;
        } else {
          pill.classList.remove('active');
        }
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          pill.querySelector('input').checked = true;
          i18n.setLanguage(lang);
          updateTranslations();
          updateAISelector();
        });
      });
    }
    updateTranslations();

    // === AUTO-SAVE & VALIDATION ===
    const autoSave = new AutoSave();
    const validator = new RealTimeValidator();

    // === NAVIGATION (tab bar, keyboard) ===
    initNavigation(autoSave);

    // === AI SELECTOR (Settings) ===
    initAISelector();

    // === LIBRARY ===
    initLibrary();
    renderLibrary();

    // === SETTINGS ===
    initSettings();

    // === SETTINGS SCROLL INDICATOR ===
    const settingsContent = document.querySelector('#settings-view .content');
    const scrollHint = document.getElementById('settings-scroll-hint');
    if (settingsContent && scrollHint) {
      settingsContent.addEventListener('scroll', () => {
        if (settingsContent.scrollTop > 20) {
          scrollHint.classList.add('hidden');
        } else {
          scrollHint.classList.remove('hidden');
        }
      });
    }

    // === DARK MODE TOGGLE ===
    const darkToggle = document.getElementById('settings-dark-mode');
    if (darkToggle) {
      chrome.storage?.local.get('theme', (data) => {
        darkToggle.checked = data?.theme === 'dark';
      });
      darkToggle.addEventListener('change', () => {
        const theme = darkToggle.checked ? 'dark' : 'light';
        document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : '';
        chrome.storage?.local.set({ theme });
      });
    }

    // === HOME VIEW DATA ===
    loadHomeViewData();

    // === PASTE PROTECT TOGGLE (home view) ===
    const ppToggle = document.getElementById('paste-protect-toggle');
    if (ppToggle) {
      chrome.storage?.local.get('pasteProtectEnabled', (data) => {
        ppToggle.checked = data?.pasteProtectEnabled !== false;
      });
      ppToggle.addEventListener('change', () => {
        chrome.storage?.local.set({ pasteProtectEnabled: ppToggle.checked });
        // Send to content script
        chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'GRID_PASTE_PROTECT_TOGGLE',
              enabled: ppToggle.checked
            }).catch(() => { });
          }
        });
        updatePPToggleLabel(ppToggle.checked);
      });
    }

    // === SETTINGS DATA EXPORT/PURGE ===
    document.getElementById('settings-export-json')?.addEventListener('click', () => {
      chrome.runtime?.sendMessage({ type: 'GRID_EXPORT_JOURNAL', format: 'json' }, (data) => {
        if (chrome.runtime.lastError) return;
        const content = Array.isArray(data) ? data : [];
        downloadBlob(JSON.stringify(content, null, 2), 'grid-journal.json', 'application/json');
      });
    });
    document.getElementById('settings-export-csv')?.addEventListener('click', () => {
      chrome.runtime?.sendMessage({ type: 'GRID_EXPORT_JOURNAL', format: 'csv' }, (data) => {
        if (chrome.runtime.lastError) return;
        downloadBlob(data || '', 'grid-journal.csv', 'text/csv');
      });
    });
    document.getElementById('settings-purge')?.addEventListener('click', () => {
      if (confirm(t('dash_purge_confirm'))) {
        chrome.runtime?.sendMessage({ type: 'GRID_PURGE_JOURNAL' }, () => {
          const countEl = document.getElementById('settings-total-count');
          if (countEl) countEl.textContent = '0';
        });
      }
    });

    // === CUSTOM SITES ===
    initCustomSites();

    // === LISTEN FOR PROMPT FROM SIDE PANEL ===
    chrome.runtime?.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'GRID_PROMPT_GENERATED') {
        displayGeneratedPrompt(msg.prompt, msg.score);
        sendResponse({ ok: true });
      }
    });

    // === QUOTA ===
    updateQuotaBadge();

    // === CHECK FOR PROMPT GENERATED WHILE POPUP WAS CLOSED ===
    chrome.runtime?.sendMessage({ type: 'GRID_GET_LAST_PROMPT' }, (data) => {
      if (chrome.runtime.lastError || !data) return;
      // Only show if generated recently (within last 5 minutes)
      if (data.timestamp && (Date.now() - data.timestamp) < 5 * 60 * 1000) {
        displayGeneratedPrompt(data.prompt, data.score);
      }
    });

    // === FILTER CHIPS (Library) ===
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        filterLibrary(filter);
      });
    });

    // === LIBRARY SEARCH ===
    const searchInput = document.getElementById('library-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          searchLibrary(searchInput.value);
        }, 200);
      });
    }

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
});

// === HOME VIEW POPULATION ===
function loadHomeViewData() {
  // Current site domain
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const siteEl = document.getElementById('home-site-domain');
    const statusDot = document.getElementById('home-status-dot');
    const statusText = document.getElementById('home-status-text');
    const ppSite = document.getElementById('pp-toggle-site');

    if (tabs[0]?.url) {
      try {
        const rawUrl = tabs[0].url;
        // Filter out chrome internal pages
        if (rawUrl.startsWith('chrome://') || rawUrl.startsWith('chrome-extension://') || rawUrl.startsWith('about:')) {
          if (siteEl) siteEl.textContent = '—';
          if (statusDot) { statusDot.classList.remove('active'); statusDot.classList.add('inactive'); }
          if (statusText) statusText.textContent = t('home_status_inactive');
          if (ppSite) ppSite.textContent = '—';
          return;
        }

        const url = new URL(rawUrl);
        const domain = url.hostname;
        if (siteEl) siteEl.textContent = domain;
        if (ppSite) ppSite.textContent = domain;

        // Check if PasteProtect is active on this site
        const supportedSites = [
          'claude.ai', 'chatgpt.com', 'chat.openai.com',
          'chat.deepseek.com', 'gemini.google.com',
          'copilot.microsoft.com', 'perplexity.ai', 'www.perplexity.ai'
        ];
        const isSupported = supportedSites.some(s => domain.includes(s));

        if (isSupported) {
          statusDot?.classList.remove('inactive', 'unsupported');
          statusDot?.classList.add('active');
          if (statusText) statusText.textContent = t('home_status_active');
        } else {
          statusDot?.classList.remove('active', 'unsupported');
          statusDot?.classList.add('inactive');
          if (statusText) statusText.textContent = t('home_status_inactive');
        }
      } catch {
        if (siteEl) siteEl.textContent = '—';
      }
    }
  });

  // Stats
  chrome.runtime?.sendMessage({ type: 'GRID_GET_STATS' }, (stats) => {
    if (chrome.runtime.lastError || !stats) return;
    const totalEl = document.getElementById('home-stat-total');
    const monthEl = document.getElementById('home-stat-month');
    const todayEl = document.getElementById('home-stat-today');
    const settingsTotal = document.getElementById('settings-total-count');

    if (totalEl) totalEl.textContent = stats.total || 0;
    if (monthEl) monthEl.textContent = stats.month || 0;
    if (todayEl) todayEl.textContent = `${stats.today || 0}/20`;
    if (settingsTotal) settingsTotal.textContent = stats.total || 0;
  });
}

function updatePPToggleLabel(enabled) {
  const ppSite = document.getElementById('pp-toggle-site');
  if (ppSite) {
    ppSite.textContent = enabled ? t('home_pp_active') : t('home_pp_inactive');
  }
}

// === QUOTA BADGE ===
function updateQuotaBadge() {
  const badge = document.getElementById('quota-badge');
  if (!badge) return;

  if (!chrome.runtime?.sendMessage) {
    badge.style.display = 'none';
    return;
  }

  chrome.runtime.sendMessage({ type: 'GRID_GET_QUOTA_DISPLAY' }, (quota) => {
    if (chrome.runtime.lastError || !quota) {
      badge.style.display = 'none';
      return;
    }

    if (quota.plan !== 'free') {
      badge.textContent = 'Pro';
      badge.className = 'quota-badge quota-pro';
    } else {
      const used = quota.count || 0;
      const limit = 20;
      badge.textContent = `${used}/${limit}`;
      badge.className = used >= limit ? 'quota-badge quota-warning' : 'quota-badge';
    }
  });
}

// === LIBRARY FILTER/SEARCH ===
function filterLibrary(filter) {
  const cards = document.querySelectorAll('.template-card');
  cards.forEach(card => {
    if (filter === 'all') {
      card.classList.remove('hidden');
    } else {
      const tags = card.dataset.tags || '';
      card.classList.toggle('hidden', !tags.includes(filter));
    }
  });
}

function searchLibrary(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.template-card');
  cards.forEach(card => {
    if (!normalizedQuery) {
      card.classList.remove('hidden');
      return;
    }
    const title = (card.querySelector('.tc-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.tc-desc')?.textContent || '').toLowerCase();
    card.classList.toggle('hidden', !title.includes(normalizedQuery) && !desc.includes(normalizedQuery));
  });
}

// === CUSTOM SITES ===
function initCustomSites() {
  const input = document.getElementById('custom-site-input');
  const addBtn = document.getElementById('custom-site-add-btn');
  if (!input || !addBtn) return;

  loadCustomSites();

  addBtn.addEventListener('click', () => addCustomSite(input));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addCustomSite(input);
  });
}

function addCustomSite(input) {
  const site = input.value.trim();
  if (!site) return;

  chrome.runtime?.sendMessage({ type: 'GRID_ADD_CUSTOM_SITE', site }, (res) => {
    if (chrome.runtime.lastError) return;
    if (res?.ok) {
      input.value = '';
      loadCustomSites();
    } else if (res?.error === 'limit_reached') {
      input.style.borderColor = 'var(--status-error)';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    } else if (res?.error === 'duplicate') {
      input.style.borderColor = 'var(--status-warning)';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    } else if (res?.error === 'already_included') {
      input.style.borderColor = 'var(--status-warning)';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }
  });
}

function loadCustomSites() {
  chrome.runtime?.sendMessage({ type: 'GRID_GET_CUSTOM_SITES' }, (res) => {
    if (chrome.runtime.lastError || !res) return;
    const list = document.getElementById('custom-sites-list');
    const counter = document.getElementById('custom-sites-counter');
    if (!list) return;

    list.innerHTML = '';
    (res.customSites || []).forEach(site => {
      const item = document.createElement('div');
      item.className = 'custom-site-item';

      const name = document.createElement('span');
      name.className = 'custom-site-name';
      name.textContent = site;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'custom-site-remove';
      removeBtn.textContent = '\u00D7';
      removeBtn.addEventListener('click', () => {
        chrome.runtime?.sendMessage({ type: 'GRID_REMOVE_CUSTOM_SITE', site }, () => {
          loadCustomSites();
        });
      });

      item.appendChild(name);
      item.appendChild(removeBtn);
      list.appendChild(item);
    });

    if (counter) {
      const count = (res.customSites || []).length;
      const limit = res.limit;
      if (limit === Infinity) {
        counter.textContent = `${count} ${t('settings_custom_sites_count_pro')}`;
      } else {
        counter.textContent = `${count}/${limit} ${t('settings_custom_sites_count')}`;
      }
    }
  });
}

// === DOWNLOAD HELPER ===
function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
