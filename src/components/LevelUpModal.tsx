import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  totalScore: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  totalScore
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();
      
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F7B05B', '#E86A58', '#90E0EF', '#C1E1C1', '#FFD6BA']
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-pop">
      <div className="bg-white w-full max-w-md rounded-3xl border-4 border-miffy-orange shadow-2xl overflow-hidden text-center p-6 relative">
        
        {/* Decorative Top Banner Art */}
        <div className="flex justify-center -mt-2 mb-2">
          <img 
            src="/assets/stickers/snoopy_and_miffy/jpg_12_.png" 
            alt="Snoopy & Miffy Celebration" 
            className="w-32 h-32 object-contain animate-bounce-slow"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>LEVEL UP!</span>
        </div>

        <h2 className="text-3xl font-extrabold text-pastel-text mb-1">
          Congratulations! 🎉
        </h2>

        <p className="text-sm font-semibold text-pastel-muted mb-4">
          You've reached <span className="text-amber-800 font-extrabold text-base">Level {newLevel}</span>!
        </p>

        {/* Level Stats Badge */}
        <div className="bg-pastel-cream p-4 rounded-2xl border border-pastel-border mb-5 flex justify-around items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-pastel-muted tracking-wider block">New Level</span>
            <span className="text-2xl font-extrabold text-miffy-orange leading-none">{newLevel}</span>
          </div>

          <div className="h-8 w-px bg-pastel-border" />

          <div>
            <span className="text-[10px] uppercase font-bold text-pastel-muted tracking-wider block">Total Points</span>
            <span className="text-2xl font-extrabold text-emerald-600 leading-none">{totalScore.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-miffy-orange to-snoopy-softRed hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 card-pop"
        >
          <span>Keep Playing</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
