import { useEffect, useState } from 'react';

interface SpeechButtonsProps {
  text: string;
  compact?: boolean;
}

const canUseSpeech = () => {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
};

const speakEnglish = (text: string, rate: number) => {
  if (!canUseSpeech() || !text.trim()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};

export function SpeechButtons({ text, compact = false }: SpeechButtonsProps) {
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
      <button className="speechButton" type="button" onClick={() => speakEnglish(text, 1)}>
        聞く
      </button>
      <button className="speechButton slow" type="button" onClick={() => speakEnglish(text, 0.6)}>
        ゆっくり聞く
      </button>
    </div>
  );
}
