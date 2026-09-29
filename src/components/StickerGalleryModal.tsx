import React, { useState } from 'react';
import { X, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import { StickerManifest } from '../types/bingo';

interface StickerGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifest: StickerManifest | null;
  selectedStamp: string;
  onSelectStamp: (stampUrl: string) => void;
}

export const StickerGalleryModal: React.FC<StickerGalleryModalProps> = ({
  isOpen,
  onClose,
  manifest,
  selectedStamp,
  onSelectStamp
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'snoopy' | 'miffy' | 'snoopy_and_miffy'>('all');

  if (!isOpen || !manifest) return null;

  const allStickers = [
    ...manifest.snoopy.map(s => ({ src: s, category: 'snoopy', title: 'Snoopy' })),
    ...manifest.miffy.map(s => ({ src: s, category: 'miffy', title: 'Miffy' })),
    ...manifest.snoopy_and_miffy.map(s => ({ src: s, category: 'snoopy_and_miffy', title: 'Snoopy & Miffy' }))
  ];

  const filteredStickers = activeCategory === 'all' 
    ? allStickers 
    : allStickers.filter(s => s.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-3xl rounded-3xl border-2 border-pastel-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pastel-border bg-pastel-cream">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-snoopy-softRed/30 rounded-xl border border-snoopy-red/30">
              <ImageIcon className="w-5 h-5 text-snoopy-red" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-pastel-text">Snoopy & Miffy Sticker Gallery</h2>
              <p className="text-xs text-pastel-muted">Select any reference picture to use as your Bingo tile stamp!</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex border-b border-pastel-border bg-white px-5 py-3 gap-2 overflow-x-auto">
          {[
            { id: 'all', label: `All Stickers (${allStickers.length})` },
            { id: 'snoopy', label: `Snoopy (${manifest.snoopy.length})` },
            { id: 'miffy', label: `Miffy (${manifest.miffy.length})` },
            { id: 'snoopy_and_miffy', label: `Together (${manifest.snoopy_and_miffy.length})` }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-snoopy-softRed text-white shadow-sm'
                  : 'bg-pastel-cream text-pastel-text hover:bg-gray-100 border border-pastel-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of Transparent Stickers */}
        <div className="p-5 overflow-y-auto flex-1 bg-pastel-cream/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredStickers.map((sticker, idx) => {
              const isSelected = sticker.src === selectedStamp;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectStamp(sticker.src)}
                  className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 card-pop overflow-hidden ${
                    isSelected 
                      ? 'bg-amber-50 border-miffy-orange shadow-md scale-105' 
                      : 'bg-white border-pastel-border hover:border-snoopy-softRed/60 shadow-sm'
                  }`}
                >
                  {/* Checkerboard background simulation for transparency check */}
                  <div className="w-24 h-24 flex items-center justify-center relative rounded-xl p-1 bg-gradient-to-br from-gray-50 to-amber-50/30">
                    <img 
                      src={sticker.src} 
                      alt={sticker.title} 
                      className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-110 transition duration-300"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-pastel-text text-center capitalize">
                    {sticker.title} #{idx + 1}
                  </span>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-miffy-orange text-white p-1 rounded-full shadow-md animate-pop">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-pastel-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-pastel-muted">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Click any sticker above to instantly change your active tile stamp!</span>
          </div>
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
