// toast.js - Notification toast sur les sites IA
// Design aligné sur le design system DataMask (Amber Mono)

let containerEl = null;
let styleInjected = false;

function injectStyles() {
  if (styleInjected) return;
  styleInjected = true;

  const style = document.createElement('style');
  style.textContent = `
.grid-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  pointer-events: none;
}
.grid-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 4px;
  color: #F8FAFC;
  max-width: 360px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(12px);
  animation: grid-toast-in 0.25s ease-out forwards;
  margin-top: 8px;
  border-left: 3px solid;
}
.grid-toast.grid-toast-out {
  animation: grid-toast-out 0.2s ease-in forwards;
}
.grid-toast-success {
  background: #1E293B;
  border-left-color: #059669;
}
.grid-toast-warning {
  background: #1E293B;
  border-left-color: #D97706;
}
.grid-toast-error {
  background: #1E293B;
  border-left-color: #DC2626;
}
.grid-toast-info {
  background: #1E293B;
  border-left-color: #D97706;
}
.grid-toast-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.grid-toast-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}
.grid-toast-text { flex: 1; line-height: 1.4; }
.grid-toast-title { font-weight: 600; font-size: 12px; margin-bottom: 1px; }
.grid-toast-detail { font-size: 11px; opacity: 0.7; }
@keyframes grid-toast-in { to { opacity: 1; transform: translateY(0); } }
@keyframes grid-toast-out { to { opacity: 0; transform: translateY(-8px); } }
`;
  document.head.appendChild(style);
}

function getContainer() {
  if (containerEl && document.body.contains(containerEl)) return containerEl;
  containerEl = document.createElement('div');
  containerEl.className = 'grid-toast-container';
  document.body.appendChild(containerEl);
  return containerEl;
}

// SVG icons instead of emojis — minimal, monochrome
const ICON_SVGS = {
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

/**
 * Affiche un toast sur le site IA
 * @param {string} title - Titre du toast
 * @param {string} [detail] - Detail optionnel
 * @param {'success'|'warning'|'error'|'info'} [type='success']
 * @param {number} [duration=4000] - Duree en ms
 */
export function showToast(title, detail, type = 'success', duration = 4000) {
  injectStyles();
  const container = getContainer();

  const toast = document.createElement('div');
  toast.className = `grid-toast grid-toast-${type}`;

  const icon = document.createElement('span');
  icon.className = 'grid-toast-icon';
  icon.innerHTML = ICON_SVGS[type] || ICON_SVGS.info;

  const textWrap = document.createElement('div');
  textWrap.className = 'grid-toast-text';

  const titleEl = document.createElement('div');
  titleEl.className = 'grid-toast-title';
  titleEl.textContent = title;
  textWrap.appendChild(titleEl);

  if (detail) {
    const detailEl = document.createElement('div');
    detailEl.className = 'grid-toast-detail';
    detailEl.textContent = detail;
    textWrap.appendChild(detailEl);
  }

  toast.appendChild(icon);
  toast.appendChild(textWrap);
  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add('grid-toast-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
