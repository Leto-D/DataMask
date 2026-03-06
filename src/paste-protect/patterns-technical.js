// patterns-technical.js - Patterns de detection : IP, cles API, GPS, URLs PII

function validatePublicIPv4(match) {
  const parts = match.split('.').map(Number);
  if (parts[0] === 10) return false;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
  if (parts[0] === 192 && parts[1] === 168) return false;
  if (parts[0] === 127) return false;
  if (parts[0] === 0) return false;
  if (parts[0] === 169 && parts[1] === 254) return false;
  return true;
}

export const PATTERNS_TECHNICAL = [
  {
    id: 'IPV4',
    label: 'Adresse IPv4',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
    validator: validatePublicIPv4,
    pseudonymPrefix: 'IP',
    enabled: true
  },
  {
    id: 'IPV6',
    label: 'Adresse IPv6',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    pseudonymPrefix: 'IP',
    enabled: true
  },
  {
    id: 'API_KEY',
    label: 'Cle API',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /\b(?:sk-[a-zA-Z0-9]{20,}|sk-proj-[a-zA-Z0-9\-_]{40,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|glpat-[a-zA-Z0-9\-_]{20,}|xox[bpsa]-[a-zA-Z0-9\-]{10,})\b/g,
    pseudonymPrefix: 'ApiKey',
    enabled: true
  },
  {
    id: 'PRIVATE_KEY',
    label: 'Cle privee',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'high',
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]{1,5000}?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    pseudonymPrefix: 'Key',
    enabled: true
  },
  {
    id: 'GPS_COORD',
    label: 'Coordonnees GPS',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /\b-?(?:[1-8]?\d(?:\.\d{4,})|90(?:\.0+)?)\s*[,;]\s*-?(?:1[0-7]\d|0?\d{1,2})(?:\.\d{4,})\b/g,
    pseudonymPrefix: 'GPS',
    enabled: true
  },
  {
    id: 'URL_PII',
    label: 'URL avec donnees personnelles',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /https?:\/\/[^\s]{1,200}[?&](?:email|user(?:name|_?id)?|name|phone|ssn|token|api_?key|password|secret)=[^\s&]{1,200}/gi,
    pseudonymPrefix: 'URL',
    enabled: true
  },
  {
    id: 'MAC_ADDRESS',
    label: 'Adresse MAC',
    category: 'technical',
    rgpdCategory: 'art4',
    confidence: 'medium',
    regex: /\b(?:[0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}\b/g,
    pseudonymPrefix: 'MAC',
    enabled: true
  }
];
