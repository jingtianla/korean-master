/**
 * 中译韩翻译辅助纯函数（不发起网络请求，便于单元测试）
 * 实际请求免密钥公开端点的逻辑位于 src/app/api/translate/route.ts
 */

export type TranslationProvider = 'google' | 'mymemory';

export interface TranslationSuccess {
  translatedText: string;
  provider: TranslationProvider;
}

const CHINESE_CHAR_PATTERN = /[\u3400-\u9fff]/;

/** 判断文本是否包含汉字（含 CJK 扩展 A 区） */
export function containsChinese(text: string): boolean {
  return CHINESE_CHAR_PATTERN.test(text);
}

/** 只有含中文的输入才需要翻译；纯韩文 / 英文 / 数字直接做音变分析 */
export function needsTranslation(text: string): boolean {
  return containsChinese(text.trim());
}

/** 归一化并限制待翻译文本长度，避免空白或超长输入打爆免费端点配额 */
export function normalizeTranslationInput(text: string, maxLength = 200): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/** 从 Google gtx 免费端点响应中提取译文 */
export function parseGoogleGtxResponse(payload: unknown): string | null {
  if (!Array.isArray(payload)) return null;
  const first: unknown = payload[0];
  if (!Array.isArray(first)) return null;

  const segments: unknown[] = first;
  const parts: string[] = [];
  for (const segment of segments) {
    if (Array.isArray(segment) && typeof segment[0] === 'string') {
      parts.push(segment[0]);
    }
  }
  const translated = parts.join('').trim();
  return translated.length > 0 ? translated : null;
}

interface MyMemoryResponseShape {
  responseStatus?: unknown;
  responseData?: {
    translatedText?: unknown;
  };
}

/** 从 MyMemory 免费端点响应中提取译文 */
export function parseMyMemoryResponse(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const data = payload as MyMemoryResponseShape;
  if (data.responseStatus !== 200) return null;

  const translated = data.responseData?.translatedText;
  if (typeof translated !== 'string' || translated.trim().length === 0) return null;
  return translated.trim();
}
