// patterns-contact.js - Patterns de detection : emails, telephones, handles sociaux

export const PATTERNS_CONTACT = [
  {
    id: 'EMAIL',
    label: 'Adresse email',
    category: 'contact',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g,
    pseudonymPrefix: 'Email',
    enabled: true
  },
  {
    id: 'TEL_FR',
    label: 'Telephone francais',
    category: 'contact',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /(?:\+33|0033)[\s.]?\(?\d{1}\)?[\s./\-]?\d{2}[\s./\-]?\d{2}[\s./\-]?\d{2}[\s./\-]?\d{2}\b/g,
    pseudonymPrefix: 'Tel',
    enabled: true
  },
  {
    id: 'TEL_FR_LOCAL',
    label: 'Telephone francais (local)',
    category: 'contact',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b0[1-9][\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}\b/g,
    pseudonymPrefix: 'Tel',
    enabled: true
  },
  {
    id: 'TEL_BE',
    label: 'Telephone belge',
    category: 'contact',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /(?:\+32|0032)[\s.]?\(?\d{1,2}\)?[\s./\-]?\d{2,3}[\s./\-]?\d{2}[\s./\-]?\d{2}\b/g,
    pseudonymPrefix: 'Tel',
    enabled: true
  },
  {
    id: 'TEL_INT',
    label: 'Telephone international',
    category: 'contact',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /\+\d{1,3}[\s.\-]?\(?\d{1,4}\)?[\s.\-]?\d{2,4}[\s.\-]?\d{2,4}[\s.\-]?\d{2,4}\b/g,
    pseudonymPrefix: 'Tel',
    enabled: true
  },
  {
    id: 'SOCIAL_HANDLE',
    label: 'Handle reseau social',
    category: 'contact',
    rgpdCategory: 'art4',
    confidence: 'low',
    regex: /(?<=^|[\s(])@[a-zA-Z_]\w{2,29}\b/g,
    pseudonymPrefix: 'Social',
    enabled: true
  }
];
