import type {
  AppliedPhoneticRule,
  DecomposedSyllable,
  GrammarLevel,
  GrammarPoint,
  PronunciationAnalysis,
  YonseiWord,
} from '@/types/korean';

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

const INITIALS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const MEDIALS = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];

const FINALS = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const INITIAL_ROMAN: Record<string, string> = {
  ㄱ: 'g',
  ㄲ: 'kk',
  ㄴ: 'n',
  ㄷ: 'd',
  ㄸ: 'tt',
  ㄹ: 'r',
  ㅁ: 'm',
  ㅂ: 'b',
  ㅃ: 'pp',
  ㅅ: 's',
  ㅆ: 'ss',
  ㅇ: '',
  ㅈ: 'j',
  ㅉ: 'jj',
  ㅊ: 'ch',
  ㅋ: 'k',
  ㅌ: 't',
  ㅍ: 'p',
  ㅎ: 'h',
};

const MEDIAL_ROMAN: Record<string, string> = {
  ㅏ: 'a',
  ㅐ: 'ae',
  ㅑ: 'ya',
  ㅒ: 'yae',
  ㅓ: 'eo',
  ㅔ: 'e',
  ㅕ: 'yeo',
  ㅖ: 'ye',
  ㅗ: 'o',
  ㅘ: 'wa',
  ㅙ: 'wae',
  ㅚ: 'oe',
  ㅛ: 'yo',
  ㅜ: 'u',
  ㅝ: 'wo',
  ㅞ: 'we',
  ㅟ: 'wi',
  ㅠ: 'yu',
  ㅡ: 'eu',
  ㅢ: 'ui',
  ㅣ: 'i',
};

const FINAL_ROMAN: Record<string, string> = {
  '': '',
  ㄱ: 'k',
  ㄲ: 'k',
  ㄴ: 'n',
  ㄷ: 't',
  ㄹ: 'l',
  ㅁ: 'm',
  ㅂ: 'p',
  ㅅ: 't',
  ㅆ: 't',
  ㅇ: 'ng',
  ㅈ: 't',
  ㅊ: 't',
  ㅋ: 'k',
  ㅌ: 't',
  ㅍ: 'p',
  ㅎ: 't',
};

/**
 * 判断单个字符是否为现代韩文音节 (가 ~ 힣)
 */
export function isHangulSyllable(char: string): boolean {
  if (!char || char.length !== 1) return false;
  const code = char.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
}

/**
 * 将单个韩文音节拆解为初声(initial)、中声(medial)、终声/收音(final)
 */
export function decomposeHangul(char: string): DecomposedSyllable | null {
  if (!isHangulSyllable(char)) return null;
  const code = char.charCodeAt(0) - HANGUL_START;
  const finalIndex = code % 28;
  const medialIndex = ((code - finalIndex) / 28) % 21;
  const initialIndex = Math.floor((code - finalIndex) / 28 / 21);

  return {
    initial: INITIALS[initialIndex] ?? 'ㅇ',
    medial: MEDIALS[medialIndex] ?? 'ㅏ',
    final: FINALS[finalIndex] ?? '',
  };
}

/**
 * 将初声、中声、终声重新合成为单个韩文音节
 */
export function composeHangul(parts: DecomposedSyllable): string {
  const initialIndex = INITIALS.indexOf(parts.initial);
  const medialIndex = MEDIALS.indexOf(parts.medial);
  const finalIndex = FINALS.indexOf(parts.final);

  if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) {
    throw new Error(`Invalid Hangul jamo combination: ${JSON.stringify(parts)}`);
  }

  const code = HANGUL_START + (initialIndex * 21 + medialIndex) * 28 + finalIndex;
  return String.fromCharCode(code);
}

/**
 * 将韩文句子转换为罗马音标注
 */
export function romanizeKorean(text: string): string {
  const result: string[] = [];
  for (const char of text) {
    const parts = decomposeHangul(char);
    if (!parts) {
      result.push(char);
      continue;
    }
    const init = INITIAL_ROMAN[parts.initial] ?? '';
    const med = MEDIAL_ROMAN[parts.medial] ?? '';
    const fin = FINAL_ROMAN[parts.final] ?? '';
    result.push(`${init}${med}${fin}`);
  }
  return result.join('-').replace(/- -/g, ' ').replace(/^-|-$/g, '');
}

/**
 * 韩语核心音变规则分析引擎（支持颚音化、连音化、鼻音化、紧音化、送气化）
 */
