import { useMemo, useState } from 'react';
import { QuizCard } from '../components/QuizCard';
import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import { buildQuizQuestions } from '../game/quizRules';
import type { Phrase } from '../types/phrase';
import type { QuizMode } from '../types/progress';
import { speakText } from '../utils/speech';
import { playQuizAnswerSound } from '../utils/soundEffects';

interface QuizScreenProps {
  allPhrases: Phrase[];
  missionPhrases: Phrase[];
  quizMode: QuizMode;
  todayKey: string;
  weakPhraseIds: string[];
  masteredPhraseIds: string[];
  onMarkPhraseMastered: (phraseId: string) => void;
  onCompleteQuiz: (data: {
    mode: QuizMode;
    questionPhraseIds: string[];
    correctPhraseIds: string[];
    incorrectPhraseIds: string[];
  }) => void;
}

export function QuizScreen({
  allPhrases,
  missionPhrases,
  quizMode,
  todayKey,
  weakPhraseIds,
  masteredPhraseIds,
  onMarkPhraseMastered,
  onCompleteQuiz,
}: QuizScreenProps) {
  const questions = useMemo(
    () => buildQuizQuestions(missionPhrases, allPhrases, { dateKey: todayKey, quizMode }),
    [allPhrases, missionPhrases, quizMode, todayKey]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewChoice, setPreviewChoice] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [correctPhraseIds, setCorrectPhraseIds] = useState<string[]>([]);
  const [incorrectPhraseIds, setIncorrectPhraseIds] = useState<string[]>([]);
  const question = questions[currentIndex];
  const taffyMood: TaffyMood =
    selectedChoice === null ? 'main' : selectedChoice === question.correctChoice ? 'happy' : 'confused';
  const taffyMessage =
    selectedChoice === null
      ? previewChoice
        ? '聞こえたら、同じ答えをもう一度タップしてね🐾'
        : '1回タップで聞いてから選べるよ🐶'
      : selectedChoice === question.correctChoice
        ? 'ワンワン！正解だよ🐶'
        : '惜しい！Taffyともう一回おさらいしよう🐾';
  const title =
    quizMode === 'extraQuiz'
      ? 'おかわり10問'
      : quizMode === 'dailyReview'
        ? '今日の復習クイズ'
      : quizMode === 'retryQuiz'
        ? '間違えた問題だけもう一回'
      : quizMode === 'spotQuiz'
        ? 'この場所の会話クイズ'
        : '今日の5問チャレンジ';
  const isWeakQuestion = weakPhraseIds.includes(question.phrase.id);
  const quizHint =
    quizMode === 'retryQuiz'
      ? '再チャレンジはXP +5。おやつなしで、今すぐおさらいできます🐾'
      : isWeakQuestion
        ? '苦手フレーズに正解するとXPが少し多めです。'
        : null;

  const handleCorrectAnswer = (phraseId: string) => {
    setCorrectPhraseIds((ids) => Array.from(new Set([...ids, phraseId])));
  };

  const handleIncorrectAnswer = (phraseId: string) => {
    setIncorrectPhraseIds((ids) => Array.from(new Set([...ids, phraseId])));
  };

  const handleConfirmChoice = (choice: string) => {
    const isCorrectChoice = choice === question.correctChoice;

    playQuizAnswerSound(isCorrectChoice);
    setSelectedChoice(choice);

    if (isCorrectChoice) {
      handleCorrectAnswer(question.phrase.id);
      return;
    }

    handleIncorrectAnswer(question.phrase.id);
  };

  const handleChoose = (choice: string) => {
    if (selectedChoice) {
      return;
    }

    if (previewChoice !== choice) {
      speakText(choice, 1, question.phrase.language);
      setPreviewChoice(choice);
      return;
    }

    handleConfirmChoice(choice);
  };

  const handleNext = () => {
    const isLast = currentIndex + 1 === questions.length;

    if (isLast) {
      onCompleteQuiz({
        mode: quizMode,
        questionPhraseIds: questions.map((item) => item.phrase.id),
        correctPhraseIds,
        incorrectPhraseIds,
      });
      return;
    }

    setCurrentIndex((index) => index + 1);
    setPreviewChoice(null);
    setSelectedChoice(null);
  };

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">4択クイズ</p>
        <h1>{title}</h1>
      </header>
      <TaffyCharacter compact mood={taffyMood} message={taffyMessage} />
      {quizHint ? <p className="quizHint">{quizHint}</p> : null}
      <QuizCard
        question={question}
        currentIndex={currentIndex}
        total={questions.length}
        previewChoice={previewChoice}
        selectedChoice={selectedChoice}
        isMastered={masteredPhraseIds.includes(question.phrase.id)}
        onChoose={handleChoose}
        onNext={handleNext}
        onMarkMastered={onMarkPhraseMastered}
      />
    </main>
  );
}
