import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { BingoTile, BingoDeck } from '../types/bingo';
import { soundManager } from '../utils/audio';

interface BingoBoardProps {
  currentDeck: BingoDeck;
  selectedStamp: string;
  onTileStamp: (tile: BingoTile) => void;
  onClaimBingo: (completedLinesCount: number, isFullHouse: boolean) => void;
  onNewGame: () => void;
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  currentDeck,
  selectedStamp,
  onTileStamp,
  onClaimBingo,
  onNewGame
}) => {
  // Dynamically compute grid dimensions according to the number of phrases/cards in the deck
  const phraseCount = currentDeck.phrases.length;
  const gridCols = Math.max(3, Math.ceil(Math.sqrt(phraseCount + 1)));
  
  const [tiles, setTiles] = useState<BingoTile[]>([]);
  const [claimedBingoThisBoard, setClaimedBingoThisBoard] = useState(false);

  // Generate a new board when deck changes
  useEffect(() => {
    generateBoard();
  }, [currentDeck]);

  const generateBoard = () => {
    const totalTiles = gridCols * gridCols;
    const phrases = [...currentDeck.phrases];
    
    // Shuffle phrases
    for (let i = phrases.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
    }

    const newTiles: BingoTile[] = [];
    const centerIdx = Math.floor(totalTiles / 2);

    let phraseIdx = 0;
    for (let r = 0; r < gridCols; r++) {
      for (let c = 0; c < gridCols; c++) {
        const idx = r * gridCols + c;
        const isCenter = idx === centerIdx;

        if (isCenter) {
          newTiles.push({
            id: `tile-${r}-${c}`,
            phrase: 'FREE SPACE',
            isMarked: true,
            isFreeSpace: true,
            row: r,
            col: c
          });
        } else {
          const p = phrases[phraseIdx % phrases.length] || `Phrase ${phraseIdx + 1}`;
          phraseIdx++;

          newTiles.push({
            id: `tile-${r}-${c}`,
            phrase: p,
            isMarked: false,
            isFreeSpace: false,
            row: r,
            col: c
          });
        }
      }
    }

    setTiles(newTiles);
    setClaimedBingoThisBoard(false);
  };

  const handleTileClick = (tile: BingoTile) => {
    if (tile.isFreeSpace) return;

    soundManager.playStamp();
    const updated = tiles.map(t => t.id === tile.id ? { ...t, isMarked: !t.isMarked } : t);
    setTiles(updated);
    
    if (!tile.isMarked) {
      onTileStamp(tile);
    }
  };

  const handleResetMarks = () => {
    const updated = tiles.map(t => t.isFreeSpace ? t : { ...t, isMarked: false });
    setTiles(updated);
    setClaimedBingoThisBoard(false);
  };

  // Count marked user tiles (excluding center free space)
  const userMarkedTiles = tiles.filter(t => !t.isFreeSpace && t.isMarked);
  const markedCount = userMarkedTiles.length;
  const isFullHouse = tiles.length > 0 && tiles.every(t => t.isMarked);

  const handleBingoButtonClick = () => {
    if (markedCount === 0 && !isFullHouse) return;
    onClaimBingo(markedCount, isFullHouse);
    setClaimedBingoThisBoard(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      
      {/* Board Controls & Deck Bar */}
      <div className="w-full flex flex-row items-center justify-between gap-2 mb-3 bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-pastel-border shadow-sm">
        
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] sm:text-xs font-bold text-pastel-muted uppercase tracking-wider shrink-0">Deck:</span>
          <span className="text-xs sm:text-sm font-bold text-pastel-text bg-pastel-cream px-2.5 py-1 rounded-xl border border-pastel-border truncate">
            {currentDeck.name} ({phraseCount} cards)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleResetMarks}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-pastel-border rounded-xl transition text-pastel-muted active:scale-95"
            title="Clear all stamps"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>

          <button
            onClick={() => {
              generateBoard();
              onNewGame();
            }}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold px-3 py-1.5 bg-snoopy-softBlue/40 hover:bg-snoopy-softBlue/60 text-snoopy-dark border border-snoopy-blue/50 rounded-xl transition shadow-sm card-pop active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Main Bingo Grid - Dynamically layout according to phrase count */}
      <div 
        className="w-full grid gap-2 sm:gap-3 p-2.5 sm:p-4 bg-white rounded-3xl border-2 border-pastel-border shadow-lg relative"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
        }}
      >
        {tiles.map((tile) => {
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className={`relative aspect-square p-1 sm:p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center select-none overflow-hidden touch-manipulation active:scale-95 ${
                tile.isFreeSpace
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-miffy-orange/60 shadow-md'
                  : tile.isMarked
                  ? 'bg-gradient-to-br from-miffy-softOrange/30 to-snoopy-softRed/20 border-miffy-orange shadow-inner scale-[0.98]'
                  : 'bg-pastel-cream hover:bg-white border-pastel-border hover:border-miffy-orange/40 shadow-sm'
              }`}
            >
              {/* Tile Content */}
              {tile.isFreeSpace ? (
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <img 
                    src="/assets/stickers/snoopy_and_miffy/jpg_14_.png" 
                    alt="Snoopy & Miffy Free Space" 
                    className="w-7 h-7 sm:w-12 sm:h-12 object-contain animate-bounce-slow"
                  />
                  <span className="text-[8px] sm:text-[10px] font-extrabold text-amber-800 tracking-wider">
                    FREE
                  </span>
                </div>
              ) : (
                <span className={`font-semibold text-[10px] xs:text-xs sm:text-sm leading-tight break-words px-0.5 line-clamp-3 ${
                  tile.isMarked ? 'text-amber-900 font-bold' : 'text-pastel-text'
                }`}>
                  {tile.phrase}
                </span>
              )}

              {/* Stamp Overlay when marked */}
              {tile.isMarked && !tile.isFreeSpace && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] animate-pop">
                  <img 
                    src={selectedStamp} 
                    alt="Stamp" 
                    className="w-8 h-8 sm:w-12 sm:h-12 object-contain drop-shadow-md transform -rotate-6"
                  />
                  <CheckCircle2 className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 bg-white rounded-full shadow" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* BINGO Claim Banner - Every selected card is a BINGO! */}
      <div className="w-full mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 p-3 sm:p-4 rounded-2xl border border-miffy-orange/30 shadow-md">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-sm border border-miffy-orange/30 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-spin" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-base text-amber-900 leading-snug">
              {markedCount > 0 
                ? `🎉 BINGO! (${markedCount} Card${markedCount > 1 ? 's' : ''} Selected)` 
                : 'Select any card for a BINGO!'}
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-700">
              {isFullHouse 
                ? '🌟 ALL CARDS SELECTED - FULL HOUSE BINGO!' 
                : markedCount > 0 
                ? 'Every selected card is a BINGO! Tap to claim points.' 
                : 'Tap phrase cards to select them & earn your points.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleBingoButtonClick}
          disabled={markedCount === 0 && !isFullHouse}
          className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-base transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
            markedCount > 0 || isFullHouse
              ? 'bg-gradient-to-r from-miffy-orange to-snoopy-softRed text-white hover:scale-105 animate-bounce-slow'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
          }`}
        >
          <span>{claimedBingoThisBoard ? 'Claimed! ✨' : 'CLAIM BINGO!'}</span>
        </button>
      </div>

    </div>
  );
};
