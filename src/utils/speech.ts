import type { LearningLanguage } from '../types/language';

export const SPEECH_LANG: Record<LearningLanguage, string> = {
  english: 'en-US',
  chinese: 'zh-CN',
};

export const canUseSpeech = () => {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
};

export const cancelSpeech = () => {
  if (canUseSpeech()) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (text: string, rate: number, language: LearningLanguage) => {
  if (!canUseSpeech() || !text.trim()) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG[language];
  utterance.rate = rate;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
  return true;
};
