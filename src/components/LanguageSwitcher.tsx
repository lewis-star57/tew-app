import { LEARNING_LANGUAGE_LABELS, type LearningLanguage } from '../types/language';

interface LanguageSwitcherProps {
  language: LearningLanguage;
  onChangeLanguage: (language: LearningLanguage) => void;
}

const OPTIONS: LearningLanguage[] = ['english', 'chinese'];

export function LanguageSwitcher({ language, onChangeLanguage }: LanguageSwitcherProps) {
  return (
    <section className="languageSwitcher" aria-label="学習言語の切り替え">
      <span>学習モード</span>
      <div>
        {OPTIONS.map((option) => (
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
    </section>
  );
}
