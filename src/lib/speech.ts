/**
 * 浏览器端韩语语音朗读工具（基于 Web Speech API `ko-KR`）
 */
export function speakKorean(text: string, rate = 0.9): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find((v) => v.lang.includes('ko') || v.lang.includes('KR'));
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
