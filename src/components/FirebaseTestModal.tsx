import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { testFirebaseConnection } from '../firebase';

interface FirebaseTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseTestModal: React.FC<FirebaseTestModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; id?: string; data?: any; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setLoading(true);
    setResult(null);
    const res = await testFirebaseConnection();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-pastel-border shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pastel-border bg-pastel-cream">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-300">
              <Database className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-pastel-text">Firebase Firestore Test</h2>
              <p className="text-xs text-pastel-muted">Verify Firestore document write & read connection</p>
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
        <div className="p-6 space-y-4 bg-pastel-cream/30">
          
          <div className="p-4 bg-white rounded-2xl border border-pastel-border shadow-sm text-xs text-pastel-text space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Project ID: amaliasbingo</span>
            </div>
            <p className="text-pastel-muted">
              Clicking below will write a dummy <strong>bingo_games</strong> document to your Firestore database and immediately read it back.
            </p>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-miffy-orange to-snoopy-softRed hover:opacity-95 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting to Firestore...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>Run Firestore Write & Read Test</span>
              </>
            )}
          </button>

          {result && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-pop ${
              result.success 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {result.success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Firestore Connection Verified! 🎉</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>Connection Failed</span>
                  </>
                )}
              </div>

              {result.success ? (
                <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-emerald-200">
                  <p><strong>Created Document ID:</strong> <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">{result.id}</code></p>
                  <p><strong>Read Document Data:</strong></p>
                  <pre className="text-[10px] bg-emerald-100/50 p-2 rounded-lg overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="bg-white/70 p-3 rounded-xl border border-rose-200">
                  {result.error}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-pastel-border bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-miffy-orange hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl transition shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
