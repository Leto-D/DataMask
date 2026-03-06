// engine.js - Moteur de pseudonymisation : table de correspondance + pseudonymes
// Inspire de PseudoShield (https://github.com/MaitreJV/pseudoshield)
// RAM uniquement — pas de persistence cross-session

let counters = {};

// Table volatile : pseudonyme -> original (pour depseudonymisation)
const volatileMap = new Map();

// Table persistee (session) : original normalise -> { pseudonym, category, rgpdCategory, firstSeen, count }
const persistedTable = new Map();

/**
 * Genere ou recupere un pseudonyme pour une donnee detectee
 * Deterministe : la meme valeur retourne toujours le meme pseudonyme dans la session
 */
export function getPseudonym(original, prefix, category, rgpdCategory) {
  const key = original.trim().toLowerCase();

  if (persistedTable.has(key)) {
    const entry = persistedTable.get(key);
    entry.count++;
    return entry.pseudonym;
  }

  if (!counters[prefix]) counters[prefix] = 0;
  counters[prefix]++;

  const pseudonym = prefix + '_' + counters[prefix];

  persistedTable.set(key, {
    pseudonym,
    category,
    rgpdCategory,
    firstSeen: new Date().toISOString(),
    count: 1
  });

  volatileMap.set(pseudonym, original);

  return pseudonym;
}

/**
 * Pseudonymise un texte a partir des detections
 * Remplace de la fin vers le debut pour conserver les positions
 */
export function pseudonymize(text, detections) {
  if (!detections || detections.length === 0) return { text, count: 0, detections: [] };

  let result = text;
  const processed = [];

  for (let i = detections.length - 1; i >= 0; i--) {
    const det = detections[i];
    const pseudonym = getPseudonym(det.match, det.pseudonymPrefix, det.category, det.rgpdCategory);

    result =
      result.substring(0, det.start) +
      '[' + pseudonym + ']' +
      result.substring(det.end);

    processed.unshift({ ...det, pseudonym });
  }

  return { text: result, count: detections.length, detections: processed };
}

/**
 * Recupere l'original a partir d'un pseudonyme
 */
export function revealOriginal(pseudonym) {
  return volatileMap.get(pseudonym) || null;
}

/**
 * Depseudonymise un texte en remplacant les [Prefix_N] par les originaux
 */
export function depseudonymize(text) {
  let result = text;
  for (const [pseudo, real] of volatileMap) {
    const token = '[' + pseudo + ']';
    while (result.includes(token)) {
      result = result.replace(token, real);
    }
  }
  return result;
}

/**
 * Retourne le registre des correspondances (sans exposer les originaux)
 */
export function getRegistry() {
  const entries = [];
  for (const [, entry] of persistedTable) {
    entries.push({
      pseudonym: entry.pseudonym,
      category: entry.category,
      rgpdCategory: entry.rgpdCategory,
      count: entry.count
    });
  }
  return entries;
}

/**
 * Retourne les stats de la table
 */
export function getStats() {
  const entries = [...persistedTable.values()];
  return {
    total: entries.length,
    byCategory: entries.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {}),
    byRgpd: entries.reduce((acc, e) => {
      acc[e.rgpdCategory] = (acc[e.rgpdCategory] || 0) + 1;
      return acc;
    }, { art4: 0, art9: 0 })
  };
}

/**
 * Reinitialise toute la table (session reset)
 */
export function reset() {
  counters = {};
  volatileMap.clear();
  persistedTable.clear();
}
