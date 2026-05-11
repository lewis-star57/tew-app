import { useEffect, useMemo, useState } from 'react';
import { SpeechButtons } from '../components/SpeechButtons';
import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import { getMiniConversationDateKey } from '../game/miniConversationRules';
import { getPublicAssetPath } from '../utils/assetPath';
import type { MiniConversation, MiniConversationReward } from '../types/miniConversation';

interface MiniConversationScreenProps {
  conversations: MiniConversation[];
  todayKey: string;
  completedMiniConversationDates: string[];
  reward: MiniConversationReward | null;
  onCompleteConversation: (conversation: MiniConversation) => void;
  onBackToMap: () => void;
}

export function MiniConversationScreen({
  conversations,
  todayKey,
  completedMiniConversationDates,
  reward,
  onCompleteConversation,
  onBackToMap,
}: MiniConversationScreenProps) {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id ?? '');
  const [isSelfPractice, setIsSelfPractice] = useState(false);
  const [revealedLineKeys, setRevealedLineKeys] = useState<string[]>([]);
  const activeConversation = useMemo(() => {
    return conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];
  }, [activeConversationId, conversations]);

  useEffect(() => {
    setActiveConversationId(conversations[0]?.id ?? '');
  }, [conversations]);

  useEffect(() => {
    setRevealedLineKeys([]);
  }, [activeConversationId, isSelfPractice]);

  if (!activeConversation) {
    return (
      <main className="screen">
        <header className="screenHeader">
          <p className="eyebrow">ミニ会話</p>
          <h1>ミニ会話</h1>
        </header>
        <TaffyCharacter compact mood="thinking" message="この場所のミニ会話を準備しています。" />
        <button className="secondaryButton" type="button" onClick={onBackToMap}>
          散歩マップへ
        </button>
      </main>
    );
  }

  const completedToday = completedMiniConversationDates.includes(
    getMiniConversationDateKey(activeConversation.id, todayKey)
  );
  const conversationLanguage = activeConversation.language ?? 'english';
  const isRewardForActiveConversation = reward?.conversationId === activeConversation.id;
  const taffyMood: TaffyMood = isRewardForActiveConversation
    ? reward.isFirstCompletion
      ? 'celebrate'
      : 'cheer'
    : 'happy';
  const taffyMessage = isRewardForActiveConversation
    ? reward.didReward
      ? 'ミニ会話クリア！Taffyも誇らしそうです。'
      : '今日はこの会話を練習済みです。声に出したことが大事だよ。'
    : '短い会話を、Taffyと一緒に声に出してみよう。';

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">ミニ会話</p>
        <h1>ミニ会話モード</h1>
      </header>
      <TaffyCharacter compact mood={taffyMood} message={taffyMessage} />
      <div className="conversationTabs" aria-label="ミニ会話を選ぶ">
        {conversations.map((conversation) => (
          <button
            className={conversation.id === activeConversation.id ? 'moodButton active' : 'moodButton'}
            key={conversation.id}
            type="button"
            onClick={() => setActiveConversationId(conversation.id)}
          >
            {conversation.title}
          </button>
        ))}
      </div>
      <section className="panel conversationModePanel">
        <div>
          <p className="eyebrow">練習モード</p>
          <h2>自分パートだけ練習</h2>
        </div>
        <label className="conversationToggle">
          <input
            checked={isSelfPractice}
            onChange={(event) => setIsSelfPractice(event.target.checked)}
            type="checkbox"
          />
          <span>{isSelfPractice ? 'ON：あなたのフレーズを隠す' : 'OFF：全文を見る'}</span>
        </label>
      </section>
      {isRewardForActiveConversation ? (
        <section className="panel miniConversationReward">
          <p className="eyebrow">会話できたね！</p>
          <h2>{activeConversation.title}を声に出した！</h2>
          <p>
            {reward.didReward
              ? `おやつ +${reward.treatsGained} / XP（経験値） +${reward.xpGained} / ごきげん +${reward.moodPointsGained}`
              : '今日の報酬は受け取り済みです。'}
          </p>
        </section>
      ) : null}
      <section className="panel miniConversationPanel">
        <div className="miniConversationHeader">
          <p className="eyebrow">使う場面</p>
          <h2>{activeConversation.title}</h2>
          <p>{activeConversation.scene}</p>
        </div>
        <div className="conversationLines">
          {activeConversation.lines.map((line, index) => {
            const lineKey = `${activeConversation.id}-${index}`;
            const isYourLine = line.role === 'you';
            const isHidden = isSelfPractice && isYourLine && !revealedLineKeys.includes(lineKey);
            const lineText = line.text ?? line.english;

            return (
              <article
                className={[
                  'conversationLine',
                  line.role === 'taffy' ? 'taffyLine' : 'youLine',
                  isHidden ? 'hiddenAnswer' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={lineKey}
              >
                <span className="speakerBadge">
                  {line.role === 'taffy' ? (
                    <img alt="" src={getPublicAssetPath('/assets/taffy-main.png')} />
                  ) : (
                    'You'
                  )}
                </span>
                <div className="conversationBubble">
                  <div className="conversationLineMeta">
                    <span>{line.role === 'taffy' ? 'Taffyが言う' : 'あなたが言う'}</span>
                  </div>
                  {isHidden ? (
                    <div className="hiddenAnswerBox">
                      <p>ここを声に出してみよう。</p>
                      <button
                        className="speechButton"
                        type="button"
                        onClick={() => setRevealedLineKeys((keys) => [...keys, lineKey])}
                      >
                        答えを見る
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3>{lineText}</h3>
                      {conversationLanguage === 'chinese' && line.pinyin ? (
                        <p className="phrasePinyin">{line.pinyin}</p>
                      ) : null}
                      <SpeechButtons compact text={lineText} language={conversationLanguage} />
                      <p className="translation">{line.japanese}</p>
                      <p className="kanaLine">{line.kana}</p>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <button
          className={completedToday ? 'calmButton' : 'primaryButton'}
          type="button"
          onClick={() => onCompleteConversation(activeConversation)}
        >
          {completedToday ? '今日は声に出したよ' : '声に出した！'}
        </button>
        <p className="dailyPhraseReward">
          {completedToday ? '今日の会話ごほうび受け取り済み' : '完了すると XP（経験値） +10 / おやつ +1 / ごきげん +1'}
        </p>
      </section>
      <button className="secondaryButton" type="button" onClick={onBackToMap}>
        散歩マップへ
      </button>
    </main>
  );
}
