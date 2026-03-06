// adapter-generic.js - Fallback adapter pour editeurs inconnus
// Utilise execCommand('insertText') comme dernier recours

export class GenericAdapter {
  static canHandle() {
    return true; // Fallback — accepte tout
  }

  static getInputElement() {
    // Chercher un contentEditable ou textarea focus
    const active = document.activeElement;
    if (active && (active.isContentEditable || active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
      return active;
    }
    return document.querySelector('[contenteditable="true"]') || document.querySelector('textarea');
  }

  static insertText(element, text) {
    if (!element) return false;

    if (element.isContentEditable) {
      document.execCommand('insertText', false, text);
      return true;
    }

    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      const start = element.selectionStart ?? element.value.length;
      const end = element.selectionEnd ?? element.value.length;
      element.value = element.value.slice(0, start) + text + element.value.slice(end);
      element.selectionStart = element.selectionEnd = start + text.length;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }

    return false;
  }
}
