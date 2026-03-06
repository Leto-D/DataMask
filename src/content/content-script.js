// content-script.js - Interception paste sur les sites IA
// Fail-open : en cas d'erreur, coller le texte original
// Fail-closed : blacklist bloque le collage
// Bundled par Vite avec les modules paste-protect

import { process as processText } from '../paste-protect/processor.js';
import { detect } from '../paste-protect/detector.js';
import { selectAdapter } from './adapters/adapter-registry.js';
import { showToast } from './toast.js';

const DATAMASK_VERSION = '2.1.1';
let cachedBlacklist = null;
let cachedSettings = {
  enabledCategories: ['contact', 'financial', 'identity', 'technical'],
  confidenceThreshold: 'medium'
};

function init() {
  console.log(`[DataMask ${DATAMASK_VERSION}] Content script loaded on ${location.hostname}`);

  // Cache blacklist + settings
  loadBlacklist();
  loadSettings();

  // Listen for changes
  chrome.storage?.onChanged.addListener((changes) => {
    if (changes.blacklist) cachedBlacklist = changes.blacklist.newValue;
    if (changes.enabledCategories) cachedSettings.enabledCategories = changes.enabledCategories.newValue;
    if (changes.confidenceThreshold) cachedSettings.confidenceThreshold = changes.confidenceThreshold.newValue;
  });

  document.addEventListener('paste', handlePaste, true);

  // Init typing monitor
  initTypingMonitor();
}

function loadBlacklist() {
  chrome.storage?.local.get('blacklist', (data) => {
    cachedBlacklist = data?.blacklist || { categories: ['SECU_FR', 'CARD', 'API_KEY'], customPatterns: [] };
  });
}

function loadSettings() {
  chrome.storage?.local.get(['enabledCategories', 'confidenceThreshold'], (data) => {
    if (data?.enabledCategories) cachedSettings.enabledCategories = data.enabledCategories;
    if (data?.confidenceThreshold) cachedSettings.confidenceThreshold = data.confidenceThreshold;
  });
}

// === PASTE HANDLER ===

function handlePaste(event) {
  const text = event.clipboardData?.getData('text/plain');
  if (!text || text.trim().length === 0) return;

  const adapterResult = selectAdapter();
  if (!adapterResult) return;

  const target = event.target;
  const editorEl = adapterResult.element;
  if (!editorEl.contains(target) && target !== editorEl) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  try {
    chrome.storage?.local.get(['pasteProtectEnabled'], (data) => {
      const enabled = data?.pasteProtectEnabled !== false;

      if (!enabled) {
        adapterResult.adapter.insertText(editorEl, text);
        return;
      }

      processAndInsert(text, adapterResult);
    });

    if (!chrome.storage?.local) {
      processAndInsert(text, adapterResult);
    }

  } catch (err) {
    console.error('[DataMask] Erreur PasteProtect:', err);
    adapterResult.adapter.insertText(editorEl, text);
    showToast('DataMask - Erreur', 'Texte colle sans protection', 'error', 3000);
  }
}

function processAndInsert(text, adapterResult) {
  try {
    doProcessAndInsert(text, adapterResult);
  } catch (err) {
    console.error('[DataMask] Erreur traitement:', err);
    adapterResult.adapter.insertText(adapterResult.element, text);
    showToast('DataMask - Erreur', 'Texte colle sans protection', 'error', 3000);
  }
}

