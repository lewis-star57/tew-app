import { getPhrasesByLanguage } from '../data/phraseCatalog';
import { WALK_SPOTS } from '../data/walkSpots';
import type { LearningLanguage } from '../types/language';
import type { Phrase } from '../types/phrase';
import type { LearningProgress } from '../types/progress';
import type { SpotId } from '../types/walk';

interface LearningDashboardProps {
  progress: LearningProgress;
}

interface CategoryDefinition {
  key: string;
  label: string;
  matches: (phrase: Phrase) => boolean;
}

interface CategoryProgress {
  key: string;
  label: string;
  totalCount: number;
  studiedCount: number;
  masteredCount: number;
  masterRate: number;
}

interface LanguageProgress {
  language: LearningLanguage;
  label: string;
  totalCount: number;
  masteredCount: number;
  masterRate: number;
  weakCount: number;
  studiedCount: number;
  categories: CategoryProgress[];
}

interface SpotLanguageProgress {
  studiedCount: number;
  totalCount: number;
}

interface SpotProgress {
  spotId: SpotId;
  spotName: string;
  icon: string;
  english: SpotLanguageProgress;
  chinese: SpotLanguageProgress;
}

const LANGUAGE_LABELS: Record<LearningLanguage, string> = {
  english: 'English',
  chinese: 'Chinese',
};

const isSpotPhrase = (phrase: Phrase): boolean => phrase.id.startsWith('spot-');

const ENGLISH_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    key: 'daily',
    label: 'daily',
    matches: (phrase) => phrase.category === 'daily' && !isSpotPhrase(phrase),
  },
  {
    key: 'travel',
    label: 'travel',
    matches: (phrase) => phrase.category === 'travel' && !isSpotPhrase(phrase),
  },
  {
    key: 'business',
    label: 'business',
    matches: (phrase) => phrase.category === 'business' && !isSpotPhrase(phrase),
  },
  {
    key: 'spot_phrases',
    label: 'spot phrases',
    matches: isSpotPhrase,
  },
];

const CHINESE_PRIMARY_CATEGORY_KEYS = [
  'greeting',
  'self_intro',
  'daily',
  'shopping',
  'cafe',
  'restaurant',
  'direction',
  'hotel',
];

const CHINESE_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  ...CHINESE_PRIMARY_CATEGORY_KEYS.map((categoryKey) => ({
    key: categoryKey,
    label: categoryKey,
    matches: (phrase: Phrase) => phrase.category === categoryKey,
  })),
  {
    key: 'other',
    label: 'その他',
    matches: (phrase) => !CHINESE_PRIMARY_CATEGORY_KEYS.includes(phrase.category),
  },
];

const getPhraseIdSet = (phrases: Phrase[]): Set<string> => {
  return new Set(phrases.map((phrase) => phrase.id));
};

const getSpotStudiedPhraseIds = (progress: LearningProgress): string[] => {
  const spotStudiedPhraseIds = progress.spotStudiedPhraseIds ?? {};
  const phraseIds: string[] = [];

  Object.values(spotStudiedPhraseIds).forEach((ids) => {
    phraseIds.push(...ids);
  });

  return phraseIds;
};

const getStudiedPhraseIdSet = (progress: LearningProgress): Set<string> => {
  return new Set([
    ...(progress.studiedPhraseIds ?? []),
    ...getSpotStudiedPhraseIds(progress),
    ...(progress.masteredPhraseIds ?? []),
  ]);
};

const getCategoryDefinitions = (language: LearningLanguage): CategoryDefinition[] => {
  return language === 'english' ? ENGLISH_CATEGORY_DEFINITIONS : CHINESE_CATEGORY_DEFINITIONS;
};

const getCategoryProgress = (
  phrases: Phrase[],
  masteredPhraseIds: Set<string>,
  studiedPhraseIds: Set<string>,
  language: LearningLanguage
): CategoryProgress[] => {
  return getCategoryDefinitions(language).map((definition) => {
    const categoryPhrases = phrases.filter(definition.matches);
    const totalCount = categoryPhrases.length;
    const studiedCount = categoryPhrases.filter((phrase) => studiedPhraseIds.has(phrase.id)).length;
    const masteredCount = categoryPhrases.filter((phrase) => masteredPhraseIds.has(phrase.id)).length;

    return {
      key: definition.key,
      label: definition.label,
      totalCount,
      studiedCount,
      masteredCount,
      masterRate: totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0,
    };
  });
};

const getLanguageProgress = (
  progress: LearningProgress,
  language: LearningLanguage
): LanguageProgress => {
  const phrases = getPhrasesByLanguage(language);
  const phraseIds = getPhraseIdSet(phrases);
  const masteredPhraseIds = new Set((progress.masteredPhraseIds ?? []).filter((id) => phraseIds.has(id)));
  const weakPhraseIds = new Set((progress.weakPhraseIds ?? []).filter((id) => phraseIds.has(id)));
  const studiedPhraseIds = new Set(
    Array.from(getStudiedPhraseIdSet(progress)).filter((id) => phraseIds.has(id))
  );
  const totalCount = phrases.length;

  return {
    language,
    label: LANGUAGE_LABELS[language],
    totalCount,
    masteredCount: masteredPhraseIds.size,
    masterRate: totalCount > 0 ? Math.round((masteredPhraseIds.size / totalCount) * 100) : 0,
    weakCount: weakPhraseIds.size,
    studiedCount: studiedPhraseIds.size,
    categories: getCategoryProgress(phrases, masteredPhraseIds, studiedPhraseIds, language),
  };
};

