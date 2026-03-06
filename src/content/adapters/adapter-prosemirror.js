// adapter-prosemirror.js - Adapter pour Claude.ai et ChatGPT (contentEditable ProseMirror)
// Ces sites utilisent un div[contenteditable] gere par ProseMirror

export class ProseMirrorAdapter {
  static SELECTORS = [
    // Claude.ai
    'div.ProseMirror[contenteditable="true"]',
    // ChatGPT
    'div#prompt-textarea[contenteditable="true"]',
    // Fallback ProseMirror generique
    '.ProseMirror[contenteditable="true"]'
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
    if (!element || !element.isContentEditable) return false;

    element.focus();

    // Selectionner tout le contenu existant si c'est un remplacement complet
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false); // Curseur a la fin
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // ProseMirror ecoute les InputEvents
    const inserted = document.execCommand('insertText', false, text);

    if (!inserted) {
      // Fallback : inserer via InputEvent directement
      const inputEvent = new InputEvent('beforeinput', {
        inputType: 'insertText',
        data: text,
        bubbles: true,
        cancelable: true,
        composed: true
      });
      element.dispatchEvent(inputEvent);
    }

    // Declencher un input event pour que le framework mette a jour
    element.dispatchEvent(new Event('input', { bubbles: true }));

    return true;
  }
}
