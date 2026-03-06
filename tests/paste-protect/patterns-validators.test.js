import { describe, it, expect } from 'vitest';
import { detect } from '../../src/paste-protect/detector.js';

// Test validators indirectly through detect()

describe('IBAN Validator (BigInt mod-97)', () => {
  // Valid IBANs from public test data
  const validIBANs = [
    'FR7630006000011234567890189',    // France
    'BE68539007547034',                // Belgium
    'DE89370400440532013000',          // Germany
    'NL91ABNA0417164300',              // Netherlands
    'CH9300762011623852957',           // Switzerland
  ];

  for (const iban of validIBANs) {
    it(`accepts valid IBAN: ${iban}`, () => {
      const result = detect(`IBAN: ${iban}`);
      const ibanResult = result.filter(d => d.patternId.startsWith('IBAN'));
      expect(ibanResult.length).toBeGreaterThan(0);
    });
  }

  it('rejects IBAN with wrong checksum', () => {
    const result = detect('IBAN: FR0030006000011234567890189');
    const ibanResult = result.filter(d => d.patternId.startsWith('IBAN'));
    expect(ibanResult.length).toBe(0);
  });

  it('handles IBAN with spaces', () => {
    const result = detect('IBAN: FR76 3000 6000 0112 3456 7890 189');
    const ibanResult = result.filter(d => d.patternId.startsWith('IBAN'));
    expect(ibanResult.length).toBeGreaterThan(0);
  });
});

describe('Luhn Validator (Credit Cards)', () => {
  const validCards = [
    '4532015112830366',   // Visa
    '5425233430109903',   // Mastercard
    '4916338506082832',   // Visa
  ];

  for (const card of validCards) {
    it(`accepts valid card: ${card}`, () => {
      const result = detect(`CB: ${card}`);
      const cardResult = result.filter(d => d.patternId === 'CARD');
      expect(cardResult.length).toBe(1);
    });
  }

  it('rejects card with wrong Luhn checksum', () => {
    const result = detect('CB: 4532015112830361');
    const cardResult = result.filter(d => d.patternId === 'CARD');
    expect(cardResult.length).toBe(0);
  });

  it('accepts card with spaces', () => {
    const result = detect('CB: 4532 0151 1283 0366');
    const cardResult = result.filter(d => d.patternId === 'CARD');
    expect(cardResult.length).toBe(1);
  });

  it('accepts card with dashes', () => {
    const result = detect('CB: 4532-0151-1283-0366');
    const cardResult = result.filter(d => d.patternId === 'CARD');
    expect(cardResult.length).toBe(1);
  });
});

describe('Secu FR Validator (mod-97 key)', () => {
  it('accepts valid Secu number', () => {
    // base = 1850578006084, key = 97 - (1850578006084 % 97)
    const base = 1850578006084;
    const key = 97 - (base % 97);
    const keyStr = key.toString().padStart(2, '0');
    const secu = `1 85 05 78 006 084 ${keyStr}`;
    const result = detect(`Secu: ${secu}`);
    expect(result.some(d => d.patternId === 'SECU_FR')).toBe(true);
  });

  it('rejects Secu with wrong key', () => {
    const result = detect('Secu: 1 85 05 78 006 084 00');
    expect(result.filter(d => d.patternId === 'SECU_FR').length).toBe(0);
  });

  it('rejects Secu with invalid month (13)', () => {
    // Month 13 is invalid (only 01-12 and 20 allowed)
    const result = detect('Secu: 1 85 13 78 006 084 36');
    expect(result.filter(d => d.patternId === 'SECU_FR').length).toBe(0);
  });

  it('rejects Secu starting with 3', () => {
    const result = detect('Secu: 3 85 05 78 006 084 36');
    expect(result.filter(d => d.patternId === 'SECU_FR').length).toBe(0);
  });
});

describe('IPv4 Public Validator', () => {
  const privateIPs = [
    '10.0.0.1',       // Class A private
    '10.255.255.255',
    '172.16.0.1',     // Class B private
    '172.31.255.255',
    '192.168.0.1',    // Class C private
    '192.168.255.255',
    '127.0.0.1',      // Loopback
    '0.0.0.0',        // Zero
    '169.254.1.1',    // Link-local
  ];

  for (const ip of privateIPs) {
    it(`rejects private/reserved IP: ${ip}`, () => {
      const result = detect(`IP: ${ip}`);
      expect(result.filter(d => d.patternId === 'IPV4').length).toBe(0);
    });
  }

  const publicIPs = [
    '8.8.8.8',        // Google DNS
    '203.0.113.42',   // TEST-NET-3
    '1.1.1.1',        // Cloudflare
    '51.15.0.1',      // Random public
  ];

  for (const ip of publicIPs) {
    it(`accepts public IP: ${ip}`, () => {
      const result = detect(`IP: ${ip}`);
      expect(result.some(d => d.patternId === 'IPV4')).toBe(true);
    });
  }

  it('accepts 172.15.x.x (not in private range 172.16-31)', () => {
    const result = detect('IP: 172.15.0.1');
    expect(result.some(d => d.patternId === 'IPV4')).toBe(true);
  });

  it('accepts 172.32.x.x (above private range)', () => {
    const result = detect('IP: 172.32.0.1');
    expect(result.some(d => d.patternId === 'IPV4')).toBe(true);
  });
});

describe('Name Detection Strategies', () => {
  it('NAME_CIVILITY detects Dr. prefix', () => {
    const result = detect('Consultez Dr. Martin');
    expect(result.some(d => d.patternId === 'NAME_CIVILITY')).toBe(true);
  });

  it('NAME_CIVILITY detects Prof. prefix', () => {
    const result = detect('Prof. Dupont presente');
    expect(result.some(d => d.patternId === 'NAME_CIVILITY')).toBe(true);
  });

  it('NAME_CONTEXT detects "patient:" context', () => {
    const result = detect('patient: Jean Dupont');
    expect(result.some(d => d.patternId === 'NAME_CONTEXT')).toBe(true);
  });

  it('NAME_CONTEXT detects "nom =" context', () => {
    const result = detect('nom = Pierre Martin');
    expect(result.some(d => d.patternId === 'NAME_CONTEXT')).toBe(true);
  });

  it('NAME_HEURISTIC ignores "Intelligence Artificielle" (false positive)', () => {
    const result = detect('Intelligence Artificielle est importante');
    expect(result.filter(d => d.patternId === 'NAME_HEURISTIC').length).toBe(0);
  });

  it('NAME_HEURISTIC ignores "Societe Generale" (false positive)', () => {
    const result = detect('La Societe Generale est une banque');
    expect(result.filter(d => d.patternId === 'NAME_HEURISTIC').length).toBe(0);
  });

  it('NAME_HEURISTIC boosts confidence with known first name', () => {
    const result = detect('Pierre Martin travaille');
    const det = result.find(d => d.patternId === 'NAME_HEURISTIC');
    if (det) {
      expect(det.confidence).toBe('medium'); // boosted from low
    }
  });
});
