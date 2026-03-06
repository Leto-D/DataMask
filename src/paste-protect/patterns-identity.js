// patterns-identity.js - Patterns de detection : noms (3 strategies), secu FR, dates de naissance
// Detection des noms : civilite+nom, contexte juridique+nom, heuristique prenom+nom

import { FIRSTNAMES } from './data-firstnames.js';
import { FALSE_POSITIVES } from './data-false-positives.js';

function validateSecuFR(match) {
  try {
    const clean = match.replace(/[ \t]/g, '');
    if (clean.length !== 15) return false;
    if (clean[0] !== '1' && clean[0] !== '2') return false;
    const month = parseInt(clean.substring(3, 5), 10);
    if (month < 1 || (month > 12 && month !== 20)) return false;
    const base = parseInt(clean.substring(0, 13), 10);
    const key = parseInt(clean.substring(13, 15), 10);
    return (97 - (base % 97)) === key;
  } catch (e) {
    return false;
  }
}

// Normalise un texte pour comparaison avec la liste de faux positifs
function normalize(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

// Verifie si un match de 2 mots est un faux positif institutionnel
function isFalsePositive(word1, word2) {
  const combined = normalize(word1 + ' ' + word2);
  return FALSE_POSITIVES.has(combined);
}

// Ajuste la confiance pour les noms heuristiques : boost si le premier mot est un prenom connu
function adjustNameConfidence(match) {
  const words = match.trim().split(/\s+/);
  if (words.length < 2) return 'low';
  const firstName = normalize(words[0]);
  if (FIRSTNAMES.has(firstName)) return 'medium';
  return 'low';
}

export const PATTERNS_IDENTITY = [
  // Strategie 1 : Civilite + Nom
  {
    id: 'NAME_CIVILITY',
    label: 'Nom avec civilite',
    category: 'identity',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /\b(?:M\.|Mr\.?|Mme\.?|Mlle\.?|Mrs\.?|Ms\.?|Dr\.?|Pr\.?|Prof\.?|Me\.?|Maitre|Docteur|Professeur)[ \t]+[A-Z][a-zA-ZÀ-ÿ\-]+(?:[ \t]+[A-Z][a-zA-ZÀ-ÿ\-]+)?\b/g,
    pseudonymPrefix: 'Nom',
    enabled: true
  },
  // Strategie 2 : Contexte juridique/professionnel + Nom
  {
    id: 'NAME_CONTEXT',
    label: 'Nom en contexte',
    category: 'identity',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /(?:(?:client|patient|salarie|employe|collaborateur|candidat|soussigne|beneficiaire|plaignant|defendeur|assure|titulaire|destinataire|expediteur|contact|responsable|signataire|mandate|mandataire|gerant|associe|dirigeant|nom|prenom)\s*(?::|=|est)\s*)([A-Z][a-zA-ZÀ-ÿ\-]+(?:[ \t]+[A-Z][a-zA-ZÀ-ÿ\-]+){0,2})/gi,
    pseudonymPrefix: 'Nom',
    captureGroup: 1,
    enabled: true
  },
  // Strategie 3 : Heuristique Prenom + Nom (2 mots capitalises consecutifs)
  {
    id: 'NAME_HEURISTIC',
    label: 'Nom probable (heuristique)',
    category: 'identity',
    rgpdCategory: 'art4',
    confidence: 'low',
    regex: /\b([A-Z][a-zA-ZÀ-ÿ]{3,})[ \t]+([A-Z][a-zA-ZÀ-ÿ\-]{3,})\b/g,
    pseudonymPrefix: 'Nom',
    confidenceAdjuster: adjustNameConfidence,
    falsePositiveChecker: isFalsePositive,
    enabled: true
  },
  // Numero de securite sociale francaise
  {
    id: 'SECU_FR',
    label: 'Securite sociale francaise',
    category: 'identity',
    rgpdCategory: 'art9',
    confidence: 'high',
    regex: /\b[12][ \t]?\d{2}[ \t]?\d{2}[ \t]?\d{2}[ \t]?\d{3}[ \t]?\d{3}[ \t]?\d{2}\b/g,
    validator: validateSecuFR,
    softValidation: true,
    pseudonymPrefix: 'Secu',
    enabled: true
  },
  // Date de naissance
  {
    id: 'DATE_NAISSANCE',
    label: 'Date de naissance',
    category: 'identity',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /\b(?:0[1-9]|[12]\d|3[01])[\/.\-](?:0[1-9]|1[0-2])[\/.\-](?:19|20)\d{2}\b/g,
    pseudonymPrefix: 'Date',
    enabled: true
  }
];
