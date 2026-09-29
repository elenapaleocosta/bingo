import { BingoDeck, PlayerStats } from '../types/bingo';

export const DEFAULT_PHRASES: string[] = [
  "DID YOU KNOOOW",
  "Woman.",
  "Mama a girl behind you",
  "Sbaby",
  "Bang split",
  "I think its a carrot",
  "A cock",
  "Kittyyyy",
  "Kiss kiss?",
  "YYYEEESSS",
  "Car vroom vroom",
  "Ιντερμπιτ του κερατά",
  "Σμπουμπι",
  "Μέλανιιιι"
];

export const INITIAL_DECK: BingoDeck = {
  id: 'default-deck',
  name: "Amalia's deck",
  phrases: DEFAULT_PHRASES,
  createdAt: Date.now(),
  isCustom: false
};

export const DEFAULT_STATS: PlayerStats = {
  score: 0,
  xp: 0,
  level: 1,
  bingosCount: 0,
  tilesStamped: 0,
  gamesPlayed: 0,
  currentStreak: 1,
  selectedStamp: '/assets/stickers/miffy/jpg_10_.png'
};

const PHRASES_KEY = 'bingo_amalia_phrases_v1';
const DECKS_KEY = 'bingo_amalia_decks_v1';
const STATS_KEY = 'bingo_amalia_stats_v1';

export function getStoredPhrases(): string[] {
  try {
    const raw = localStorage.getItem(PHRASES_KEY);
    if (!raw) return DEFAULT_PHRASES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PHRASES;
  } catch {
    return DEFAULT_PHRASES;
  }
}

export function saveStoredPhrases(phrases: string[]): void {
  try {
    localStorage.setItem(PHRASES_KEY, JSON.stringify(phrases));
  } catch (e) {
    console.error('Error saving phrases', e);
  }
}

export function getStoredDecks(): BingoDeck[] {
  try {
    const raw = localStorage.getItem(DECKS_KEY);
    if (!raw) return [INITIAL_DECK];
    const parsed: BingoDeck[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure default deck is named "Amalia's deck"
      return parsed.map(d => d.id === 'default-deck' ? { ...d, name: "Amalia's deck" } : d);
    }
    return [INITIAL_DECK];
  } catch {
    return [INITIAL_DECK];
  }
}

export function saveStoredDecks(decks: BingoDeck[]): void {
  try {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  } catch (e) {
    console.error('Error saving decks', e);
  }
}

export function getStoredStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStoredStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats', e);
  }
}

// XP needed per level formula: 150 * current_level
export function getRequiredXP(level: number): number {
  return level * 150;
}
