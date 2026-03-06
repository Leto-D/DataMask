// adapter-registry.js - Registre + selection automatique de l'adapter selon le site

import { ProseMirrorAdapter } from './adapter-prosemirror.js';
import { TextareaAdapter } from './adapter-textarea.js';
import { QuillAdapter } from './adapter-quill.js';
import { GenericAdapter } from './adapter-generic.js';

// Mapping domaine -> adapter prioritaire
const SITE_ADAPTERS = {
  'claude.ai': [ProseMirrorAdapter, GenericAdapter],
  'chatgpt.com': [ProseMirrorAdapter, GenericAdapter],
  'chat.deepseek.com': [TextareaAdapter, GenericAdapter],
  'gemini.google.com': [QuillAdapter, GenericAdapter],
  'copilot.microsoft.com': [TextareaAdapter, GenericAdapter],
  'perplexity.ai': [QuillAdapter, TextareaAdapter, GenericAdapter]
};

/**
 * Selectionne le meilleur adapter pour le site courant
 * @returns {{ adapter: Adapter, element: HTMLElement } | null}
 */
export function selectAdapter() {
  const hostname = location.hostname.replace('www.', '');
  const adapters = SITE_ADAPTERS[hostname] || [GenericAdapter];

  for (const Adapter of adapters) {
    if (Adapter.canHandle()) {
      const element = Adapter.getInputElement();
      if (element) {
        return { adapter: Adapter, element };
      }
    }
  }

  return null;
}

/**
 * Insere du texte via l'adapter adapte au site
 * @returns {boolean} true si l'insertion a reussi
 */
export function insertWithAdapter(text) {
  const result = selectAdapter();
  if (!result) return false;
  return result.adapter.insertText(result.element, text);
}
