import { describe, it, expect, beforeEach } from 'vitest';
import { process, revealOriginal, depseudonymize, getRegistry, getStats, reset } from '../../src/paste-protect/processor.js';

beforeEach(() => {
  reset();
});

describe('process()', () => {
  it('returns empty result for null/undefined/empty', () => {
    const result = process(null);
    expect(result.count).toBe(0);
    expect(result.detections).toEqual([]);
    expect(result.processed).toBe('');
    expect(result.hasArt9).toBe(false);
  });

  it('returns unchanged text when no PII detected', () => {
    const result = process('Bonjour tout le monde');
    expect(result.processed).toBe('Bonjour tout le monde');
    expect(result.count).toBe(0);
  });

  it('detects and pseudonymizes email', () => {
    const result = process('Contact: test@example.com');
    expect(result.count).toBe(1);
    expect(result.processed).toContain('[Email_1]');
    expect(result.processed).not.toContain('test@example.com');
    expect(result.categoryCounts.contact).toBe(1);
    expect(result.rgpdCategories.art4).toBe(1);
    expect(result.hasArt9).toBe(false);
  });

  it('detects art9 data and flags hasArt9', () => {
    // Build valid SECU_FR
    const base = 1850578006084;
    const key = 97 - (base % 97);
    const keyStr = key.toString().padStart(2, '0');
    const secu = `1 85 05 78 006 084 ${keyStr}`;
    const result = process(`Numero: ${secu}`);
    expect(result.hasArt9).toBe(true);
    expect(result.rgpdCategories.art9).toBeGreaterThan(0);
  });

  it('detectOnly mode does not pseudonymize', () => {
    const result = process('Contact: test@example.com', { detectOnly: true });
    expect(result.count).toBe(1);
    expect(result.processed).toBe('Contact: test@example.com');
    expect(result.detections.length).toBe(1);
  });

  it('measures processing time', () => {
    const result = process('Contact: test@example.com');
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.processingTimeMs).toBe('number');
  });

  it('handles multiple PII types in one text', () => {
    const text = 'Email: test@example.com, Tel: 01 23 45 67 89, IP: 203.0.113.42';
    const result = process(text);
    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.processed).not.toContain('test@example.com');
    expect(result.processed).not.toContain('203.0.113.42');
  });

  it('respects enabledCategories option', () => {
    const text = 'Email: test@example.com, IP: 203.0.113.42';
    const result = process(text, { enabledCategories: ['contact'] });
    expect(result.detections.every(d => d.category === 'contact')).toBe(true);
  });

  it('respects confidenceThreshold option', () => {
    const text = 'Email: test@example.com, handle: @someuser123';
    const result = process(text, { confidenceThreshold: 'high' });
    expect(result.detections.every(d => d.confidence === 'high')).toBe(true);
  });
});

describe('pipeline roundtrip', () => {
  it('depseudonymize restores original text', () => {
    const original = 'Contact: test@example.com pour info';
    const result = process(original);
    const restored = depseudonymize(result.processed);
    expect(restored).toBe(original);
  });

  it('revealOriginal works after processing', () => {
    process('Contact: test@example.com');
    expect(revealOriginal('Email_1')).toBe('test@example.com');
  });

  it('getRegistry returns entries after processing', () => {
    process('Contact: test@example.com');
    const registry = getRegistry();
    expect(registry.length).toBe(1);
    expect(registry[0].pseudonym).toBe('Email_1');
  });

  it('getStats reflects processing', () => {
    process('Contact: test@example.com et another@mail.fr');
    const stats = getStats();
    expect(stats.total).toBe(2);
  });
});
