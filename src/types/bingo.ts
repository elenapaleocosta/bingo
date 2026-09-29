export interface BingoTile {
  id: string;
  phrase: string;
  isMarked: boolean;
  isFreeSpace?: boolean;
  row: number;
  col: number;
}

export interface BingoDeck {
  id: string;
  name: string;
  phrases: string[];
  createdAt: number;
  isCustom?: boolean;
}

export interface PlayerStats {
  score: number;
  xp: number;
  level: number;
  bingosCount: number;
  tilesStamped: number;
  gamesPlayed: number;
  currentStreak: number;
  selectedStamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtLevel: number;
  isUnlocked: boolean;
}

export interface StickerManifest {
  snoopy: string[];
  miffy: string[];
  snoopy_and_miffy: string[];
}
