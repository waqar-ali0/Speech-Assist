import React from 'react';
import { X, Volume2, Play } from 'lucide-react';
import { PRONUNCIATION_GUIDE_DATA } from '../services/mockData';

interface PronunciationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const PronunciationGuide: React.FC<PronunciationGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const playSound = (text: string) => {
    // Cancel any ongoing speech for immediate response
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Use British English as a standard reference, or fall back to browser default
    utterance.lang = 'en-GB'; 
    // Slightly slower rate for clearer articulation details
    utterance.rate = 0.85; 
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Pronunciation Guide</h2>
            <p className="text-sm text-gray-500 mt-1">Master key sounds for better articulation</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6">
          {PRONUNCIATION_GUIDE_DATA.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <span className="bg-teal-50 text-teal-700 text-xl font-bold px-4 py-2 rounded-lg font-mono border border-teal-100">
                    {item.symbol}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => playSound(`${item.name}. ${item.articulation}`)}
                  className="flex items-center gap-2 px-3 py-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-full transition-colors text-xs font-medium"
                  title="Listen to description"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Explain</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    How to articulate
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.articulation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Examples</h4>
                  <div className="flex flex-wrap gap-3">
                    {item.examples.map((ex, idx) => (
                      <div key={idx} className="inline-flex items-center pl-3 pr-1 py-1 bg-white border border-gray-200 rounded-full shadow-sm hover:border-teal-200 transition-colors">
                        <span className="text-sm font-medium text-gray-700 mr-2">{ex}</span>
                        <button 
                          onClick={() => playSound(ex)}
                          className="p-1.5 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
                          title={`Play pronunciation of "${ex}"`}
                          aria-label={`Play pronunciation of ${ex}`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default PronunciationGuide;