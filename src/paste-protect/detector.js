// detector.js - Orchestrateur de detection : charge les 4 fichiers patterns, detect(), resolveOverlaps()
// Inspire de PseudoShield (https://github.com/MaitreJV/pseudoshield)

import { PATTERNS_CONTACT } from './patterns-contact.js';
import { PATTERNS_FINANCIAL } from './patterns-financial.js';
import { PATTERNS_IDENTITY } from './patterns-identity.js';
import { PATTERNS_TECHNICAL } from './patterns-technical.js';

const CONFIDENCE_LEVELS = { high: 3, medium: 2, low: 1 };

const ALL_PATTERNS = [
  ...PATTERNS_CONTACT,
  ...PATTERNS_FINANCIAL,
  ...PATTERNS_IDENTITY,
  ...PATTERNS_TECHNICAL
];

/**
 * Detecte toutes les donnees personnelles dans un texte
 * @param {string} text - Texte a analyser
 * @param {Object} [options]
 * @param {string[]} [options.enabledPatterns] - IDs des patterns a utiliser (tous par defaut)
 * @param {string} [options.confidenceThreshold] - Seuil minimum ('high', 'medium', 'low')
 * @returns {Detection[]} Liste des detections triees par position, sans chevauchement
 */
export function detect(text, options = {}) {
  if (!text || typeof text !== 'string') return [];

  const enabledPatterns = ALL_PATTERNS.filter(p => {
    if (!p.enabled) return false;
    if (options.enabledPatterns && !options.enabledPatterns.includes(p.id)) return false;
    if (options.enabledCategories && !options.enabledCategories.includes(p.category)) return false;
    return true;
  });

  const detections = [];

  for (const pattern of enabledPatterns) {
    const flags = pattern.captureGroup && !pattern.regex.flags.includes('d')
      ? pattern.regex.flags + 'd'
      : pattern.regex.flags;
    const regex = new RegExp(pattern.regex.source, flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Extraire le texte pertinent (captureGroup ou match complet)
      const capturedText = pattern.captureGroup ? match[pattern.captureGroup] : match[0];
      let capturedStart;
      if (pattern.captureGroup && match.indices) {
        capturedStart = match.indices[pattern.captureGroup][0];
      } else if (pattern.captureGroup) {
        capturedStart = match.index + match[0].lastIndexOf(capturedText);
      } else {
        capturedStart = match.index;
      }

      if (!capturedText) continue;

      let confidence = pattern.confidence;

      // Validation mathematique (Luhn, IBAN mod97, Secu FR)
      if (pattern.validator && !pattern.validator(capturedText)) {
        if (pattern.softValidation) {
          confidence = 'medium';
        } else {
          continue;
        }
      }

      // Verification faux positifs (pour NAME_HEURISTIC)
      if (pattern.falsePositiveChecker) {
        const words = capturedText.trim().split(/\s+/);
        if (words.length >= 2 && pattern.falsePositiveChecker(words[0], words[1])) {
          continue;
        }
      }

      // Ajustement confiance (boost prenom connu)
      if (pattern.confidenceAdjuster) {
        confidence = pattern.confidenceAdjuster(capturedText);
      }

      detections.push({
        patternId: pattern.id,
        match: capturedText,
        start: capturedStart,
        end: capturedStart + capturedText.length,
        category: pattern.category,
        rgpdCategory: pattern.rgpdCategory,
        confidence,
        pseudonymPrefix: pattern.pseudonymPrefix
      });
    }
  }

  // Filtrer par seuil de confiance
  const threshold = options.confidenceThreshold || 'low';
  const thresholdScore = CONFIDENCE_LEVELS[threshold] || 1;
  const filtered = detections.filter(d =>
    (CONFIDENCE_LEVELS[d.confidence] || 0) >= thresholdScore
  );

  filtered.sort((a, b) => a.start - b.start);

  return resolveOverlaps(filtered);
}

/**
 * Resout les chevauchements entre detections
 * Priorite : confiance haute > longueur du match > position
 */
function resolveOverlaps(detections) {
  if (detections.length <= 1) return detections;

  const resolved = [detections[0]];

  for (let i = 1; i < detections.length; i++) {
    const current = detections[i];
    const last = resolved[resolved.length - 1];

    if (current.start >= last.end) {
      resolved.push(current);
      continue;
    }

    // Chevauchement : garder le plus fiable ou le plus long
    const lastScore = CONFIDENCE_LEVELS[last.confidence] || 0;
    const currentScore = CONFIDENCE_LEVELS[current.confidence] || 0;

    if (currentScore > lastScore ||
        (currentScore === lastScore && (current.end - current.start) > (last.end - last.start))) {
      resolved[resolved.length - 1] = current;
    }
  }

  return resolved;
}

/**
 * Compte les detections par categorie RGPD
 */
export function countByRgpdCategory(detections) {
  return detections.reduce((acc, d) => {
    if (d.rgpdCategory === 'art9') acc.art9++;
    else acc.art4++;
    return acc;
  }, { art4: 0, art9: 0 });
}

/**
 * Compte les detections par categorie fonctionnelle
 */
export function countByCategory(detections) {
  return detections.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Retourne tous les patterns disponibles
 */
export function getPatterns() {
  return ALL_PATTERNS;
}
