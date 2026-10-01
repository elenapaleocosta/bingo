import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BingoBoard } from './components/BingoBoard';
import { CardManagerModal } from './components/CardManagerModal';
import { StickerGalleryModal } from './components/StickerGalleryModal';
import { LevelUpModal } from './components/LevelUpModal';
import { StatsModal } from './components/StatsModal';
import { FirebaseTestModal } from './components/FirebaseTestModal';
import { BingoTile, BingoDeck, PlayerStats, StickerManifest } from './types/bingo';
import {
  getStoredPhrases,
  saveStoredPhrases,
  getStoredDecks,
  saveStoredDecks,
  getStoredStats,
  saveStoredStats,
  getRequiredXP
} from './utils/storage';
import { soundManager } from './utils/audio';

export const App: React.FC = () => {
  // State
  const [phrases, setPhrases] = useState<string[]>(getStoredPhrases);
  const [decks, setDecks] = useState<BingoDeck[]>(getStoredDecks);
  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id || 'default-deck');
  const [stats, setStats] = useState<PlayerStats>(getStoredStats);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isCardManagerOpen, setIsCardManagerOpen] = useState<boolean>(false);
  const [isStickerGalleryOpen, setIsStickerGalleryOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isFirebaseTestOpen, setIsFirebaseTestOpen] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<{ isOpen: boolean; level: number }>({ isOpen: false, level: 1 });

  // Sticker Manifest
  const [stickerManifest, setStickerManifest] = useState<StickerManifest | null>(null);

  // Load manifest.json
  useEffect(() => {
    fetch('/assets/stickers/manifest.json')
      .then(res => res.json())
      .then(data => setStickerManifest(data))
      .catch(err => console.error('Failed to load sticker manifest:', err));
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    saveStoredPhrases(phrases);
  }, [phrases]);

  useEffect(() => {
    saveStoredDecks(decks);
  }, [decks]);

  useEffect(() => {
    saveStoredStats(stats);
  }, [stats]);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0] || {
    id: 'default',
    name: 'Default Bingo Deck',
    phrases: phrases,
    createdAt: Date.now()
  };

  // Helper to add XP and check level up
  const addXPAndPoints = (xpAmount: number, pointsAmount: number, isBingo = false) => {
    setStats(prev => {
      let newXP = prev.xp + xpAmount;
      let newLevel = prev.level;
      let newPoints = prev.score + pointsAmount;
      let reqXP = getRequiredXP(newLevel);
      let didLevelUp = false;

      while (newXP >= reqXP) {
        newXP -= reqXP;
        newLevel += 1;
        reqXP = getRequiredXP(newLevel);
        didLevelUp = true;
      }

      if (didLevelUp) {
        setLevelUpData({ isOpen: true, level: newLevel });
      }

      return {
        ...prev,
        score: newPoints,
        xp: newXP,
        level: newLevel,
        bingosCount: isBingo ? prev.bingosCount + 1 : prev.bingosCount
      };
    });
  };

  // Handle tile stamp
  const handleTileStamp = (_tile: BingoTile) => {
    setStats(prev => ({
      ...prev,
      tilesStamped: prev.tilesStamped + 1
    }));
    addXPAndPoints(10, 10);
  };

  // Handle BINGO claim
  const handleClaimBingo = (completedLinesCount: number, isFullHouse: boolean) => {
    soundManager.playLine();
    let bonusXP = completedLinesCount * 100;
    let bonusPoints = completedLinesCount * 100;

    if (isFullHouse) {
      bonusXP += 500;
      bonusPoints += 500;
    }

    addXPAndPoints(bonusXP, bonusPoints, true);
  };

  // Handle resetting XP & stats
  const handleResetXP = () => {
    setStats(prev => ({
      ...prev,
      xp: 0,
      level: 1,
      score: 0,
      bingosCount: 0,
      tilesStamped: 0
    }));
  };

  // Handle new phrase addition
  const handleAddPhrase = (newP: string) => {
    if (phrases.includes(newP)) return;
    const updated = [newP, ...phrases];
    setPhrases(updated);

    // Also update default deck phrases if active
    setDecks(prev => prev.map(d => d.id === 'default-deck' ? { ...d, phrases: updated } : d));
  };

  // Handle deleting a phrase
  const handleDeletePhrase = (targetP: string) => {
    const updated = phrases.filter(p => p !== targetP);
    setPhrases(updated);
    setDecks(prev => prev.map(d => ({ ...d, phrases: d.phrases.filter(p => p !== targetP) })));
  };

  // Handle creating custom deck
  const handleCreateDeck = (name: string, selectedPhrases: string[]) => {
    const newDeck: BingoDeck = {
      id: `custom-deck-${Date.now()}`,
      name,
      phrases: selectedPhrases,
      createdAt: Date.now(),
      isCustom: true
    };
    setDecks([...decks, newDeck]);
    setActiveDeckId(newDeck.id);
  };

  // Handle deleting custom deck
  const handleDeleteDeck = (deckId: string) => {
    setDecks(decks.filter(d => d.id !== deckId));
    if (activeDeckId === deckId) {
      setActiveDeckId(decks[0]?.id || 'default-deck');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pastel-bg relative overflow-x-hidden selection:bg-miffy-softOrange">
      
      {/* Navbar */}
      <Navbar
        stats={stats}
        onOpenCardManager={() => setIsCardManagerOpen(true)}
        onOpenStickerGallery={() => setIsStickerGalleryOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenFirebaseTest={() => setIsFirebaseTestOpen(true)}
        onResetXP={handleResetXP}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          soundManager.setEnabled(next);
        }}
      />

      {/* Main Play Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 md:py-8 flex flex-col items-center justify-center relative">
        
        {/* Floating Side Artwork (Background Aesthetics) */}
        <div className="hidden lg:block absolute left-[-60px] top-12 opacity-80 hover:opacity-100 transition animate-float">
          <img 
            src="/assets/stickers/snoopy/snoopy.png" 
            alt="Snoopy Decor" 
            className="w-32 h-32 object-contain drop-shadow-md transform -rotate-6"
          />
        </div>

        <div className="hidden lg:block absolute right-[-60px] top-20 opacity-80 hover:opacity-100 transition animate-float" style={{ animationDelay: '1s' }}>
          <img 
            src="/assets/stickers/miffy/miffy_playing_violin.png" 
            alt="Miffy Violin Decor" 
            className="w-32 h-32 object-contain drop-shadow-md transform rotate-6"
          />
        </div>

        {/* Hero Banner */}
        <div className="text-center mb-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 border border-miffy-orange/40 rounded-full text-xs font-bold text-amber-900 mb-2 shadow-sm">
            <span>✨ Tap phrases to stamp your card & level up!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-pastel-text tracking-tight font-sans">
            Snoopy & Miffy's Phrase Bingo
          </h2>
        </div>

        {/* Interactive Bingo Card Board */}
        <BingoBoard
          currentDeck={activeDeck}
          selectedStamp={stats.selectedStamp}
          onTileStamp={handleTileStamp}
          onClaimBingo={handleClaimBingo}
          onNewGame={() => {
            setStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
          }}
        />

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-pastel-muted border-t border-pastel-border bg-white/60">
        <p>Created with Snoopy & Miffy Theme ❤️ Single Player Edition</p>
      </footer>

      {/* Modals */}
      <CardManagerModal
        isOpen={isCardManagerOpen}
        onClose={() => setIsCardManagerOpen(false)}
        phrases={phrases}
        onAddPhrase={handleAddPhrase}
        onDeletePhrase={handleDeletePhrase}
        decks={decks}
        activeDeckId={activeDeckId}
        onSelectDeck={(id) => setActiveDeckId(id)}
        onCreateDeck={handleCreateDeck}
        onDeleteDeck={handleDeleteDeck}
      />

      <StickerGalleryModal
        isOpen={isStickerGalleryOpen}
        onClose={() => setIsStickerGalleryOpen(false)}
        manifest={stickerManifest}
        selectedStamp={stats.selectedStamp}
        onSelectStamp={(stampUrl) => {
          setStats(prev => ({ ...prev, selectedStamp: stampUrl }));
        }}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetXP={handleResetXP}
      />

      <FirebaseTestModal
        isOpen={isFirebaseTestOpen}
        onClose={() => setIsFirebaseTestOpen(false)}
      />

      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData({ isOpen: false, level: stats.level })}
        newLevel={levelUpData.level}
        totalScore={stats.score}
      />

    </div>
  );
};
