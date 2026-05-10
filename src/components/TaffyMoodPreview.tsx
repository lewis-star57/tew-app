import { useState } from 'react';
import { TAFFY_MOODS, TaffyCharacter, type TaffyMood } from './TaffyCharacter';

const MOOD_LABELS: Record<TaffyMood, string> = {
  main: '通常',
  happy: '正解',
  cheer: '達成',
  thinking: '復習',
  sleepy: '見るだけ',
  surprised: '特別報酬',
  sad: '連続注意',
  excited: 'おやつ',
  proud: '全問正解',
  love: 'おやつ直後',
  confused: 'きょとん',
  begging: 'おやつほしい',
  celebrate: '特別達成',
  jump: 'ジャンプ',
  rollover: 'ごろりん',
  tired: 'がんばった後',
};

export function TaffyMoodPreview() {
  const [selectedMood, setSelectedMood] = useState<TaffyMood>('main');

  return (
    <details className="panel moodPreviewPanel">
      <summary>開発用：Taffy表情テスト</summary>
      <div className="sectionHeader moodPreviewHeader">
        <p className="eyebrow">表情プレビュー</p>
        <h2>表情を切り替えて確認</h2>
      </div>
      <TaffyCharacter
        compact
        mood={selectedMood}
        message={`今は「${MOOD_LABELS[selectedMood]}」のTaffyです。`}
      />
      <div className="moodButtonGrid" aria-label="Taffy表情の切り替え">
        {TAFFY_MOODS.map((mood) => (
          <button
            className={selectedMood === mood ? 'moodButton active' : 'moodButton'}
            type="button"
            key={mood}
            onClick={() => setSelectedMood(mood)}
          >
            {MOOD_LABELS[mood]}
          </button>
        ))}
      </div>
    </details>
  );
}
