// adapter-textarea.js - Adapter pour DeepSeek et Copilot (textarea natif + setter React)
// Ces sites utilisent un <textarea> standard, parfois controle par React

export class TextareaAdapter {
  static SELECTORS = [
    // DeepSeek
    'textarea#chat-input',
    'textarea[data-testid="chat-input"]',
    // Copilot
    'textarea[name="searchbox"]',
    'textarea#searchbox',
    // Fallback textarea
    'textarea'
  ];

  static canHandle() {
    return !!this.getInputElement();
  }

  static getInputElement() {
    for (const sel of this.SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  static insertText(element, text) {
    if (!element || (element.tagName !== 'TEXTAREA' && element.tagName !== 'INPUT')) return false;

    element.focus();

    const start = element.selectionStart ?? element.value.length;
    const end = element.selectionEnd ?? element.value.length;
    const newValue = element.value.slice(0, start) + text + element.value.slice(end);

    // Utiliser le setter natif pour bypasser le controle React
    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype, 'value'
    )?.set || Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype, 'value'
    )?.set;

    if (nativeSetter) {
      nativeSetter.call(element, newValue);
    } else {
      element.value = newValue;
    }

    element.selectionStart = element.selectionEnd = start + text.length;

    // Declencher les events React
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  }
}
