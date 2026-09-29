import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Layers, FileText, Sparkles } from 'lucide-react';
import { BingoDeck } from '../types/bingo';

interface CardManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrases: string[];
  onAddPhrase: (phrase: string) => void;
  onDeletePhrase: (phrase: string) => void;
  decks: BingoDeck[];
  activeDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onCreateDeck: (name: string, selectedPhrases: string[]) => void;
  onDeleteDeck: (deckId: string) => void;
}

export const CardManagerModal: React.FC<CardManagerModalProps> = ({
  isOpen,
  onClose,
  phrases,
  onAddPhrase,
  onDeletePhrase,
  decks,
  activeDeckId,
  onSelectDeck,
  onCreateDeck,
  onDeleteDeck
}) => {
  const [activeTab, setActiveTab] = useState<'phrases' | 'decks' | 'new_deck'>('phrases');
  const [newPhraseText, setNewPhraseText] = useState('');
  
  // New deck creation state
  const [newDeckName, setNewDeckName] = useState('');
  const [selectedPhrasesForDeck, setSelectedPhrasesForDeck] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddPhraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhraseText.trim()) return;
    onAddPhrase(newPhraseText.trim());
    setNewPhraseText('');
  };

  const togglePhraseSelection = (p: string) => {
    if (selectedPhrasesForDeck.includes(p)) {
      setSelectedPhrasesForDeck(selectedPhrasesForDeck.filter(item => item !== p));
    } else {
      setSelectedPhrasesForDeck([...selectedPhrasesForDeck, p]);
    }
  };

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim() || selectedPhrasesForDeck.length === 0) return;
    onCreateDeck(newDeckName.trim(), selectedPhrasesForDeck);
    setNewDeckName('');
    setSelectedPhrasesForDeck([]);
    setActiveTab('decks');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-2xl rounded-3xl border-2 border-pastel-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pastel-border bg-pastel-cream">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-miffy-softOrange/40 rounded-xl border border-miffy-orange/40">
              <Layers className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-pastel-text">Cards & Phrase Manager</h2>
              <p className="text-xs text-pastel-muted">Add new phrases, build custom bingo cards & select decks</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-pastel-border bg-white px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('phrases')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'phrases' 
                ? 'border-miffy-orange text-amber-900' 
                : 'border-transparent text-pastel-muted hover:text-pastel-text'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Phrase Library ({phrases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('decks')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'decks' 
                ? 'border-miffy-orange text-amber-900' 
                : 'border-transparent text-pastel-muted hover:text-pastel-text'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bingo Decks ({decks.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedPhrasesForDeck([...phrases]);
              setActiveTab('new_deck');
            }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'new_deck' 
                ? 'border-miffy-orange text-amber-900' 
                : 'border-transparent text-pastel-muted hover:text-pastel-text'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Card Deck</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-pastel-cream/50">
          
          {/* TAB 1: PHRASE LIBRARY */}
          {activeTab === 'phrases' && (
            <div className="space-y-4">
              <form onSubmit={handleAddPhraseSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter a new phrase (e.g. 'Snoopy dance time!')"
                  value={newPhraseText}
                  onChange={(e) => setNewPhraseText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-pastel-border rounded-xl text-sm focus:outline-none focus:border-miffy-orange shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!newPhraseText.trim()}
                  className="flex items-center gap-1 px-4 py-2.5 bg-miffy-orange hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Phrase</span>
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {phrases.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-pastel-border rounded-xl shadow-sm hover:border-miffy-orange/40 transition"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-pastel-text pr-2">
                      {p}
                    </span>
                    <button
                      onClick={() => onDeletePhrase(p)}
                      className="p-1 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500 transition"
                      title="Delete Phrase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DECKS LIST */}
          {activeTab === 'decks' && (
            <div className="space-y-3">
              {decks.map((deck) => {
                const isActive = deck.id === activeDeckId;
                return (
                  <div
                    key={deck.id}
                    className={`p-4 rounded-2xl border-2 transition flex items-center justify-between gap-3 ${
                      isActive 
                        ? 'bg-amber-50/80 border-miffy-orange shadow-md' 
                        : 'bg-white border-pastel-border hover:border-amber-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-pastel-text">{deck.name}</h3>
                        {isActive && (
                          <span className="bg-miffy-orange text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-pastel-muted mt-1">
                        Contains {deck.phrases.length} phrases
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          onClick={() => onSelectDeck(deck.id)}
                          className="px-3 py-1.5 bg-miffy-orange hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow-sm"
                        >
                          Select
                        </button>
                      )}
                      {deck.isCustom && (
                        <button
                          onClick={() => onDeleteDeck(deck.id)}
                          className="p-2 hover:bg-rose-50 rounded-xl text-gray-400 hover:text-rose-500 transition"
                          title="Delete Custom Deck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: CREATE NEW DECK */}
          {activeTab === 'new_deck' && (
            <form onSubmit={handleCreateDeckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-pastel-muted uppercase tracking-wider mb-1.5">
                  Deck Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amalia's Special Weekend Deck"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-pastel-border rounded-xl text-sm focus:outline-none focus:border-miffy-orange shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-pastel-muted uppercase tracking-wider">
                    Select Phrases for this Card ({selectedPhrasesForDeck.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSelectedPhrasesForDeck(selectedPhrasesForDeck.length === phrases.length ? [] : [...phrases])}
                    className="text-xs text-amber-700 font-bold hover:underline"
                  >
                    {selectedPhrasesForDeck.length === phrases.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                  {phrases.map((p, idx) => {
                    const isSelected = selectedPhrasesForDeck.includes(p);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => togglePhraseSelection(p)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                          isSelected 
                            ? 'bg-amber-100/80 border-miffy-orange text-amber-900 font-bold' 
                            : 'bg-white border-pastel-border text-pastel-text hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate pr-2">{p}</span>
                        {isSelected && <Check className="w-4 h-4 text-miffy-orange shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-pastel-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('decks')}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-pastel-text text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDeckName.trim() || selectedPhrasesForDeck.length === 0}
                  className="px-5 py-2.5 bg-miffy-orange hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition shadow-sm"
                >
                  Save & Create Card
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
