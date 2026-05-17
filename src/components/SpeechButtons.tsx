import { useEffect, useState } from 'react';
import type { LearningLanguage } from '../types/language';
import { cancelSpeech, canUseSpeech, speakText } from '../utils/speech';

interface SpeechButtonsProps {
  text: string;
  compact?: boolean;
  language?: LearningLanguage;
}

export function SpeechButtons({ text, compact = false, language = 'english' }: SpeechButtonsProps) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(canUseSpeech());

    return () => {
      cancelSpeech();
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
