// DataMask Extension Service Worker
// Journal RGPD chiffre (IndexedDB + Web Crypto) + stats + alarms

// === CRYPTO ===

async function getEncryptionKey() {
  const { cryptoSecret } = await chrome.storage.local.get('cryptoSecret');
  let secret = cryptoSecret;
  if (!secret) {
    // Premier lancement : generer un secret aleatoire
    const buf = crypto.getRandomValues(new Uint8Array(32));
    secret = Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
    await chrome.storage.local.set({ cryptoSecret: secret });
  }
  // Deriver une cle AES-256-GCM via PBKDF2
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('grid-compliance-v2'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(data) {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)));
  return { iv: Array.from(iv), ct: Array.from(new Uint8Array(ciphertext)) };
}

async function decrypt(encrypted) {
  const key = await getEncryptionKey();
  const iv = new Uint8Array(encrypted.iv);
  const ct = new Uint8Array(encrypted.ct);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(plaintext));
}

// === INDEXEDDB ===

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('grid-compliance', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('events')) {
        const store = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function logEvent(eventData) {
  const encrypted = await encrypt(eventData);
  const record = { timestamp: Date.now(), data: encrypted };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('events', 'readwrite');
    tx.objectStore('events').add(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getEvents(limit = 50) {
  const db = await openDB();
  // Collect encrypted records first (sync cursor), then decrypt
  const records = await new Promise((resolve, reject) => {
    const tx = db.transaction('events', 'readonly');
    const store = tx.objectStore('events');
    const index = store.index('timestamp');
    const req = index.openCursor(null, 'prev');
    const raw = [];
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor && raw.length < limit) {
        raw.push(cursor.value);
        cursor.continue();
      } else {
        resolve(raw);
      }
    };
    req.onerror = () => reject(req.error);
  });
  // Decrypt outside the transaction
  const results = [];
  for (const record of records) {
    try {
      const decrypted = await decrypt(record.data);
      results.push({ id: record.id, ...decrypted });
    } catch (e) {
      // Skip corrupted entries
    }
  }
  return results;
}

async function purgeEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('events', 'readwrite');
    tx.objectStore('events').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function purgeExpiredEvents() {
  const { retentionDays = 30 } = await chrome.storage.local.get('retentionDays');
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('events', 'readwrite');
    const store = tx.objectStore('events');
    const index = store.index('timestamp');
    const range = IDBKeyRange.upperBound(cutoff);
    const req = index.openCursor(range);
    let deleted = 0;
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        cursor.delete();
        deleted++;
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve(deleted);
    tx.onerror = () => reject(tx.error);
  });
}

// === STATS ===

async function updateStats(event) {
  const { stats = {} } = await chrome.storage.local.get('stats');
  const today = new Date().toISOString().split('T')[0];

  if (!stats.totalPseudonymizations) stats.totalPseudonymizations = 0;
  if (!stats.totalBlocked) stats.totalBlocked = 0;
  if (!stats.byDay) stats.byDay = {};
  if (!stats.bySite) stats.bySite = {};
  if (!stats.byCategory) stats.byCategory = {};
  if (!stats.art9Events) stats.art9Events = 0;
  if (!stats.byDay[today]) stats.byDay[today] = { pseudonymizations: 0, blocked: 0 };

  if (event.action === 'pseudonymize') {
    stats.totalPseudonymizations += event.count;
    stats.byDay[today].pseudonymizations += event.count;
  } else if (event.action === 'block') {
    stats.totalBlocked += event.count;
    stats.byDay[today].blocked += event.count;
  }

  if (event.site) {
    if (!stats.bySite[event.site]) stats.bySite[event.site] = { pseudonymizations: 0 };
    stats.bySite[event.site].pseudonymizations += event.count;
  }

  if (event.categories) {
    for (const [cat, count] of Object.entries(event.categories)) {
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + count;
    }
  }

  if (event.hasArt9) stats.art9Events++;

  stats.lastActive = Date.now();

  // Cleanup old days (keep 90 days max)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];
  for (const day of Object.keys(stats.byDay)) {
    if (day < cutoffStr) delete stats.byDay[day];
  }

  await chrome.storage.local.set({ stats });
}

