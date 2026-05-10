import { getTaffyMoodLevel } from '../game/taffyCareRules';
import { TaffyCharacter } from './TaffyCharacter';
import type { LearningProgress } from '../types/progress';

interface TaffyCarePanelProps {
  progress: LearningProgress;
  showSatisfiedAfterTreat?: boolean;
  onGiveTreat: () => void;
}

export function TaffyCarePanel({
  progress,
  showSatisfiedAfterTreat = false,
  onGiveTreat,
}: TaffyCarePanelProps) {
  const canGiveTreat = progress.treats > 0;
  const moodLevel = getTaffyMoodLevel(progress.taffyMoodPoints);
  const showBegging = !canGiveTreat && !showSatisfiedAfterTreat;

  return (
    <section className="panel taffyCarePanel">
      <div className="sectionHeader">
        <p className="eyebrow">Taffyにおやつ</p>
        <h2>Taffyのごきげん</h2>
      </div>
      <div className="taffyCareStats">
        <div>
          <span>ごきげん</span>
          <strong>{moodLevel}</strong>
        </div>
        <div>
          <span>あげたおやつ</span>
          <strong>{progress.totalTreatsGiven}こ</strong>
        </div>
      </div>
      {showSatisfiedAfterTreat ? (
        <div className="taffyCareBegging taffyCareSatisfied">
          <TaffyCharacter
            compact
            mood="rollover"
            message="おやつおいしかったね。Taffyは満足そうです。"
          />
        </div>
      ) : null}
      {showBegging ? (
        <div className="taffyCareBegging">
          <TaffyCharacter
            compact
            mood="begging"
            message="おやつがないよ。今日の5問で一緒に集めよう！"
          />
        </div>
      ) : null}
      <button
        className={canGiveTreat ? 'calmButton' : 'secondaryButton'}
        type="button"
        disabled={!canGiveTreat}
        onClick={onGiveTreat}
      >
        {canGiveTreat ? 'Taffyにおやつをあげる' : 'おやつがないよ'}
      </button>
    </section>
  );
}