export function analyzePronunciation(text: string): PronunciationAnalysis {
  const chars = Array.from(text);
  const decomposed = chars.map((ch) => decomposeHangul(ch));
  const appliedRules: AppliedPhoneticRule[] = [];

  for (let i = 0; i < chars.length - 1; i++) {
    const curr = decomposed[i];
    const next = decomposed[i + 1];
    if (!curr || !next || !curr.final) continue;

    const originalPair = `${composeHangul(curr)}${composeHangul(next)}`;

    // 1. 颚音化 (Palatalization): 收音 ㄷ/ㅌ 遇 ㅇ + ㅣ -> ㅈ/ㅊ
    if (
      (curr.final === 'ㄷ' || curr.final === 'ㅌ') &&
      next.initial === 'ㅇ' &&
      next.medial === 'ㅣ'
    ) {
      next.initial = curr.final === 'ㄷ' ? 'ㅈ' : 'ㅊ';
      curr.final = '';
      const transformedPair = `${composeHangul(curr)}${composeHangul(next)}`;
      appliedRules.push({
        type: 'palatalization',
        nameZh: '颚音化 (구개음화)',
        position: i,
        originalPair,
        transformedPair,
        explanationZh: `前字收音 ${originalPair[0]} 的 ㄷ/ㅌ 遇到元音 이 时，舌位向硬腭移动，变为 [${transformedPair}]。`,
      });
      continue;
    }

    // 2. 连音化 (Liaison): 单收音（非 ㅇ/ㅎ）遇到后字初声 ㅇ
    const liaisonMap: Record<string, string> = {
      ㄱ: 'ㄱ',
      ㄲ: 'ㄲ',
      ㄴ: 'ㄴ',
      ㄷ: 'ㄷ',
      ㄹ: 'ㄹ',
      ㅁ: 'ㅁ',
      ㅂ: 'ㅂ',
      ㅅ: 'ㅅ',
      ㅆ: 'ㅆ',
      ㅈ: 'ㅈ',
      ㅊ: 'ㅊ',
      ㅋ: 'ㅋ',
      ㅌ: 'ㅌ',
      ㅍ: 'ㅍ',
    };
    if (next.initial === 'ㅇ' && liaisonMap[curr.final]) {
      next.initial = liaisonMap[curr.final];
      curr.final = '';
      const transformedPair = `${composeHangul(curr)}${composeHangul(next)}`;
      appliedRules.push({
        type: 'liaison',
        nameZh: '连音化 (연음화)',
        position: i,
        originalPair,
        transformedPair,
        explanationZh: `前字收音直接移到后字零声母“ㅇ”的位置连读，${originalPair} 实际读作 [${transformedPair}]。`,
      });
      continue;
    }

    // 3. 鼻音化 (Nasalization): 收音 ㄱ/ㄷ/ㅂ 遇初声 ㄴ/ㅁ -> ㅇ/ㄴ/ㅁ
    const nasalMap: Record<string, string> = {
      ㄱ: 'ㅇ',
      ㅋ: 'ㅇ',
      ㄲ: 'ㅇ',
      ㄷ: 'ㄴ',
      ㅅ: 'ㄴ',
      ㅆ: 'ㄴ',
      ㅈ: 'ㄴ',
      ㅊ: 'ㄴ',
      ㅌ: 'ㄴ',
      ㅂ: 'ㅁ',
      ㅍ: 'ㅁ',
    };
    if ((next.initial === 'ㄴ' || next.initial === 'ㅁ') && nasalMap[curr.final]) {
      curr.final = nasalMap[curr.final];
      const transformedPair = `${composeHangul(curr)}${composeHangul(next)}`;
      appliedRules.push({
        type: 'nasalization',
        nameZh: '鼻音化 (비음화)',
        position: i,
        originalPair,
        transformedPair,
        explanationZh: `前字阻碍音收音受后字鼻音(${next.initial})同化，变为同部位鼻音，${originalPair} 读作 [${transformedPair}]。`,
      });
      continue;
    }

    // 4. 送气化 (Aspiration): 收音 ㄱ/ㄷ/ㅂ/ㅈ 与 ㅎ 相遇 -> ㅋ/ㅌ/ㅍ/ㅊ
    const aspirationFinalMap: Record<string, string> = {
      ㄱ: 'ㅋ',
      ㄷ: 'ㅌ',
      ㅂ: 'ㅍ',
      ㅈ: 'ㅊ',
    };
    if (next.initial === 'ㅎ' && aspirationFinalMap[curr.final]) {
      next.initial = aspirationFinalMap[curr.final];
      curr.final = '';
      const transformedPair = `${composeHangul(curr)}${composeHangul(next)}`;
      appliedRules.push({
        type: 'aspiration',
        nameZh: '送气化 (격음화)',
        position: i,
        originalPair,
        transformedPair,
        explanationZh: `前字收音与后字送气音“ㅎ”合并为强送气音(${next.initial})，${originalPair} 读作 [${transformedPair}]。`,
      });
      continue;
    }
    if (curr.final === 'ㅎ' && aspirationFinalMap[next.initial]) {
      next.initial = aspirationFinalMap[next.initial];
      curr.final = '';
      const transformedPair = `${composeHangul(curr)}${composeHangul(next)}`;
      appliedRules.push({
        type: 'aspiration',
        nameZh: '送气化 (격음화)',
        position: i,
        originalPair,
        transformedPair,
        explanationZh: `前字收音“ㅎ”与后字松音合并为送气音(${next.initial})，${originalPair} 读作 [${transformedPair}]。`,
      });
      continue;
    }

    // 5. 紧音化 (Tensification): 收音 ㄱ/ㄷ/ㅂ 后接 ㄱ/ㄷ/ㅂ/ㅅ/ㅈ -> ㄲ/ㄸ/ㅃ/ㅆ/ㅉ
    const obstructFinals = new Set([
      'ㄱ',
      'ㄲ',
      'ㅋ',
      'ㄷ',
      'ㅅ',
      'ㅆ',
      'ㅈ',
      'ㅊ',
      'ㅌ',
      'ㅂ',
      'ㅍ',
    ]);
    const tenseMap: Record<string, string> = {
      ㄱ: 'ㄲ',
      ㄷ: 'ㄸ',
      ㅂ: 'ㅃ',
      ㅅ: 'ㅆ',
      ㅈ: 'ㅉ',
    };
    if (obstructFinals.has(curr.final) && tenseMap[next.initial]) {
      next.initial = tenseMap[next.initial];
      const transformedPair = `${composeHangul(curr)}${composeHangul(next)}`;
      appliedRules.push({
        type: 'tensification',
        nameZh: '紧音化 (경음화)',
        position: i,
        originalPair,
        transformedPair,
        explanationZh: `前字塞音收音阻塞气流后，后字松音发生紧音化重读，${originalPair} 读作 [${transformedPair}]。`,
      });
    }
  }

  const pronouncedChars = chars.map((ch, idx) => {
    const part = decomposed[idx];
    return part ? composeHangul(part) : ch;
  });
  const pronouncedText = pronouncedChars.join('');

  return {
    originalText: text,
    pronouncedText,
    romanization: romanizeKorean(pronouncedText),
    appliedRules,
  };
}