function doProcessAndInsert(text, adapterResult) {
  try {
    const result = processText(text, {
      enabledCategories: cachedSettings.enabledCategories,
      confidenceThreshold: cachedSettings.confidenceThreshold
    });

    if (result.count === 0) {
      adapterResult.adapter.insertText(adapterResult.element, text);
      return;
    }

    // === BLACKLIST CHECK (fail-closed) ===
    const blacklist = cachedBlacklist || { categories: [] };
    const blockedDetections = result.detections.filter(d => blacklist.categories.includes(d.patternId));

    if (blockedDetections.length > 0) {
      // BLOQUER — ne pas coller
      const blockedCategories = [...new Set(blockedDetections.map(d => d.patternId))].join(', ');
      showToast(
        `DataMask - ${blockedDetections.length} donnee(s) bloquee(s)`,
        `Categorie(s) interdite(s) : ${blockedCategories}`,
        'error',
        6000
      );

      // Log to service worker
      try {
        chrome.runtime?.sendMessage({
          type: 'GRID_BLOCKED',
          site: location.hostname,
          count: blockedDetections.length,
          categories: blockedDetections.reduce((acc, d) => {
            acc[d.category] = (acc[d.category] || 0) + 1;
            return acc;
          }, {}),
          source: 'paste'
        });
      } catch (e) { /* not critical */ }

      return; // DO NOT INSERT TEXT
    }

    // === Normal pseudonymization ===
    const inserted = adapterResult.adapter.insertText(adapterResult.element, result.processed);
    if (!inserted) {
      document.execCommand('insertText', false, result.processed);
    }

    // Toast : orange si Art.9, vert sinon
    const toastType = result.hasArt9 ? 'warning' : 'success';
    const title = result.hasArt9
      ? `DataMask - ${result.count} donnee(s) sensible(s) Art.9`
      : `DataMask - ${result.count} donnee(s) protegee(s)`;

    const categories = Object.entries(result.categoryCounts)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    showToast(title, categories, toastType);

    // Notify service worker + increment quota
    try {
      chrome.runtime?.sendMessage({
        type: 'GRID_PSEUDONYMIZATION',
        site: location.hostname,
        count: result.count,
        categories: result.categoryCounts,
        rgpd: result.rgpdCategories,
        hasArt9: result.hasArt9,
        source: 'paste'
      });
      chrome.runtime?.sendMessage({ type: 'GRID_INCREMENT_QUOTA', amount: result.count });
    } catch (e) { /* not critical */ }

  } catch (err) {
    console.error('[DataMask] Erreur traitement:', err);
    adapterResult.adapter.insertText(adapterResult.element, text);
    showToast('DataMask - Erreur', 'Texte colle sans protection', 'error', 3000);
  }
}

// === TYPING MONITOR (6.1) ===
// Detecte PII en temps reel pendant la frappe. Surligne visuellement, ne bloque PAS.

let typingTimeout = null;
let monitorBadge = null;

function initTypingMonitor() {
  document.addEventListener('input', onTypingInput, true);
}

function onTypingInput(event) {
  const adapterResult = selectAdapter();
  if (!adapterResult) return;

  const el = adapterResult.element;
  const target = event.target;
  if (!el.contains(target) && target !== el) return;

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    analyzeTyping(el);
  }, 300);
}

function analyzeTyping(element) {
  // Extract text from the editor
  let text = '';
  if (element.isContentEditable) {
    text = element.innerText || element.textContent || '';
  } else if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    text = element.value || '';
  }

  if (!text || text.trim().length < 5) {
    removeMonitorBadge();
    return;
  }

  // Detect only (no pseudonymization)
  const result = processText(text, { detectOnly: true, confidenceThreshold: 'medium' });

  if (result.count === 0) {
    removeMonitorBadge();
    return;
  }

  showMonitorBadge(element, result);
}

function showMonitorBadge(element, result) {
  if (!monitorBadge) {
    monitorBadge = document.createElement('div');
    monitorBadge.className = 'grid-monitor-badge';
    monitorBadge.style.cssText = `
      position: fixed;
      z-index: 2147483646;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
      user-select: none;
    `;
    monitorBadge.addEventListener('click', () => {
      if (monitorBadge._result) {
        const details = monitorBadge._result.detections
          .map(d => `${d.patternId}: "${d.match.substring(0, 20)}${d.match.length > 20 ? '...' : ''}"`)
          .join('\n');
        showToast(
          `${monitorBadge._result.count} donnee(s) sensible(s) detectee(s)`,
          details.substring(0, 120),
          'warning',
          6000
        );
      }
    });
    document.body.appendChild(monitorBadge);
  }

  // Position near the editor
  const rect = element.getBoundingClientRect();
  monitorBadge.style.top = Math.max(8, rect.top - 36) + 'px';
  monitorBadge.style.right = '24px';

  monitorBadge.textContent = `${result.count} donnee(s) sensible(s)`;
  monitorBadge._result = result;
  monitorBadge.style.display = 'block';
}

function removeMonitorBadge() {
  if (monitorBadge) {
    monitorBadge.style.display = 'none';
    monitorBadge._result = null;
  }
}

// Init
init();
