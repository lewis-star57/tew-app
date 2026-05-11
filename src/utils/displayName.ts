import type { MiniConversation } from '../types/miniConversation';
import type { Phrase } from '../types/phrase';

export const DEFAULT_DISPLAY_NAME = 'Kiyo';
export const USER_NAME_TOKEN = '{userName}';

export const normalizeDisplayName = (displayName?: string | null): string => {
  const trimmedName = displayName?.trim();
  return trimmedName ? trimmedName : DEFAULT_DISPLAY_NAME;
};

export const applyDisplayName = (value: string, displayName?: string | null): string => {
  const safeDisplayName = normalizeDisplayName(displayName);

  return value
    .split(USER_NAME_TOKEN)
    .join(safeDisplayName)
    .split('Kiyo')
    .join(safeDisplayName)
    .split('キヨ')
    .join(safeDisplayName);
};

export const applyDisplayNameToPhrase = (
  phrase: Phrase,
  displayName?: string | null
): Phrase => ({
  ...phrase,
  text: applyDisplayName(phrase.text, displayName),
  english: applyDisplayName(phrase.english, displayName),
  japanese: applyDisplayName(phrase.japanese, displayName),
  pinyin: phrase.pinyin ? applyDisplayName(phrase.pinyin, displayName) : phrase.pinyin,
  kana: applyDisplayName(phrase.kana, displayName),
  scene: applyDisplayName(phrase.scene, displayName),
  choices: phrase.choices.map((choice) => applyDisplayName(choice, displayName)),
});

export const applyDisplayNameToPhrases = (
  phrases: Phrase[],
  displayName?: string | null
): Phrase[] => phrases.map((phrase) => applyDisplayNameToPhrase(phrase, displayName));

export const applyDisplayNameToMiniConversations = (
  conversations: MiniConversation[],
  displayName?: string | null
): MiniConversation[] =>
  conversations.map((conversation) => ({
    ...conversation,
    title: applyDisplayName(conversation.title, displayName),
    scene: applyDisplayName(conversation.scene, displayName),
    lines: conversation.lines.map((line) => ({
      ...line,
      english: applyDisplayName(line.english, displayName),
      text: line.text ? applyDisplayName(line.text, displayName) : line.text,
      japanese: applyDisplayName(line.japanese, displayName),
      pinyin: line.pinyin ? applyDisplayName(line.pinyin, displayName) : line.pinyin,
      kana: applyDisplayName(line.kana, displayName),
    })),
  }));
