import { useEffect, useState } from 'react';
import type { LearningLanguage } from '../types/language';

interface SpeechButtonsProps {
  text: string;
  compact?: boolean;
  language?: LearningLanguage;
}

const SPEECH_LANG: Record<LearningLanguage, string> = {
  english: 'en-US',
  chinese: 'zh-CN',
};

const canUseSpeech = () => {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
};

const speakText = (text: string, rate: number, language: LearningLanguage) => {
  if (!canUseSpeech() || !text.trim()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG[language];
  utterance.rate = rate;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};

export function SpeechButtons({ text, compact = false, language = 'english' }: SpeechButtonsProps) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(canUseSpeech());

    return () => {
      if (canUseSpeech()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!text.trim()) {
    return null;
  }

  if (!isSupported) {
    return <p className="speechUnavailable">音声非対応</p>;
  }

  return (
    <div className={compact ? 'speechButtons speechButtonsCompact' : 'speechButtons'}>
      <button className="speechButton" type="button" onClick={() => speakText(text, 1, language)}>
        聞く
      </button>
      <button className="speechButton slow" type="button" onClick={() => speakText(text, 0.6, language)}>
        ゆっくり聞く
      </button>
    </div>
  );
}
