'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Languages,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import { HANGUL_ITEMS } from '@/data/hangulData';
import { YONSEI_VOCAB_LIST } from '@/data/yonseiVocabData';
import { GRAMMAR_LIST } from '@/data/grammarData';
import {
  analyzePronunciation,
  checkGrammarQuizAnswer,
  filterGrammarByLevel,
  filterVocabulary,
} from '@/lib/koreanPhonetics';
import { speakKorean } from '@/lib/speech';
import type { GrammarLevel, HangulCategory } from '@/types/korean';

type ActiveTab = 'hangul' | 'phonetics' | 'vocab' | 'grammar';

const SAMPLE_SENTENCES = [
  { label: '谢谢（鼻音化）', text: '감사합니다' },
  { label: '我学韩语（连音化+鼻音化）', text: '한국어를 공부합니다' },
  { label: '在学校食堂吃汤饭（紧音化+连音化）', text: '학교 식당에서 국밥을 먹어요' },
  { label: '今年考入大学（送气化）', text: '대학교에 입학했어요' },
  { label: '一起去看电影（颚音化）', text: '우리 같이 영화 봐요' },
];

export function KoreanPlatform() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('phonetics');
  const [hangulCat, setHangulCat] = useState<HangulCategory | 'all'>('all');
  const [inputText, setInputText] = useState<string>('한국어를 같이 공부합니다');
  const [vocabQuery, setVocabQuery] = useState<string>('');
  const [onlyHanja, setOnlyHanja] = useState<boolean>(false);
  const [savedWordIds, setSavedWordIds] = useState<string[]>([]);
  const [grammarLevel, setGrammarLevel] = useState<GrammarLevel | 'all'>('all');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);

  const filteredHangul = useMemo(
    () =>
      hangulCat === 'all'
        ? HANGUL_ITEMS
        : HANGUL_ITEMS.filter((item) => item.category === hangulCat),
    [hangulCat],
  );

  const phoneticResult = useMemo(() => analyzePronunciation(inputText), [inputText]);

  const filteredVocab = useMemo(
    () => filterVocabulary(YONSEI_VOCAB_LIST, { query: vocabQuery, onlyHanja }),
    [vocabQuery, onlyHanja],
  );

  const filteredGrammar = useMemo(
    () => filterGrammarByLevel(GRAMMAR_LIST, grammarLevel),
    [grammarLevel],
  );

  const toggleSaveWord = (id: string) => {
    setSavedWordIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectQuiz = (grammarId: string, optionIdx: number, correctIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [grammarId]: optionIdx }));
    if (optionIdx !== correctIdx) {
      setMistakeIds((prev) => (prev.includes(grammarId) ? prev : [...prev, grammarId]));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 顶部品牌栏 */}
      <header className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-6 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-100">
              <Sparkles className="h-4 w-4" />
              <span>中文母语者专属 · 开源精华融合版</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
              韩语学习全能工作台 (Korean Master)
            </h1>
            <p className="mt-1 text-sm text-indigo-100">
              集四十音真人点读 · 音变规则高亮转写 · 《延世韩国语》汉字词源记忆 ·
              分级语法与错题本于一体
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              🔊 点击任意韩文即时发音
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              📒 生词收藏：{savedWordIds.length} 词
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              🎯 语法错题本：{mistakeIds.length} 题
            </span>
          </div>
        </div>
      </header>

      {/* 四大核心模块导航 Tab */}
      <nav className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveTab('phonetics')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
            activeTab === 'phonetics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>1. 音变规则实验室</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hangul')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
            activeTab === 'hangul'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Volume2 className="h-4 w-4" />
          <span>2. 四十音点读馆</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vocab')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
            activeTab === 'vocab'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Languages className="h-4 w-4" />
          <span>3. 延世汉字词源本</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grammar')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
            activeTab === 'grammar'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>4. 分级语法与自测</span>
        </button>
      </nav>

      {/* 模块一：音变规则实验室 */}
      {activeTab === 'phonetics' && (
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                🔬 韩语音变规则实时转写器（连音 / 鼻音 / 紧音 / 送气 / 颚音化）
              </h2>
              <p className="text-sm text-slate-500">
                输入任意韩语句子，自动推演韩国人真实口语读音，并用中文拆解背后的音变原理。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="py-1 text-xs font-medium text-slate-500">一键体验经典例句：</span>
            {SAMPLE_SENTENCES.map((sample) => (
              <button
                key={sample.text}
                type="button"
                onClick={() => setInputText(sample.text)}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                {sample.label}：{sample.text}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="korean-input" className="text-xs font-semibold text-slate-500">
                  输入韩文原文 (Original Hangul)
                </label>
                <button
                  type="button"
                  onClick={() => speakKorean(inputText, 0.9)}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>常速朗读</span>
                </button>
              </div>
              <textarea
                id="korean-input"
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-3 text-xl font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
                placeholder="请输入韩文句子，如：한국어를 공부합니다"
              />
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-700">
                  实际口语发音转写 (Real Spoken Pronunciation)
                </span>
                <button
                  type="button"
                  onClick={() => speakKorean(inputText, 0.65)}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>0.65x 慢速跟读</span>
                </button>
              </div>
              <div className="text-2xl font-extrabold tracking-wide text-indigo-900">
                [{phoneticResult.pronouncedText}]
              </div>
              <div className="mt-2 font-mono text-sm text-indigo-600">
                罗马音参考：{phoneticResult.romanization}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-800">
              📌 检测到的音变规则详解（共触发 {phoneticResult.appliedRules.length} 处）
            </h3>
            {phoneticResult.appliedRules.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                当前句子无需特殊音变，按字面发音朗读即可。
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {phoneticResult.appliedRules.map((rule, index) => (
                  <div
                    key={`${rule.type}-${rule.position}-${index}`}
                    className="rounded-xl border border-amber-200 bg-amber-50/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
                        {rule.nameZh}
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {rule.originalPair} → [{rule.transformedPair}]
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                      {rule.explanationZh}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 模块二：四十音发音点读馆 */}
      {activeTab === 'hangul' && (
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                🎵 韩语四十音点读与中文母语者正音秘诀
              </h2>
              <p className="text-sm text-slate-500">
                点击任意卡片即可听到韩语发音，配套专为中国人编写的防踩坑口型指南。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: '全部' },
                { key: 'vowel-basic', label: '基础元音' },
                { key: 'vowel-compound', label: '复合元音' },
                { key: 'consonant-basic', label: '松音/基础辅音' },
                { key: 'consonant-double', label: '紧音' },
                { key: 'batchim', label: '收音(韵尾)' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setHangulCat(tab.key as HangulCategory | 'all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    hangulCat === tab.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHangul.map((item) => (
              <div
                key={item.id}
                onClick={() => speakKorean(item.char, 0.85)}
                className="group cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-indigo-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xl font-black text-indigo-600">{item.char}</span>
                    <span className="ml-2 text-sm font-semibold text-slate-700">{item.nameKo}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                    <Volume2 className="h-3.5 w-3.5" />[{item.romanization}]
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-800">💡 {item.chineseTip}</p>
                <p className="mt-1 text-xs text-slate-500">👄 口型：{item.mouthPosition}</p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <span className="font-semibold text-slate-700">
                    代表词：{item.exampleWord}（{item.exampleMeaning}）
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakKorean(item.exampleWord, 0.9);
                    }}
                    className="text-indigo-600 hover:underline"
                  >
                    读单词 🔊
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 模块三：延世韩国语汉字词源本 */}
      {activeTab === 'vocab' && (
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                📖 《延世韩国语》汉字词源联想单词本
              </h2>
              <p className="text-sm text-slate-500">
                韩语 60% 以上词汇为汉字词，通过「韩文 ↔ 繁体汉字词根 ↔ 中文释义」三维秒记单词。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={vocabQuery}
                onChange={(e) => setVocabQuery(e.target.value)}
                placeholder="搜韩文 / 中文 / 汉字词根..."
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyHanja}
                  onChange={(e) => setOnlyHanja(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <span>只看汉字词</span>
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredVocab.map((word) => {
              const isSaved = savedWordIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900">{word.korean}</span>
                        <span className="text-xs font-semibold text-indigo-600">
                          [{word.pronounced}]
                        </span>
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                          汉字：{word.hanja}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        【{word.partOfSpeech}】{word.chineseMeaning}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => speakKorean(word.korean, 0.9)}
                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                        title="朗读单词"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaveWord(word.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          isSaved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSaved ? '已入生词本' : '+ 生词本'}
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700">
                    🧠 <strong>词源拆解：</strong>
                    {word.etymologyNote}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <p className="font-medium text-slate-800">例：{word.exampleKo}</p>
                      <p className="text-slate-500">译：{word.exampleZh}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakKorean(word.exampleKo, 0.9)}
                      className="shrink-0 font-semibold text-indigo-600 hover:underline"
                    >
                      读例句 🔊
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 模块四：分级语法与互动自测 */}
      {activeTab === 'grammar' && (
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                🎓 初 / 中 / 高级核心语法详解与随堂自测
              </h2>
              <p className="text-sm text-slate-500">
                每个语法点均配中文接续规则、真实例句发音与互动练习题，答错自动进入错题集。
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all', label: '全部等级' },
                { key: 'beginner', label: '初级 (TOPIK 1-2)' },
                { key: 'intermediate', label: '中级 (TOPIK 3-4)' },
                { key: 'advanced', label: '高级 (TOPIK 5-6)' },
              ].map((lv) => (
                <button
                  key={lv.key}
                  type="button"
                  onClick={() => setGrammarLevel(lv.key as GrammarLevel | 'all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    grammarLevel === lv.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lv.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredGrammar.map((item) => {
              const selectedIdx = quizAnswers[item.id];
              const quizCheck =
                selectedIdx !== undefined ? checkGrammarQuizAnswer(item, selectedIdx) : null;

              return (
                <div key={item.id} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-900">{item.pattern}</h3>
                      <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                        {item.meaningZh}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakKorean(item.exampleKo, 0.9)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>朗读例句</span>
                    </button>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    🔗 接续规则：{item.attachRule}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{item.detailExplanation}</p>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="font-bold text-slate-900">📌 例句：{item.exampleKo}</p>
                    <p className="text-xs text-slate-600">译文：{item.exampleZh}</p>
                  </div>

                  {/* 随堂自测 */}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-800">
                      ✍️ 即时自测：{item.quiz.question}
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {item.quiz.options.map((opt, idx) => {
                        const isPicked = selectedIdx === idx;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectQuiz(item.id, idx, item.quiz.correctIndex)}
                            className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                              isPicked
                                ? idx === item.quiz.correctIndex
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                                  : 'border-rose-500 bg-rose-50 text-rose-900'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {idx + 1}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizCheck && (
                      <div
                        className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-xs ${
                          quizCheck.isCorrect
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {quizCheck.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                        )}
                        <div>
                          <p className="font-bold">
                            {quizCheck.isCorrect
                              ? '回答正确！'
                              : `回答错误（已自动加入错题本），正确答案：${quizCheck.correctOption}`}
                          </p>
                          <p className="mt-0.5">{quizCheck.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
