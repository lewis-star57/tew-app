import { useMemo, useState } from 'react';
import { QuizCard } from '../components/QuizCard';
import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import { buildQuizQuestions } from '../game/quizRules';
import type { Phrase } from '../types/phrase';
import type { QuizMode } from '../types/progress';

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
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [correctPhraseIds, setCorrectPhraseIds] = useState<string[]>([]);
  const [incorrectPhraseIds, setIncorrectPhraseIds] = useState<string[]>([]);
  const question = questions[currentIndex];
  const taffyMood: TaffyMood =
    selectedChoice === null ? 'main' : selectedChoice === question.correctChoice ? 'happy' : 'confused';
  const taffyMessage =
    selectedChoice === null
      ? 'ゆっくり選んで大丈夫。Taffyも考え中だよ🐶'
      : selectedChoice === question.correctChoice
        ? 'いい感じ！Taffyもうれしそう🐶'
        : '大丈夫。Taffyと一緒にもう一回覚えよう🐶';
  const title =
    quizMode === 'extraQuiz'
      ? 'おかわり10問'
      : quizMode === 'spotQuiz'
        ? 'この場所の会話クイズ'
        : '今日の5問チャレンジ';
  const isWeakQuestion = weakPhraseIds.includes(question.phrase.id);

  const handleChoose = (choice: string) => {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice(choice);

    if (choice === question.correctChoice) {
      setCorrectPhraseIds((ids) => Array.from(new Set([...ids, question.phrase.id])));
      return;
    }

    setIncorrectPhraseIds((ids) => Array.from(new Set([...ids, question.phrase.id])));
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
    setSelectedChoice(null);
  };

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">4択クイズ</p>
        <h1>{title}</h1>
      </header>
      <TaffyCharacter compact mood={taffyMood} message={taffyMessage} />
      {isWeakQuestion ? <p className="quizHint">苦手フレーズに正解するとXPが少し多めです。</p> : null}
      <QuizCard
        question={question}
        currentIndex={currentIndex}
        total={questions.length}
        selectedChoice={selectedChoice}
        isMastered={masteredPhraseIds.includes(question.phrase.id)}
        onChoose={handleChoose}
        onNext={handleNext}
        onMarkMastered={onMarkPhraseMastered}
      />
    </main>
  );
}
