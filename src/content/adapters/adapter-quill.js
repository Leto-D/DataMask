// adapter-quill.js - Adapter pour Gemini et Perplexity (editeur Quill / contentEditable custom)

export class QuillAdapter {
  static SELECTORS = [
    // Gemini
    'div.ql-editor[contenteditable="true"]',
    '.input-area [contenteditable="true"]',
    'rich-textarea [contenteditable="true"]',
    // Perplexity
    'div[contenteditable="true"][role="textbox"]',
    'textarea[placeholder]' // Perplexity fallback
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
    if (!element) return false;

    element.focus();

    // Si c'est un textarea (Perplexity fallback)
    if (element.tagName === 'TEXTAREA') {
      const start = element.selectionStart ?? element.value.length;
      const end = element.selectionEnd ?? element.value.length;
      element.value = element.value.slice(0, start) + text + element.value.slice(end);
      element.selectionStart = element.selectionEnd = start + text.length;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }

    // ContentEditable (Quill / Gemini)
    if (element.isContentEditable) {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const inserted = document.execCommand('insertText', false, text);

      if (!inserted) {
        // Fallback : creer un textNode
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      element.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }

    return false;
  }
}