/**
 * 延世词库筛选器（支持关键词、汉字词过滤、册数筛选）
 */
export function filterVocabulary(
  words: YonseiWord[],
  options: { query?: string; onlyHanja?: boolean; bookLevel?: number | 'all' },
): YonseiWord[] {
  const query = (options.query ?? '').trim().toLowerCase();
  return words.filter((word) => {
    if (options.onlyHanja && !word.isHanjaWord) return false;
    if (options.bookLevel && options.bookLevel !== 'all' && word.bookLevel !== options.bookLevel) {
      return false;
    }
    if (!query) return true;
    return (
      word.korean.toLowerCase().includes(query) ||
      word.chineseMeaning.toLowerCase().includes(query) ||
      word.hanja.toLowerCase().includes(query) ||
      word.etymologyNote.toLowerCase().includes(query)
    );
  });
}

/**
 * 语法列表按等级筛选与答题判分
 */
export function filterGrammarByLevel(
  items: GrammarPoint[],
  level: GrammarLevel | 'all',
): GrammarPoint[] {
  if (level === 'all') return items;
  return items.filter((item) => item.level === level);
}

export function checkGrammarQuizAnswer(
  item: GrammarPoint,
  selectedIndex: number,
): {
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
} {
  const isCorrect = item.quiz.correctIndex === selectedIndex;
  return {
    isCorrect,
    correctOption: item.quiz.options[item.quiz.correctIndex] ?? '',
    explanation: item.quiz.explanation,
  };
}
