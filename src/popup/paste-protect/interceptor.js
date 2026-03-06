// interceptor.js - Interception du collage + pseudonymisation dans le popup DataMask
// Utilise le nouveau moteur partage src/paste-protect/

import { process as processText } from '../../paste-protect/processor.js';
import { reset, getRegistry, getStats, depseudonymize, revealOriginal } from '../../paste-protect/processor.js';

export class PasteProtect {
  constructor(onNotify) {
    this.onNotify = onNotify || (() => {});
    this.enabled = true;
    this._handler = this.handlePaste.bind(this);
  }

  attach() {
    document.addEventListener('paste', this._handler, true);
  }

  detach() {
    document.removeEventListener('paste', this._handler, true);
  }

  toggle(on) {
    this.enabled = on;
  }

  handlePaste(event) {
    const target = event.target;

    // Ne proteger que les champs du formulaire GRID
    const isFormField = target && (
      target.classList.contains('form-input') ||
      target.classList.contains('form-textarea') ||
      target.tagName === 'TEXTAREA' ||
      (target.tagName === 'INPUT' && target.type !== 'checkbox')
    );

    if (!isFormField) return;

    // Extraire le texte AVANT tout — synchrone
    const text = event.clipboardData?.getData('text/plain');
    if (!text || text.trim().length === 0) return;

    // preventDefault SYNCHRONE — fail-closed dans le popup
    event.preventDefault();
    event.stopImmediatePropagation();

    // Si desactive, reinserer tel quel
    if (!this.enabled) {
      this.insertAtCursor(target, text);
      return;
    }

    try {
      const result = processText(text);

      if (result.count === 0) {
        this.insertAtCursor(target, text);
        return;
      }

      // Inserer le texte pseudonymise
      this.insertAtCursor(target, result.processed);

      // Notifier
      this.onNotify({
        count: result.count,
        rgpdCategories: result.rgpdCategories,
        categoryCounts: result.categoryCounts,
        hasArt9: result.hasArt9,
        processingTimeMs: result.processingTimeMs,
        error: false
      });

    } catch (err) {
      // Fail-closed : rien n'est colle en cas d'erreur
      console.error('[PasteProtect] Erreur traitement:', err);
      this.onNotify({
        count: 0,
        error: true,
        message: 'PasteProtect: erreur, collage bloque'
      });
    }
  }

  insertAtCursor(el, text) {
    if (el.tagName === 'SELECT') return;

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    el.value = before + text + after;
    el.selectionStart = el.selectionEnd = start + text.length;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  getEngine() {
    return { reset, getRegistry, getStats, depseudonymize, revealOriginal };
  }
}
