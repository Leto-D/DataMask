// patterns-financial.js - Patterns de detection : IBAN (7 pays), CB (Luhn), TVA

function validateLuhn(match) {
  try {
    const clean = match.replace(/[\s\-]/g, '');
    if (!/^\d{13,19}$/.test(clean)) return false;
    let sum = 0;
    let alt = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let n = parseInt(clean[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  } catch (e) {
    return false;
  }
}

function validateIBAN(match) {
  try {
    const clean = match.replace(/[\s.\-]/g, '').toUpperCase();
    if (clean.length < 15 || clean.length > 34) return false;
    const rearranged = clean.substring(4) + clean.substring(0, 4);
    let numStr = '';
    for (const char of rearranged) {
      if (char >= 'A' && char <= 'Z') {
        numStr += (char.charCodeAt(0) - 55).toString();
      } else {
        numStr += char;
      }
    }
    const remainder = BigInt(numStr) % 97n;
    return remainder === 1n;
  } catch (e) {
    return false;
  }
}

export const PATTERNS_FINANCIAL = [
  {
    id: 'IBAN_FR',
    label: 'IBAN francais',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bFR\d{2}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{3}\b/gi,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'IBAN_BE',
    label: 'IBAN belge',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bBE\d{2}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}\b/gi,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'IBAN_DE',
    label: 'IBAN allemand',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bDE\d{2}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{2}\b/gi,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'IBAN_LU',
    label: 'IBAN luxembourgeois',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bLU\d{2}[\s.\-]?\d{3}[\s.\-]?\d{13}\b/gi,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'IBAN_CH',
    label: 'IBAN suisse',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bCH\d{2}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{1}\b/gi,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'IBAN_NL',
    label: 'IBAN neerlandais',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bNL\d{2}[\s.\-]?[A-Z]{4}[\s.\-]?\d{4}[\s.\-]?\d{4}[\s.\-]?\d{2}\b/gi,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'IBAN_GENERIC',
    label: 'IBAN generique',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}(?:[\s]?[\dA-Z]{4}){2,7}(?:[\s]?[\dA-Z]{1,4})?\b/g,
    validator: validateIBAN,
    pseudonymPrefix: 'IBAN',
    enabled: true
  },
  {
    id: 'CARD',
    label: 'Carte bancaire',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b(?:4\d{3}|5[1-5]\d{2}|3[47]\d{2})[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{1,4}\b/g,
    validator: validateLuhn,
    pseudonymPrefix: 'CB',
    enabled: true
  },
  {
    id: 'TVA_FR',
    label: 'Numero TVA francais',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bFR[\s]?\d{2}[\s]?\d{3}[\s]?\d{3}[\s]?\d{3}\b/gi,
    pseudonymPrefix: 'TVA',
    enabled: true
  },
  {
    id: 'TVA_BE',
    label: 'Numero TVA belge',
    category: 'financial',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\bBE[\s]?0?\d{3}[\s.]?\d{3}[\s.]?\d{3}\b/gi,
    pseudonymPrefix: 'TVA',
    enabled: true
  }
];
