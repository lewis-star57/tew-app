interface TutorialCardProps {
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: '学習モードを選ぼう',
    description: 'English / Chinese を切り替えて、今日学びたいことばを選べます。',
  },
  {
    title: '今日のひとことを声に出そう',
    description: '聞いて、ゆっくり聞いて、まねして言うだけでOKです。',
  },
  {
    title: '今日の5問ミッションに挑戦',
    description: '毎日少しずつ、Taffyといっしょにフレーズを覚えます。',
  },
  {
    title: 'おやつをTaffyにあげよう',
    description: '学習でもらったおやつで、Taffyがもっとごきげんになります。',
  },
];

export function TutorialCard({ onClose }: TutorialCardProps) {
  return (
    <section className="panel tutorialPanel" aria-label="はじめてガイド">
      <div className="sectionHeader">
        <p className="eyebrow">はじめてガイド</p>
        <h2>Taffyと今日からことばさんぽ</h2>
      </div>
      <div className="tutorialSteps">
        {TUTORIAL_STEPS.map((step, index) => (
          <article className="tutorialStep" key={step.title}>
            <span>{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="tutorialActions">
        <button className="primaryButton" type="button" onClick={onClose}>
          はじめる🐶
        </button>
        <button className="secondaryButton" type="button" onClick={onClose}>
          閉じる
        </button>
      </div>
    </section>
  );
}
