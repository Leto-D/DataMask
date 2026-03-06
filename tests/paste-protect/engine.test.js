import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPseudonym, pseudonymize, revealOriginal,
  depseudonymize, getRegistry, getStats, reset
} from '../../src/paste-protect/engine.js';

beforeEach(() => {
  reset();
});

describe('getPseudonym()', () => {
  it('generates deterministic pseudonyms (same input = same output)', () => {
    const p1 = getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    const p2 = getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    expect(p1).toBe(p2);
    expect(p1).toBe('Email_1');
  });

  it('increments counter for different values with same prefix', () => {
    const p1 = getPseudonym('a@b.com', 'Email', 'contact', 'art4');
    const p2 = getPseudonym('c@d.com', 'Email', 'contact', 'art4');
    expect(p1).toBe('Email_1');
    expect(p2).toBe('Email_2');
  });

  it('normalizes input (trim + lowercase)', () => {
    const p1 = getPseudonym('Test@Example.COM', 'Email', 'contact', 'art4');
    const p2 = getPseudonym('  test@example.com  ', 'Email', 'contact', 'art4');
    expect(p1).toBe(p2);
  });

  it('increments count on repeated calls', () => {
    getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    const registry = getRegistry();
    expect(registry[0].count).toBe(3);
  });

  it('uses different counters per prefix', () => {
    const p1 = getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    const p2 = getPseudonym('01 23 45 67 89', 'Tel', 'contact', 'art4');
    expect(p1).toBe('Email_1');
    expect(p2).toBe('Tel_1');
  });
});

describe('pseudonymize()', () => {
  it('returns unchanged text when no detections', () => {
    const result = pseudonymize('Hello world', []);
    expect(result.text).toBe('Hello world');
    expect(result.count).toBe(0);
  });

  it('replaces detected text with [Prefix_N]', () => {
    const text = 'Email: test@example.com ici';
    const detections = [{
      match: 'test@example.com',
      start: 7,
      end: 23,
      category: 'contact',
      rgpdCategory: 'art4',
      pseudonymPrefix: 'Email'
    }];
    const result = pseudonymize(text, detections);
    expect(result.text).toBe('Email: [Email_1] ici');
    expect(result.count).toBe(1);
  });

  it('handles multiple detections preserving positions', () => {
    const text = 'a@b.com et c@d.com';
    const detections = [
      { match: 'a@b.com', start: 0, end: 7, category: 'contact', rgpdCategory: 'art4', pseudonymPrefix: 'Email' },
      { match: 'c@d.com', start: 11, end: 18, category: 'contact', rgpdCategory: 'art4', pseudonymPrefix: 'Email' }
    ];
    const result = pseudonymize(text, detections);
    // Engine replaces end-to-start, so second detection gets Email_1, first gets Email_2
    expect(result.text).toBe('[Email_2] et [Email_1]');
    expect(result.count).toBe(2);
  });

  it('returns null for null detections', () => {
    const result = pseudonymize('text', null);
    expect(result.text).toBe('text');
    expect(result.count).toBe(0);
  });
});

describe('revealOriginal()', () => {
  it('returns original for known pseudonym', () => {
    getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    expect(revealOriginal('Email_1')).toBe('test@example.com');
  });

  it('returns null for unknown pseudonym', () => {
    expect(revealOriginal('Unknown_99')).toBeNull();
  });
});

describe('depseudonymize()', () => {
  it('restores all pseudonyms in text', () => {
    const text = 'Contact: test@example.com et 01 23 45 67 89';
    const detections = [
      { match: 'test@example.com', start: 9, end: 25, category: 'contact', rgpdCategory: 'art4', pseudonymPrefix: 'Email' },
      { match: '01 23 45 67 89', start: 29, end: 43, category: 'contact', rgpdCategory: 'art4', pseudonymPrefix: 'Tel' }
    ];
    const result = pseudonymize(text, detections);
    const restored = depseudonymize(result.text);
    expect(restored).toBe(text);
  });
});

describe('getRegistry()', () => {
  it('does not expose original values', () => {
    getPseudonym('secret@mail.com', 'Email', 'contact', 'art4');
    const registry = getRegistry();
    expect(registry.length).toBe(1);
    expect(registry[0].pseudonym).toBe('Email_1');
    expect(registry[0].category).toBe('contact');
    expect(registry[0].rgpdCategory).toBe('art4');
    // Should NOT contain original
    const json = JSON.stringify(registry);
    expect(json).not.toContain('secret@mail.com');
  });
});

describe('getStats()', () => {
  it('returns correct stats', () => {
    getPseudonym('a@b.com', 'Email', 'contact', 'art4');
    getPseudonym('1 85 05 78 006 084 20', 'Secu', 'identity', 'art9');
    const stats = getStats();
    expect(stats.total).toBe(2);
    expect(stats.byCategory).toEqual({ contact: 1, identity: 1 });
    expect(stats.byRgpd).toEqual({ art4: 1, art9: 1 });
  });
});

describe('reset()', () => {
  it('clears all tables and counters', () => {
    getPseudonym('test@example.com', 'Email', 'contact', 'art4');
    reset();
    expect(getRegistry()).toEqual([]);
    expect(getStats().total).toBe(0);
    expect(revealOriginal('Email_1')).toBeNull();
    // Counter should restart
    const p = getPseudonym('new@test.com', 'Email', 'contact', 'art4');
    expect(p).toBe('Email_1');
  });
});
