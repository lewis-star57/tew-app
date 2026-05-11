import { LEARNING_LANGUAGE_LABELS, type LearningLanguage } from '../types/language';
import { PHRASE_DIFFICULTY_LABELS, type PhraseDifficulty } from '../types/phrase';

interface LanguageSwitcherProps {
  language: LearningLanguage;
  difficulty: PhraseDifficulty;
  onChangeLanguage: (language: LearningLanguage) => void;
  onChangeDifficulty: (difficulty: PhraseDifficulty) => void;
}

const LANGUAGE_OPTIONS: LearningLanguage[] = ['english', 'chinese'];
const DIFFICULTY_OPTIONS: PhraseDifficulty[] = ['easy', 'normal', 'challenge'];

export function LanguageSwitcher({
  language,
  difficulty,
  onChangeLanguage,
  onChangeDifficulty,
}: LanguageSwitcherProps) {
  return (
    <section className="languageSwitcher" aria-label="学習モードと難易度の切り替え">
      <div className="switcherRows">
        <div className="switcherRow">
          <span>学習モード</span>
          <div className="switcherOptions">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                className={language === option ? 'languageButton active' : 'languageButton'}
                type="button"
                key={option}
                onClick={() => onChangeLanguage(option)}
                aria-pressed={language === option}
              >
                {LEARNING_LANGUAGE_LABELS[option]}
              </button>
            ))}
          </div>
        </div>
        <div className="switcherRow">
          <span>難易度</span>
          <div className="switcherOptions difficultyOptions">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                className={difficulty === option ? 'languageButton active' : 'languageButton'}
                type="button"
                key={option}
                onClick={() => onChangeDifficulty(option)}
                aria-pressed={difficulty === option}
              >
                {PHRASE_DIFFICULTY_LABELS[option]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
