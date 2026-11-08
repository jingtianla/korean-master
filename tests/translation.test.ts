import { describe, expect, it } from 'vitest';
import {
  containsChinese,
  needsTranslation,
  normalizeTranslationInput,
  parseGoogleGtxResponse,
  parseMyMemoryResponse,
} from '@/lib/translation';

describe('Chinese to Korean translation helpers', () => {
  it('detects Chinese characters and decides whether translation is required', () => {
    expect(containsChinese('你好')).toBe(true);
    expect(containsChinese('한국어')).toBe(false);
    expect(needsTranslation('  你好，请翻译  ')).toBe(true);
    expect(needsTranslation('한국어를 공부합니다')).toBe(false);
    expect(needsTranslation('Hello')).toBe(false);
  });

  it('parses Google gtx payloads and rejects malformed ones', () => {
    expect(parseGoogleGtxResponse([[['안녕하세요', '你好']]])).toBe('안녕하세요');
    expect(
      parseGoogleGtxResponse([
        [
          ['안녕', '你好'],
          ['하세요', ''],
        ],
      ]),
    ).toBe('안녕하세요');
    expect(parseGoogleGtxResponse(null)).toBeNull();
    expect(parseGoogleGtxResponse([[]])).toBeNull();
    expect(parseGoogleGtxResponse({})).toBeNull();
  });

  it('parses MyMemory payloads and rejects error responses', () => {
    expect(
      parseMyMemoryResponse({
        responseStatus: 200,
        responseData: { translatedText: '안녕하세요' },
      }),
    ).toBe('안녕하세요');
    expect(parseMyMemoryResponse({ responseStatus: 500 })).toBeNull();
    expect(parseMyMemoryResponse({ responseStatus: 200, responseData: {} })).toBeNull();
    expect(parseMyMemoryResponse(null)).toBeNull();
  });

  it('normalizes and bounds translation input', () => {
    expect(normalizeTranslationInput('  你好  ')).toBe('你好');
    expect(normalizeTranslationInput('   ')).toBeNull();
    expect(normalizeTranslationInput('')).toBeNull();
    expect(normalizeTranslationInput('가'.repeat(201))).toBeNull();
    expect(normalizeTranslationInput('가'.repeat(200))).toHaveLength(200);
  });
});
