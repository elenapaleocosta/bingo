import React from 'react';
import { X, Award, Flame, CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import { PlayerStats } from '../types/bingo';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onResetXP: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, onResetXP }) => {
  if (!isOpen) return null;

  const achievements = [
    { level: 1, title: "Snoopy's Nap Buddy", desc: "Started your single player bingo journey!", icon: "🐶" },
    { level: 2, title: "Miffy's Garden Helper", desc: "Reached Level 2 and earned your first bonus points!", icon: "🐰" },
    { level: 3, title: "Carrot Cruncher", desc: "Mastered 3x3 and 4x4 card grids!", icon: "🥕" },
    { level: 5, title: "Bingo Superstar", desc: "Scored multiple Bingos with Snoopy & Miffy!", icon: "⭐" },
    { level: 10, title: "Grand Master", desc: "Achieved Level 10 status!", icon: "👑" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-xl rounded-3xl border-2 border-pastel-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pastel-border bg-pastel-cream">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-300">
              <Award className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-pastel-text">Player Profile & Stats</h2>
              <p className="text-xs text-pastel-muted">Track your points, level achievements & scoring rules</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-pastel-cream/40">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-pastel-border shadow-sm text-center">
              <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-wider block">Level</span>
              <span className="text-xl font-extrabold text-amber-800">{stats.level}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-pastel-border shadow-sm text-center">
              <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-wider block">Total Points</span>
              <span className="text-xl font-extrabold text-emerald-600">{stats.score.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-pastel-border shadow-sm text-center">
              <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-wider block">Bingos Scored</span>
              <span className="text-xl font-extrabold text-snoopy-softRed">{stats.bingosCount}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-pastel-border shadow-sm text-center">
              <span className="text-[10px] font-bold text-pastel-muted uppercase tracking-wider block">Tiles Stamped</span>
              <span className="text-xl font-extrabold text-snoopy-dark">{stats.tilesStamped}</span>
            </div>
          </div>

          {/* Level Badges */}
          <div>
            <h3 className="text-xs font-bold text-pastel-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Level Badges & Unlocks</span>
            </h3>

            <div className="space-y-2">
              {achievements.map((ach) => {
                const isUnlocked = stats.level >= ach.level;
                return (
                  <div
                    key={ach.level}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      isUnlocked 
                        ? 'bg-white border-miffy-orange/50 shadow-sm' 
                        : 'bg-gray-100/60 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 bg-amber-50 rounded-xl border border-amber-200">
                        {ach.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-pastel-text">{ach.title}</h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pastel-cream text-pastel-muted border border-pastel-border">
                            Lvl {ach.level}
                          </span>
                        </div>
                        <p className="text-xs text-pastel-muted">{ach.desc}</p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400 shrink-0">Locked</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Point System Rules */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-miffy-orange/40">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>How Points & Leveling Work</span>
            </h3>
            <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
              <li><strong>Tile Stamp:</strong> +10 Points & +10 XP per tile stamped.</li>
              <li><strong>Instant BINGO:</strong> Every selected card is a BINGO! Earn bonus points & XP for every card selected!</li>
              <li><strong>Full House BINGO:</strong> +500 Bonus Points & +500 XP when every card on your board is stamped!</li>
              <li>Leveling up fills your XP meter and triggers celebrations with new sticker badge unlocks!</li>
            </ul>
          </div>

        </div>

        {/* Footer with Reset XP Button */}
        <div className="p-4 border-t border-pastel-border bg-white flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Reset your XP count and level back to 0?')) {
                onResetXP();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset XP & Stats</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-miffy-orange hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl transition shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
