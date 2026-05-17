import { cancelSpeech } from './speech';

const QUIZ_ANSWER_SOUNDS = {
  correct: '/assets/sounds/taffy-correct.mp3',
  wrong: '/assets/sounds/taffy-wrong.mp3',
};

export const playQuizAnswerSound = (isCorrect: boolean) => {
  if (typeof window === 'undefined' || typeof window.Audio !== 'function') {
    return;
  }

  try {
    cancelSpeech();

    const audio = new window.Audio(isCorrect ? QUIZ_ANSWER_SOUNDS.correct : QUIZ_ANSWER_SOUNDS.wrong);
    audio.volume = 0.85;

    void audio.play().catch(() => {
      // The quiz should continue even if the browser blocks or cannot load the sound.
    });
  } catch {
    // Audio effects are optional, so failures should never stop the learning flow.
  }
};
