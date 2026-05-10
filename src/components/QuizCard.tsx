import { SpeechButtons } from './SpeechButtons';
import type { QuizQuestion } from '../types/phrase';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  total: number;
  selectedChoice: string | null;
  onChoose: (choice: string) => void;
  onNext: () => void;
}

export function QuizCard({
  question,
  currentIndex,
  total,
  selectedChoice,
  onChoose,
  onNext,
}: QuizCardProps) {
  const answered = selectedChoice !== null;
  const isCorrect = selectedChoice === question.correctChoice;

  return (
    <section className="panel quizPanel">
      <p className="eyebrow">
        クイズ {currentIndex + 1} / {total}
      </p>
      <h2>{question.prompt}</h2>
      <div className="choiceList">
        {question.choices.map((choice) => {
          const isSelected = choice === selectedChoice;
          const showCorrect = answered && choice === question.correctChoice;

          return (
            <button
              className={[
                'choiceButton',
                isSelected ? 'selected' : '',
                showCorrect ? 'correct' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              key={choice}
              onClick={() => onChoose(choice)}
              disabled={answered}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className={isCorrect ? 'feedback good' : 'feedback soft'}>
          <p>
            {isCorrect
              ? 'いい感じです。今のフレーズ、Taffyと一緒に覚えました。'
              : '大丈夫です。このフレーズは復習リストに入れて、またやさしく練習します。'}
          </p>
          <div className="quizAnswerSpeech">
            <span>正解: {question.correctChoice}</span>
            <SpeechButtons text={question.correctChoice} compact />
          </div>
        </div>
      ) : null}
      <button className="primaryButton" type="button" onClick={onNext} disabled={!answered}>
        {currentIndex + 1 === total ? '結果を見る' : '次へ'}
      </button>
    </section>
  );
}