// === QUOTA & FEATURE GATING ===

async function checkQuota() {
  return { allowed: true, remaining: Infinity, count: 0, plan: 'pro' };
}

async function incrementQuota(amount = 1) {
  const today = new Date().toISOString().split('T')[0];
  const { dailyCount = {} } = await chrome.storage.local.get('dailyCount');
  // Clean old days
  const cleaned = {};
  cleaned[today] = (dailyCount[today] || 0) + amount;
  await chrome.storage.local.set({ dailyCount: cleaned });
}

async function getFeatureAccess() {
  return {
    plan: 'pro',
    unlimitedPseudonymizations: true,
    allSites: true,
    typingMonitor: true,
    complianceLog: true,
    dashboard: true,
    advancedPatterns: true,
    blacklistCustom: true,
    art9Warnings: true,
    basicPatterns: true
  };
}

async function isSiteAllowed() {
  return true;
}

// === MESSAGE HANDLER ===

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GRID_PSEUDONYMIZATION') {
    const event = {
      timestamp: Date.now(),
      site: message.site,
      action: 'pseudonymize',
      source: message.source || 'paste',
      count: message.count,
      categories: message.categories,
      rgpd: message.rgpd,
      hasArt9: message.hasArt9
    };

    Promise.all([
      logEvent(event),
      updateStats(event)
    ]).then(() => sendResponse({ ok: true }))
      .catch(err => sendResponse({ ok: false, error: err.message }));

    return true; // async response
  }

  if (message.type === 'GRID_BLOCKED') {
    const event = {
      timestamp: Date.now(),
      site: message.site,
      action: 'block',
      source: message.source || 'paste',
      count: message.count,
      categories: message.categories
    };

    Promise.all([
      logEvent(event),
      updateStats(event)
    ]).then(() => sendResponse({ ok: true }))
      .catch(err => sendResponse({ ok: false, error: err.message }));

    return true;
  }

  if (message.type === 'GRID_GET_STATS') {
    chrome.storage.local.get('stats').then(({ stats = {} }) => {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      let monthTotal = 0;
      if (stats.byDay) {
        for (const [day, data] of Object.entries(stats.byDay)) {
          if (day.startsWith(monthKey)) {
            monthTotal += (data.pseudonymizations || 0);
          }
        }
      }
      const todayData = stats.byDay?.[today] || {};
      sendResponse({
        total: stats.totalPseudonymizations || 0,
        month: monthTotal,
        today: (todayData.pseudonymizations || 0),
        totalBlocked: stats.totalBlocked || 0,
        art9Events: stats.art9Events || 0,
        byDay: stats.byDay || {},
        bySite: stats.bySite || {},
        byCategory: stats.byCategory || {}
      });
    });
    return true;
  }

  if (message.type === 'GRID_GET_JOURNAL') {
    getEvents(message.limit || 50).then(events => {
      sendResponse(events);
    }).catch(() => sendResponse([]));
    return true;
  }

  if (message.type === 'GRID_PURGE_JOURNAL') {
    purgeEvents().then(() => {
      chrome.storage.local.set({ stats: {} });
      sendResponse({ ok: true });
    }).catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === 'GRID_EXPORT_JOURNAL') {
    getEvents(9999).then(events => {
      if (message.format === 'csv') {
        const header = 'timestamp,site,action,source,count,categories,hasArt9';
        const rows = events.map(e => {
          const ts = e.timestamp ? new Date(e.timestamp).toISOString() : '';
          const cats = e.categories ? Object.entries(e.categories).map(([k, v]) => `${k}:${v}`).join(';') : '';
          return `${ts},${e.site || ''},${e.action || ''},${e.source || ''},${e.count || 0},"${cats}",${e.hasArt9 || false}`;
        });
        sendResponse(header + '\n' + rows.join('\n'));
      } else {
        sendResponse(events);
      }
    }).catch(() => sendResponse(message.format === 'csv' ? '' : []));
    return true;
  }

  if (message.type === 'GRID_CHECK_QUOTA') {
    checkQuota().then(async (quota) => {
      const siteAllowed = await isSiteAllowed(message.site || '', quota.plan);
      sendResponse({ ...quota, siteAllowed });
    });
    return true;
  }

  if (message.type === 'GRID_INCREMENT_QUOTA') {
    incrementQuota(message.amount || 1).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message.type === 'GRID_GET_FEATURES') {
    getFeatureAccess().then(features => sendResponse(features));
    return true;
  }

  if (message.type === 'GRID_ADD_CUSTOM_SITE') {
    (async () => {
      const { plan = 'free' } = await chrome.storage.local.get('plan');
      const { customSites = [] } = await chrome.storage.local.get('customSites');
      const site = (message.site || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!site) return sendResponse({ ok: false, error: 'empty' });
      if (customSites.includes(site)) return sendResponse({ ok: false, error: 'duplicate' });
      customSites.push(site);
      await chrome.storage.local.set({ customSites });
      sendResponse({ ok: true, customSites });
    })();
    return true;
  }

  if (message.type === 'GRID_REMOVE_CUSTOM_SITE') {
    (async () => {
      const { customSites = [] } = await chrome.storage.local.get('customSites');
      const site = (message.site || '').trim().toLowerCase();
      const updated = customSites.filter(s => s !== site);
      await chrome.storage.local.set({ customSites: updated });
      sendResponse({ ok: true, customSites: updated });
    })();
    return true;
  }

  if (message.type === 'GRID_GET_CUSTOM_SITES') {
    (async () => {
      const { customSites = [] } = await chrome.storage.local.get('customSites');
      const { plan = 'free' } = await chrome.storage.local.get('plan');
      sendResponse({ customSites, limit: Infinity, plan });
    })();
    return true;
  }

  if (message.type === 'GRID_GET_QUOTA_DISPLAY') {
    checkQuota().then(quota => sendResponse(quota));
    return true;
  }

  if (message.type === 'GRID_PROMPT_GENERATED') {
    // Store the generated prompt so the popup can retrieve it when reopened
    chrome.storage.session.set({
      lastGeneratedPrompt: {
        prompt: message.prompt,
        score: message.score,
        timestamp: Date.now()
      }
    }).then(() => sendResponse({ ok: true }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === 'GRID_GET_LAST_PROMPT') {
    chrome.storage.session.get('lastGeneratedPrompt').then(({ lastGeneratedPrompt }) => {
      sendResponse(lastGeneratedPrompt || null);
    }).catch(() => sendResponse(null));
    return true;
  }
});

// === ALARMS ===

chrome.runtime.onInstalled.addListener(() => {
  console.log('DataMask Extension installed');

  // Init default blacklist
  chrome.storage.local.get('blacklist').then(({ blacklist }) => {
    if (!blacklist) {
      chrome.storage.local.set({
        blacklist: { categories: ['SECU_FR', 'CARD', 'API_KEY'], customPatterns: [] }
      });
    }
  });

  // Init PasteProtect enabled by default
  chrome.storage.local.get('pasteProtectEnabled').then(({ pasteProtectEnabled }) => {
    if (pasteProtectEnabled === undefined) {
      chrome.storage.local.set({ pasteProtectEnabled: true });
    }
  });

  // Create daily cleanup alarm
  chrome.alarms.create('grid-cleanup', { periodInMinutes: 1440 }); // 24h
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'grid-cleanup') {
    purgeExpiredEvents().then(deleted => {
      if (deleted > 0) console.log(`[DataMask] Purged ${deleted} expired events`);
    });
  }
});
