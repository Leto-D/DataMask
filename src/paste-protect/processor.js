// processor.js - Pipeline principal : texte -> detection -> pseudonymisation -> resultat
// Point d'entree unique pour le traitement PasteProtect

import { detect, countByRgpdCategory, countByCategory } from './detector.js';
import * as Engine from './engine.js';

/**
 * Traite un texte : detection + pseudonymisation
 * @param {string} text - Texte a analyser
 * @param {Object} [options]
 * @param {string[]} [options.enabledPatterns] - IDs des patterns a utiliser
 * @param {string} [options.confidenceThreshold] - Seuil minimum ('high', 'medium', 'low')
 * @param {boolean} [options.detectOnly] - Si true, ne pseudonymise pas (mode preview)
 * @returns {ProcessResult}
 */
export function process(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return {
      original: text || '',
      processed: text || '',
      detections: [],
      count: 0,
      rgpdCategories: { art4: 0, art9: 0 },
      categoryCounts: {},
      hasArt9: false,
      processingTimeMs: 0
    };
  }

  const startTime = performance.now();

  // Detection
  const detections = detect(text, {
    enabledPatterns: options.enabledPatterns,
    enabledCategories: options.enabledCategories,
    confidenceThreshold: options.confidenceThreshold
  });

  if (detections.length === 0) {
    return {
      original: text,
      processed: text,
      detections: [],
      count: 0,
      rgpdCategories: { art4: 0, art9: 0 },
      categoryCounts: {},
      hasArt9: false,
      processingTimeMs: performance.now() - startTime
    };
  }

  // Stats
  const rgpdCategories = countByRgpdCategory(detections);
  const categoryCounts = countByCategory(detections);
  const hasArt9 = rgpdCategories.art9 > 0;

  // Mode detect-only (pour typing-monitor)
  if (options.detectOnly) {
    return {
      original: text,
      processed: text,
      detections,
      count: detections.length,
      rgpdCategories,
      categoryCounts,
      hasArt9,
      processingTimeMs: performance.now() - startTime
    };
  }

  // Pseudonymisation
  const result = Engine.pseudonymize(text, detections);

  return {
    original: text,
    processed: result.text,
    detections: result.detections,
    count: result.count,
    rgpdCategories,
    categoryCounts,
    hasArt9,
    processingTimeMs: performance.now() - startTime
  };
}

// Re-export des fonctions utilitaires de l'engine
export const revealOriginal = Engine.revealOriginal;
export const depseudonymize = Engine.depseudonymize;
export const getRegistry = Engine.getRegistry;
export const getStats = Engine.getStats;
export const reset = Engine.reset;
