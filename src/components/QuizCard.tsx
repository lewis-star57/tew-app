import { SpeechButtons } from './SpeechButtons';
import type { QuizQuestion } from '../types/phrase';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  total: number;
  selectedChoice: string | null;
  isMastered: boolean;
  onChoose: (choice: string) => void;
  onNext: () => void;
  onMarkMastered: (phraseId: string) => void;
}

export function QuizCard({
  question,
  currentIndex,
  total,
  selectedChoice,
  isMastered,
  onChoose,
  onNext,
  onMarkMastered,
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
              ? 'いい感じ！今のフレーズ、Taffyと覚えたね🐶'
              : '大丈夫。このフレーズは復習でまた会えるよ🐾'}
            </p>
          <div className="quizAnswerSpeech">
            <span>正解: {question.correctChoice}</span>
            {question.phrase.language === 'chinese' && question.phrase.pinyin ? (
              <span className="quizAnswerPinyin">{question.phrase.pinyin}</span>
            ) : null}
            <span>{question.phrase.japanese}</span>
            <span>カタカナ目安: {question.phrase.kana}</span>
            <span>使う場面: {question.phrase.scene}</span>
            <SpeechButtons text={question.correctChoice} language={question.phrase.language} compact />
          </div>
          <div className="phraseCardActions">
            {isMastered ? (
              <span className="masteredBadge">マスター済み🐶</span>
            ) : (
              <button className="calmButton" type="button" onClick={() => onMarkMastered(question.phrase.id)}>
                完全に覚えた🐶
              </button>
            )}
          </div>
        </div>
      ) : null}
      <button className="primaryButton" type="button" onClick={onNext} disabled={!answered}>
        {currentIndex + 1 === total ? '結果を見る' : '次へ'}
      </button>
    </section>
  );
}
