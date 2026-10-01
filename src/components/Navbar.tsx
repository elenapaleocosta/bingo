import React from 'react';
import { Sparkles, Layers, Image as ImageIcon, Award, Volume2, VolumeX, RotateCcw, Database } from 'lucide-react';
import { PlayerStats } from '../types/bingo';
import { getRequiredXP } from '../utils/storage';

interface NavbarProps {
  stats: PlayerStats;
  onOpenCardManager: () => void;
  onOpenStickerGallery: () => void;
  onOpenStats: () => void;
  onOpenFirebaseTest: () => void;
  onResetXP: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  onOpenCardManager,
  onOpenStickerGallery,
  onOpenStats,
  onOpenFirebaseTest,
  onResetXP,
  soundEnabled,
  onToggleSound
}) => {
  const reqXP = getRequiredXP(stats.level);
  const xpPercent = Math.min(100, Math.round((stats.xp / reqXP) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-pastel-border shadow-sm">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-miffy-softOrange/40 rounded-xl sm:rounded-2xl border border-miffy-orange/40 shadow-inner overflow-hidden shrink-0">
            <img 
              src="/assets/stickers/snoopy_and_miffy/jpg_13_.png" 
              alt="Snoopy & Miffy" 
              className="w-7 h-7 sm:w-9 sm:h-9 object-contain animate-float"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-bold text-base sm:text-xl text-pastel-text tracking-tight font-sans">
                Snoopy <span className="text-snoopy-softRed">&</span> Miffy
              </h1>
              <span className="bg-miffy-orange/20 text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded-full text-amber-800 border border-miffy-orange/30">
                Bingo
              </span>
            </div>
          </div>
        </div>

        {/* Level & XP Meter */}
        <div className="flex items-center gap-2 sm:gap-3 bg-pastel-cream px-2.5 py-1 sm:py-1.5 rounded-xl border border-pastel-border shadow-inner">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-snoopy-dark">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse" />
              <span>Lvl {stats.level}</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-pastel-muted font-semibold">
              {stats.xp}/{reqXP} XP
            </span>
          </div>

          <div className="w-14 xs:w-20 sm:w-28 bg-gray-200 h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border border-gray-300">
            <div 
              className="bg-gradient-to-r from-miffy-orange to-snoopy-softRed h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          <div className="text-right pl-2 border-l border-pastel-border">
            <span className="text-[9px] uppercase tracking-wider text-pastel-muted font-bold block leading-none">Pts</span>
            <span className="font-extrabold text-xs sm:text-base text-amber-700 leading-none">
              {stats.score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenFirebaseTest}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition active:scale-95"
            title="Test Firebase Firestore Connection"
          >
            <Database className="w-4 h-4 text-amber-600" />
            <span className="hidden lg:inline">Firebase</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset your XP count and Level back to 0?')) {
                onResetXP();
              }
            }}
            className="flex items-center gap-1 px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition active:scale-95"
            title="Reset your XP count & Level"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset XP</span>
          </button>

          <button
            onClick={onOpenCardManager}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-miffy-softOrange/20 border border-pastel-border rounded-xl text-xs font-semibold text-pastel-text transition active:scale-95"
            title="Manage Cards & Phrases"
          >
            <Layers className="w-4 h-4 text-miffy-orange" />
            <span className="hidden sm:inline">Cards</span>
          </button>

          <button
            onClick={onOpenStickerGallery}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-snoopy-softBlue/30 border border-pastel-border rounded-xl text-xs font-semibold text-pastel-text transition active:scale-95"
            title="Stickers & Stamp Choices"
          >
            <ImageIcon className="w-4 h-4 text-snoopy-softRed" />
            <span className="hidden sm:inline">Stickers</span>
          </button>

          <button
            onClick={onOpenStats}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-miffy-softGreen border border-pastel-border rounded-xl text-xs font-semibold text-pastel-text transition active:scale-95"
            title="Player Stats & Badges"
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 bg-white hover:bg-gray-100 border border-pastel-border rounded-xl text-pastel-muted transition active:scale-95"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
