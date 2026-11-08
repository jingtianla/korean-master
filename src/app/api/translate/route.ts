import { NextResponse } from 'next/server';
import {
  normalizeTranslationInput,
  parseGoogleGtxResponse,
  parseMyMemoryResponse,
  type TranslationProvider,
  type TranslationSuccess,
} from '@/lib/translation';

const REQUEST_TIMEOUT_MS = 6000;
const GOOGLE_GTX_URL =
  process.env.TRANSLATE_GOOGLE_URL ?? 'https://translate.googleapis.com/translate_a/single';
const MYMEMORY_URL =
  process.env.TRANSLATE_MYMEMORY_URL ?? 'https://api.mymemory.translated.net/get';

interface TranslateRequestBody {
  text?: unknown;
}

function buildGoogleUrl(text: string): string {
  const url = new URL(GOOGLE_GTX_URL);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'zh-CN');
  url.searchParams.set('tl', 'ko');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  return url.toString();
}

function buildMyMemoryUrl(text: string): string {
  const url = new URL(MYMEMORY_URL);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', 'zh-CN|ko');
  return url.toString();
}

async function attemptTranslation(
  provider: TranslationProvider,
  url: string,
  parse: (payload: unknown) => string | null,
): Promise<TranslationSuccess | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    const translatedText = parse(payload);
    return translatedText ? { translatedText, provider } : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function attemptTranslationOrThrow(
  provider: TranslationProvider,
  url: string,
  parse: (payload: unknown) => string | null,
): Promise<TranslationSuccess> {
  const result = await attemptTranslation(provider, url, parse);
  if (!result) throw new Error(`${provider} translation failed`);
  return result;
}

/**
 * 中文 → 韩文免密钥翻译接口。
 * 两个公开端点并发竞速，谁先返回有效译文就用谁：国内网络下 Google gtx 常不可达，
 * 串行降级会白等一次超时；并发可让当前可达的端点立即响应。两者均失败返回 502。
 */
export async function POST(request: Request) {
  let body: TranslateRequestBody;
  try {
    body = (await request.json()) as TranslateRequestBody;
  } catch {
    return NextResponse.json({ error: '请求体不是合法的 JSON' }, { status: 400 });
  }

  const rawText = typeof body.text === 'string' ? body.text : '';
  const text = normalizeTranslationInput(rawText);
  if (!text) {
    return NextResponse.json({ error: '待翻译文本为空或超过 200 字' }, { status: 400 });
  }

  try {
    const winner = await Promise.any([
      attemptTranslationOrThrow('mymemory', buildMyMemoryUrl(text), parseMyMemoryResponse),
      attemptTranslationOrThrow('google', buildGoogleUrl(text), parseGoogleGtxResponse),
    ]);
    return NextResponse.json(winner);
  } catch {
    return NextResponse.json({ error: '翻译服务暂不可用，请直接输入韩文后重试' }, { status: 502 });
  }
}