const getDedicatedSpotPhrases = (language: LearningLanguage, spotId: SpotId): Phrase[] => {
  return getPhrasesByLanguage(language).filter(
    (phrase) => phrase.spotId === spotId && isSpotPhrase(phrase)
  );
};

const getCompletedSpotIdsForLanguage = (
  progress: LearningProgress,
  language: LearningLanguage
): SpotId[] => {
  if (progress.completedSpotIdsByLanguage?.[language]) {
    return progress.completedSpotIdsByLanguage[language];
  }

  return language === 'english' ? progress.completedSpotIds ?? [] : [];
};

const getSpotLanguageProgress = (
  progress: LearningProgress,
  language: LearningLanguage,
  spotId: SpotId
): SpotLanguageProgress => {
  const dedicatedPhrases = getDedicatedSpotPhrases(language, spotId);
  const totalCount = dedicatedPhrases.length;
  const completedSpotIds = getCompletedSpotIdsForLanguage(progress, language);

  if (completedSpotIds.includes(spotId)) {
    return {
      studiedCount: totalCount,
      totalCount,
    };
  }

  const studiedPhraseIds = new Set(progress.spotStudiedPhraseIds?.[spotId] ?? []);
  const studiedCount = dedicatedPhrases.filter((phrase) => studiedPhraseIds.has(phrase.id)).length;

  return {
    studiedCount,
    totalCount,
  };
};

const getSpotProgress = (progress: LearningProgress): SpotProgress[] => {
  return WALK_SPOTS.map((spot) => ({
    spotId: spot.id,
    spotName: spot.name,
    icon: spot.icon,
    english: getSpotLanguageProgress(progress, 'english', spot.id),
    chinese: getSpotLanguageProgress(progress, 'chinese', spot.id),
  }));
};

function LanguageSummaryCard({ progress }: { progress: LanguageProgress }) {
  return (
    <article className="languageProgressCard">
      <div className="languageProgressHeader">
        <h3>{progress.label}</h3>
        <strong>{progress.masterRate}%</strong>
      </div>
      <div className="languageProgressStats">
        <div>
          <span>フレーズ総数</span>
          <strong>{progress.totalCount}</strong>
        </div>
        <div>
          <span>マスター済み</span>
          <strong>
            {progress.masteredCount} / {progress.totalCount}
          </strong>
        </div>
        <div>
          <span>苦手</span>
          <strong>{progress.weakCount}</strong>
        </div>
        <div>
          <span>学習済み</span>
          <strong>{progress.studiedCount}</strong>
        </div>
      </div>
    </article>
  );
}

function CategoryProgressList({ languageProgress }: { languageProgress: LanguageProgress }) {
  return (
    <div className="categoryProgressGroup">
      <h3>{languageProgress.label}</h3>
      <div className="progressList">
        {languageProgress.categories.map((category) => (
          <div className="progressRow" key={`${languageProgress.language}-${category.key}`}>
            <div>
              <strong>{category.label}</strong>
              <span>
                学習済み {category.studiedCount} / {category.totalCount}
              </span>
            </div>
            <p>
              マスター {category.masteredCount} / {category.totalCount}（{category.masterRate}%）
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpotProgressRow({ spotProgress }: { spotProgress: SpotProgress }) {
  return (
    <div className="spotProgressRow">
      <div>
        <span className="spotProgressIcon" aria-hidden="true">
          {spotProgress.icon}
        </span>
        <strong>{spotProgress.spotName}</strong>
      </div>
      <p>
        English {spotProgress.english.studiedCount}/{spotProgress.english.totalCount}
      </p>
      <p>
        Chinese {spotProgress.chinese.studiedCount}/{spotProgress.chinese.totalCount}
      </p>
    </div>
  );
}

export function LearningDashboard({ progress }: LearningDashboardProps) {
  const languageProgressList: LanguageProgress[] = [
    getLanguageProgress(progress, 'english'),
    getLanguageProgress(progress, 'chinese'),
  ];
  const spotProgressList = getSpotProgress(progress);

  return (
    <section className="panel learningDashboardPanel">
      <div>
        <p className="eyebrow">ことばの進捗</p>
        <h2>学習ダッシュボード</h2>
      </div>
      <div className="languageProgressGrid">
        {languageProgressList.map((languageProgress) => (
          <LanguageSummaryCard key={languageProgress.language} progress={languageProgress} />
        ))}
      </div>
      <details className="dashboardDetails">
        <summary>カテゴリ別の進み具合</summary>
        <div className="categoryProgressGrid">
          {languageProgressList.map((languageProgress) => (
            <CategoryProgressList
              key={`category-${languageProgress.language}`}
              languageProgress={languageProgress}
            />
          ))}
        </div>
      </details>
      <details className="dashboardDetails">
        <summary>スポット別の進み具合</summary>
        <div className="spotProgressList">
          {spotProgressList.map((spotProgress) => (
            <SpotProgressRow key={spotProgress.spotId} spotProgress={spotProgress} />
          ))}
        </div>
      </details>
    </section>
  );
}
