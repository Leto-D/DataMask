// dashboard.js - Vue stats + journal conformite + export
// Communique avec le service worker via chrome.runtime.sendMessage

import { t } from './i18n.js';

let currentJournal = [];

export function initDashboard() {
  // Refresh button
  document.getElementById('dashboard-refresh')?.addEventListener('click', loadDashboard);

  // Export JSON
  document.getElementById('dashboard-export-json')?.addEventListener('click', exportJSON);

  // Export CSV
  document.getElementById('dashboard-export-csv')?.addEventListener('click', exportCSV);

  // Purge
  document.getElementById('dashboard-purge')?.addEventListener('click', purgeAll);
}

export async function loadDashboard() {
  try {
    // Load stats
    const stats = await sendMessage({ type: 'GRID_GET_STATS' });
    renderStats(stats || {});

    // Load journal
    const journal = await sendMessage({ type: 'GRID_GET_JOURNAL', limit: 50 });
    currentJournal = journal || [];
    renderJournal(currentJournal);
  } catch (e) {
    console.error('[DataMask] Dashboard load error:', e);
  }
}

function sendMessage(msg) {
  return new Promise((resolve) => {
    if (!chrome.runtime?.sendMessage) {
      resolve(null);
      return;
    }
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response);
    });
  });
}

function renderStats(stats) {
  const totalEl = document.getElementById('dash-total');
  const blockedEl = document.getElementById('dash-blocked');
  const art9El = document.getElementById('dash-art9');
  const barsEl = document.getElementById('dash-bars');
  const sitesEl = document.getElementById('dash-sites');
  const categoriesEl = document.getElementById('dash-categories');

  if (totalEl) totalEl.textContent = stats.totalPseudonymizations || 0;
  if (blockedEl) blockedEl.textContent = stats.totalBlocked || 0;
  if (art9El) {
    const art9Count = stats.art9Events || 0;
    art9El.textContent = art9Count;
    art9El.style.color = art9Count > 0 ? '#d97706' : 'inherit';
  }

  // Mini bars 7 derniers jours
  if (barsEl) {
    const days = getLast7Days();
    const byDay = stats.byDay || {};
    const maxVal = Math.max(1, ...days.map(d => (byDay[d]?.pseudonymizations || 0) + (byDay[d]?.blocked || 0)));

    barsEl.innerHTML = '';
    days.forEach(day => {
      const data = byDay[day] || { pseudonymizations: 0, blocked: 0 };
      const total = data.pseudonymizations + data.blocked;
      const pct = Math.round((total / maxVal) * 100);
      const col = document.createElement('div');
      col.className = 'dash-bar-col';
      const bar = document.createElement('div');
      bar.className = 'dash-bar';
      bar.style.height = Math.max(2, pct) + '%';
      const label = document.createElement('span');
      label.className = 'dash-bar-label';
      label.textContent = day.substring(5);
      col.appendChild(bar);
      col.appendChild(label);
      barsEl.appendChild(col);
    });
  }

  // Sites
  if (sitesEl) {
    sitesEl.innerHTML = '';
    const bySite = stats.bySite || {};
    const entries = Object.entries(bySite).sort((a, b) => b[1].pseudonymizations - a[1].pseudonymizations);
    if (entries.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'dash-empty';
      empty.textContent = t('dash_no_data');
      sitesEl.appendChild(empty);
    } else {
      entries.forEach(([site, data]) => {
        const row = document.createElement('div');
        row.className = 'dash-row';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = site;
        const countSpan = document.createElement('span');
        countSpan.className = 'dash-count';
        countSpan.textContent = data.pseudonymizations;
        row.appendChild(nameSpan);
        row.appendChild(countSpan);
        sitesEl.appendChild(row);
      });
    }
  }

  // Categories
  if (categoriesEl) {
    categoriesEl.innerHTML = '';
    const byCat = stats.byCategory || {};
    const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'dash-empty';
      empty.textContent = t('dash_no_data');
      categoriesEl.appendChild(empty);
    } else {
      entries.forEach(([cat, count]) => {
        const row = document.createElement('div');
        row.className = 'dash-row';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = cat;
        const countSpan = document.createElement('span');
        countSpan.className = 'dash-count';
        countSpan.textContent = count;
        row.appendChild(nameSpan);
        row.appendChild(countSpan);
        categoriesEl.appendChild(row);
      });
    }
  }
}

function renderJournal(events) {
  const tbody = document.getElementById('dash-journal-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (events.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.textAlign = 'center';
    td.style.color = 'var(--color-text-secondary)';
    td.textContent = t('dash_no_data');
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  events.forEach(ev => {
    const tr = document.createElement('tr');
    const date = new Date(ev.timestamp);
    const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const tdTime = document.createElement('td');
    tdTime.textContent = timeStr;

    const tdSite = document.createElement('td');
    tdSite.textContent = ev.site || '-';

    const tdAction = document.createElement('td');
    if (ev.action === 'block') {
      const span = document.createElement('span');
      span.style.color = '#ef4444';
      span.textContent = 'Block';
      tdAction.appendChild(span);
      tdAction.appendChild(document.createTextNode(' (' + ev.count + ')'));
    } else {
      tdAction.textContent = 'Pseudo (' + ev.count + ')';
    }

    const tdCats = document.createElement('td');
    tdCats.textContent = ev.categories ? Object.keys(ev.categories).join(', ') : '-';

    tr.appendChild(tdTime);
    tr.appendChild(tdSite);
    tr.appendChild(tdAction);
    tr.appendChild(tdCats);
    tbody.appendChild(tr);
  });
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

async function exportJSON() {
  const events = await sendMessage({ type: 'GRID_EXPORT_JOURNAL' }) || [];
  downloadFile(JSON.stringify(events, null, 2), 'grid-journal.json', 'application/json');
}

async function exportCSV() {
  const events = await sendMessage({ type: 'GRID_EXPORT_JOURNAL' }) || [];
  const header = 'timestamp,site,action,count,categories,hasArt9\n';
  const rows = events.map(ev => {
    const cats = ev.categories ? Object.keys(ev.categories).join(';') : '';
    return `${ev.timestamp},${ev.site || ''},${ev.action},${ev.count},${cats},${ev.hasArt9 || false}`;
  }).join('\n');
  downloadFile(header + rows, 'grid-journal.csv', 'text/csv');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function purgeAll() {
  if (!confirm(t('dash_purge_confirm'))) return;
  await sendMessage({ type: 'GRID_PURGE_JOURNAL' });
  loadDashboard();
}
