import { useEffect, useState } from 'react';
import { getPublicAssetPath } from '../utils/assetPath';

export type TaffyMood =
  | 'main'
  | 'happy'
  | 'cheer'
  | 'thinking'
  | 'sleepy'
  | 'surprised'
  | 'sad'
  | 'excited'
  | 'proud'
  | 'love'
  | 'confused'
  | 'begging'
  | 'celebrate'
  | 'jump'
  | 'rollover'
  | 'tired';

export const TAFFY_MOODS: TaffyMood[] = [
  'main',
  'happy',
  'cheer',
  'thinking',
  'sleepy',
  'surprised',
  'sad',
  'excited',
  'proud',
  'love',
  'confused',
  'begging',
  'celebrate',
  'jump',
  'rollover',
  'tired',
];

const TAFFY_IMAGE_PATHS: Record<TaffyMood, string> = {
  main: '/assets/taffy-main.png',
  happy: '/assets/taffy-happy.png',
  cheer: '/assets/taffy-cheer.png',
  thinking: '/assets/taffy-thinking.png',
  sleepy: '/assets/taffy-sleepy.png',
  surprised: '/assets/taffy-surprised.png',
  sad: '/assets/taffy-sad.png',
  excited: '/assets/taffy-excited.png',
  proud: '/assets/taffy-proud.png',
  love: '/assets/taffy-love.png',
  confused: '/assets/taffy-confused.png',
  begging: '/assets/taffy-begging.png',
  celebrate: '/assets/taffy-celebrate.png',
  jump: '/assets/taffy-jump.png',
  rollover: '/assets/taffy-rollover.png',
  tired: '/assets/taffy-tired.png',
};

const TAFFY_IMAGE_FALLBACKS: Partial<Record<TaffyMood, TaffyMood>> = {
  proud: 'cheer',
  love: 'excited',
  confused: 'thinking',
  begging: 'sad',
  celebrate: 'surprised',
  jump: 'celebrate',
  rollover: 'love',
  tired: 'sleepy',
};

const getTaffyImagePath = (mood: TaffyMood): string => getPublicAssetPath(TAFFY_IMAGE_PATHS[mood]);

interface TaffyCharacterProps {
  mood?: TaffyMood;
  message?: string;
  compact?: boolean;
  result?: boolean;
  celebrate?: boolean;
  celebrationId?: number;
  celebrationBadge?: string;
}

export function TaffyCharacter({
  mood = 'main',
  message,
  compact = false,
  result = false,
  celebrate = false,
  celebrationId = 0,
  celebrationBadge,
}: TaffyCharacterProps) {
  const [imageAvailable, setImageAvailable] = useState(true);
  const [imagePath, setImagePath] = useState(getTaffyImagePath(mood));
  const [fallbackStep, setFallbackStep] = useState(0);

  useEffect(() => {
    setImageAvailable(true);
    setFallbackStep(0);
    setImagePath(getTaffyImagePath(mood));
  }, [mood]);

  const handleImageError = () => {
    const fallbackMood = TAFFY_IMAGE_FALLBACKS[mood];

    if (fallbackStep === 0 && fallbackMood) {
      setFallbackStep(1);
      setImagePath(getTaffyImagePath(fallbackMood));
      return;
    }

    if (imagePath !== getTaffyImagePath('main')) {
      setFallbackStep(2);
      setImagePath(getTaffyImagePath('main'));
      return;
    }

    setImageAvailable(false);
  };

  const className = [
    'taffy',
    compact ? 'taffyCompact' : '',
    result ? 'taffyResult' : '',
    celebrate ? 'taffyCelebrate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={className} aria-label="Taffy">
      <div className="taffyImageWrap" key={`taffy-${mood}-${celebrationId}`}>
        {imageAvailable ? (
          <img
            src={imagePath}
            alt={`Taffy ${mood}`}
            className="taffyImage"
            data-taffy-mood={mood}
            data-taffy-src={imagePath}
            onError={handleImageError}
          />
        ) : (
          <div className="taffyPlaceholder" aria-label="Taffy placeholder">
            <span>Taffy</span>
          </div>
        )}
        {celebrate ? (
          <>
            <div className="taffySparkles" aria-hidden="true">
              <span className="sparkle sparkleOne">♥</span>
              <span className="sparkle sparkleTwo">✦</span>
              <span className="sparkle sparkleThree">♥</span>
              <span className="sparkle sparkleFour">✦</span>
            </div>
            {celebrationBadge ? <span className="moodGainBadge">{celebrationBadge}</span> : null}
          </>
        ) : null}
      </div>
      {message ? <p className="taffyMessage">{message}</p> : null}
    </section>
  );
}
