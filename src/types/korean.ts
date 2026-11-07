export type HangulCategory =
  | 'vowel-basic'
  | 'vowel-compound'
  | 'consonant-basic'
  | 'consonant-double'
  | 'batchim';

export interface HangulItem {
  id: string;
  char: string;
  nameKo: string;
  romanization: string;
  category: HangulCategory;
  chineseTip: string;
  mouthPosition: string;
  exampleWord: string;
  exampleMeaning: string;
}

export type PhoneticRuleType =
  | 'liaison'
  | 'nasalization'
  | 'tensification'
  | 'aspiration'
  | 'palatalization';

export interface AppliedPhoneticRule {
  type: PhoneticRuleType;
  nameZh: string;
  position: number;
  originalPair: string;
  transformedPair: string;
  explanationZh: string;
}

export interface PronunciationAnalysis {
  originalText: string;
  pronouncedText: string;
  romanization: string;
  appliedRules: AppliedPhoneticRule[];
}

export interface YonseiWord {
  id: string;
  korean: string;
  pronounced: string;
  hanja: string;
  isHanjaWord: boolean;
  partOfSpeech: string;
  chineseMeaning: string;
  etymologyNote: string;
  bookLevel: number;
  exampleKo: string;
  exampleZh: string;
}

export type GrammarLevel = 'beginner' | 'intermediate' | 'advanced';

export interface GrammarPoint {
  id: string;
  pattern: string;
  level: GrammarLevel;
  meaningZh: string;
  attachRule: string;
  detailExplanation: string;
  exampleKo: string;
  exampleZh: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface DecomposedSyllable {
  initial: string;
  medial: string;
  final: string;
}
