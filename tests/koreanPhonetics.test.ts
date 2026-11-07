import { describe, expect, it } from 'vitest';
import {
  analyzePronunciation,
  checkGrammarQuizAnswer,
  composeHangul,
  decomposeHangul,
  filterGrammarByLevel,
  filterVocabulary,
  isHangulSyllable,
  romanizeKorean,
} from '@/lib/koreanPhonetics';
import { YONSEI_VOCAB_LIST } from '@/data/yonseiVocabData';
import { GRAMMAR_LIST } from '@/data/grammarData';

describe('Korean Phonetics & Platform Core Engine', () => {
  it('correctly identifies and decomposes Hangul syllables', () => {
    expect(isHangulSyllable('한')).toBe(true);
    expect(isHangulSyllable('A')).toBe(false);
    expect(isHangulSyllable('')).toBe(false);

    const parts = decomposeHangul('한');
    expect(parts).toEqual({ initial: 'ㅎ', medial: 'ㅏ', final: 'ㄴ' });
    expect(composeHangul({ initial: 'ㅎ', medial: 'ㅏ', final: 'ㄴ' })).toBe('한');
    expect(decomposeHangul('?')).toBeNull();
  });

  it('throws on invalid Hangul jamo combination', () => {
    expect(() => composeHangul({ initial: 'X', medial: 'ㅏ', final: '' })).toThrow();
  });

  it('applies liaison rule (연음화) accurately', () => {
    const res = analyzePronunciation('한국어');
    expect(res.pronouncedText).toBe('한구거');
    expect(res.appliedRules.some((r) => r.type === 'liaison')).toBe(true);
  });

  it('applies nasalization rule (비음화) accurately', () => {
    const res = analyzePronunciation('감사합니다');
    expect(res.pronouncedText).toBe('감사함니다');
    expect(res.appliedRules.some((r) => r.type === 'nasalization')).toBe(true);
  });

  it('applies tensification rule (경음화) accurately', () => {
    const res = analyzePronunciation('학교 식당');
    expect(res.pronouncedText).toBe('학꾜 식땅');
    expect(res.appliedRules.filter((r) => r.type === 'tensification').length).toBe(2);
  });

  it('applies aspiration rule (격음화) accurately in both directions', () => {
    const res1 = analyzePronunciation('입학');
    expect(res1.pronouncedText).toBe('이팍');
    expect(res1.appliedRules[0]?.type).toBe('aspiration');

    const res2 = analyzePronunciation('좋다');
    expect(res2.pronouncedText).toBe('조타');
    expect(res2.appliedRules[0]?.type).toBe('aspiration');
  });

  it('applies palatalization rule (구개음화) accurately', () => {
    const res = analyzePronunciation('같이 굳이');
    expect(res.pronouncedText).toBe('가치 구지');
    expect(res.appliedRules.filter((r) => r.type === 'palatalization').length).toBe(2);
  });

  it('generates clean romanization for Korean phrases', () => {
    expect(romanizeKorean('한구거')).toBe('han-gu-geo');
  });

  it('filters Yonsei vocabulary by query, Hanja flag, and book level', () => {
    const hanjaOnly = filterVocabulary(YONSEI_VOCAB_LIST, { onlyHanja: true });
    expect(hanjaOnly.every((w) => w.isHanjaWord)).toBe(true);

    const libraryMatch = filterVocabulary(YONSEI_VOCAB_LIST, { query: '图书' });
    expect(libraryMatch.length).toBe(1);
    expect(libraryMatch[0]?.korean).toBe('도서관');

    const book3 = filterVocabulary(YONSEI_VOCAB_LIST, { bookLevel: 3 });
    expect(book3.every((w) => w.bookLevel === 3)).toBe(true);
  });

  it('filters grammar items and grades quiz answers accurately', () => {
    const beginnerList = filterGrammarByLevel(GRAMMAR_LIST, 'beginner');
    expect(beginnerList.length).toBeGreaterThan(0);
    expect(filterGrammarByLevel(GRAMMAR_LIST, 'all').length).toBe(GRAMMAR_LIST.length);

    const firstGrammar = GRAMMAR_LIST[0]!;
    const correctRes = checkGrammarQuizAnswer(firstGrammar, firstGrammar.quiz.correctIndex);
    expect(correctRes.isCorrect).toBe(true);

    const wrongRes = checkGrammarQuizAnswer(firstGrammar, 99);
    expect(wrongRes.isCorrect).toBe(false);
  });
});
