import React, { useState, useRef, useEffect } from 'react';
import { Mic, RefreshCw, Volume2, ChevronRight, ChevronLeft, BookOpen, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRACTICE_SENTENCES, generateSimulationResult } from '../services/mockData';
import { DataService } from '../services/storage';
import { AttemptResult, User } from '../types';
import PronunciationGuide from './PronunciationGuide';

interface PracticeAreaProps {
  user: User;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ user }) => {
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [recognizedWordIndex, setRecognizedWordIndex] = useState<number>(-1);
  
  // Refs for speech recognition and timing
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const recordingStartTimeRef = useRef<number>(0);
  const recordingTimeoutRef = useRef<number | null>(null);
  const hasSpeechSupport = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Filter sentences based on selection
  const filteredSentences = PRACTICE_SENTENCES.filter(s => filter === 'All' || s.difficulty === filter);
  const currentSentence = filteredSentences[currentIndex];
  
  // Reset index and result when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setResult(null);
    setError(null);
    setRecognizedWordIndex(-1);
  }, [filter]);

  // Reset recognition index when sentence changes via navigation
  useEffect(() => {
      setRecognizedWordIndex(-1);
  }, [currentIndex]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (hasSpeechSupport) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcriptRef.current += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Real-time matching logic
        const fullTranscript = (transcriptRef.current + " " + interimTranscript).toLowerCase();
        // Split target sentence into words, removing punctuation
        const targetWords = currentSentence.text.toLowerCase().replace(/[.,?!=]/g, '').split(/\s+/);
        
        let lastMatchIndex = -1;
        let searchPos = 0;
        
        // Check for sequential matches of target words in the transcript
        targetWords.forEach((word, index) => {
            const foundIndex = fullTranscript.indexOf(word, searchPos);
            if (foundIndex !== -1) {
                lastMatchIndex = index;
                // Move search position forward to ensure order
                searchPos = foundIndex + word.length;
            }
        });
        
        setRecognizedWordIndex(lastMatchIndex);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
           // Handled in stop logic
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [hasSpeechSupport, currentSentence]);

  const handleStartRecording = () => {
    if (isRecording) return; // Prevent multiple triggers
    
    setError(null);
    setResult(null);
    setRecognizedWordIndex(-1);
    transcriptRef.current = '';
    recordingStartTimeRef.current = Date.now();
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }
    
    // Simulate recording duration limit (e.g. 10 seconds max)
    recordingTimeoutRef.current = window.setTimeout(() => {
      handleStopRecording();
    }, 10000);
  };

  const handleStopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }

    if (!isRecording) return;

    // Stop recognition
    if (recognitionRef.current) {
       try {
         recognitionRef.current.stop();
       } catch (e) {
         console.error(e);
       }
    }

    setIsRecording(false);
    
    const duration = Date.now() - recordingStartTimeRef.current;

    // Slight delay to allow final recognition results to bubble up
    setTimeout(() => {
       const hasTranscript = transcriptRef.current.trim().length > 0;
       const isTooShort = duration < 800; 

       if (hasSpeechSupport) {
          if (!hasTranscript) {
             setError("No speech detected. Please speak clearly into the microphone.");
             return;
          }
       } else {
          if (isTooShort) {
             setError("Recording too short. Please hold the button while speaking.");
             return;
          }
       }

       finishProcessing();
    }, 500);
  };

  const finishProcessing = () => {
    setIsProcessing(true);
    
    setTimeout(async () => {
      setIsProcessing(false);
      if (currentSentence) {
        // Pass the actual transcript to the simulation generator for better accuracy simulation
        const simulatedResult = generateSimulationResult(currentSentence.text, transcriptRef.current);
        setResult(simulatedResult);
        
        await DataService.saveSession(user.id, simulatedResult, currentSentence.text);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !isRecording) {
        e.preventDefault();
        handleStartRecording();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && isRecording) {
        e.preventDefault();
        handleStopRecording();
    }
  };

  const handlePlayNative = () => {
    if (!currentSentence) return;
    const utterance = new SpeechSynthesisUtterance(currentSentence.text);
    utterance.lang = 'en-GB'; 
    window.speechSynthesis.speak(utterance);
  };

  const handleRetry = () => {
    setResult(null);
    setError(null);
    setRecognizedWordIndex(-1);
  };

  const handleNext = () => {
    if (currentIndex < filteredSentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setResult(null);
      setError(null);
      setRecognizedWordIndex(-1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setResult(null);
      setError(null);
      setRecognizedWordIndex(-1);
    }
  };

  const getErrorBadgeStyle = (type?: string) => {
    switch (type) {
      case 'Placement': return 'bg-red-50 text-red-700 border-red-200';
      case 'Articulation': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Voicing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Timing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Stress': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!currentSentence && filteredSentences.length === 0) {
     return (
        <div className="space-y-8 max-w-3xl mx-auto p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100" role="alert">
           <h3 className="text-lg font-medium text-gray-900">No sentences found</h3>
           <button 
             onClick={() => setFilter('All')}
             className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
           >
             Show All Levels
           </button>
        </div>
     );
  }

  return (
    <>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Navigation & Guide Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
             <div className="w-full lg:w-auto bg-gray-100 p-1 rounded-lg flex overflow-x-auto no-scrollbar" role="tablist" aria-label="Difficulty Filter">
                {['All', 'Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    role="tab"
                    aria-selected={filter === level}
                    onClick={() => setFilter(level as any)}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                      filter === level
                        ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    {level === 'All' ? 'All Levels' : level}
                  </button>
                ))}
             </div>

             <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                 <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100">
                    <button 
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className={`p-1.5 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 ${currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:text-teal-700 hover:shadow-sm'}`}
                      title="Previous Phrase"
                      aria-label="Previous Phrase"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest min-w-[70px] text-center select-none" aria-live="polite">
                      {currentIndex + 1} / {filteredSentences.length}
                    </span>

                     <button 
                      onClick={handleNext}
                      disabled={currentIndex === filteredSentences.length - 1}
                      className={`p-1.5 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 ${currentIndex === filteredSentences.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:text-teal-700 hover:shadow-sm'}`}
                      title="Next Phrase"
                      aria-label="Next Phrase"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>

                 <button
                    onClick={() => setShowGuide(true)}
                    className="flex items-center justify-center px-4 py-2 bg-teal-50 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-100 transition-colors border border-teal-100 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    aria-label="Open Pronunciation Guide"
                 >
                    <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                    Guide
                 </button>
             </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100 relative">
          <div className="absolute top-4 right-4">
             <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
               ${currentSentence.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                 currentSentence.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                 'bg-red-100 text-red-700'}`}>
               {currentSentence.difficulty}
             </span>
          </div>
          
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Phrase:</h3>
          <p className="text-xs text-gray-400 mb-6">Focus: {currentSentence.focus}</p>
          
          <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-relaxed flex flex-wrap justify-center gap-2">
            {currentSentence.text.split(' ').map((word, index) => {
              const isRecognized = index <= recognizedWordIndex;
              const isCurrent = index === recognizedWordIndex + 1;
              // Simple check for if we are "in progress" (recording and haven't finished result yet)
              const showLiveFeedback = isRecording;

              return (
                <span 
                  key={index} 
                  className={`transition-all duration-300 rounded px-1
                    ${showLiveFeedback && isRecognized ? 'text-green-600' : ''}
                    ${showLiveFeedback && isCurrent ? 'text-teal-800 bg-teal-50' : ''}
                    ${!showLiveFeedback ? 'text-gray-800' : ''}
                  `}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center min-h-[220px]">
            {!result && !isProcessing && (
              <>
                <button
                  onMouseDown={handleStartRecording}
                  onMouseUp={handleStopRecording}
                  onTouchStart={handleStartRecording}
                  onTouchEnd={handleStopRecording}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  aria-label="Press and hold Space or Enter to record, or click and hold"
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-200 ${
                    isRecording 
                      ? 'bg-red-500 scale-110 shadow-lg listening-pulse' 
                      : 'bg-teal-700 hover:bg-teal-800 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Mic className="w-10 h-10" aria-hidden="true" />
                </button>
                <p className="mt-6 text-gray-500 font-medium animate-fade-in" aria-live="polite">
                  {isRecording ? 'Listening...' : 'Press and hold to speak'}
                </p>
                {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
              </>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center animate-pulse" role="status">
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" aria-hidden="true" />
                </div>
                <p className="text-teal-700 font-medium">Analyzing pronunciation...</p>
              </div>
            )}

            {result && (
              <div className="w-full animate-fade-in">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-700">Detailed Feedback</h4>
                    <div className="flex gap-4" aria-hidden="true">
                       <span className="text-xs flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-green-500"></div> Good</span>
                       <span className="text-xs flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Needs Practice</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center mb-6" role="list" aria-label="Phoneme breakdown">
                    {result.phonemes.map((p) => {
                      const tooltipId = `tooltip-${p.id}`;
                      return (
                      <div key={p.id} className="relative group z-10 hover:z-20 focus-within:z-20">
                        <button
                          type="button"
                          aria-describedby={tooltipId}
                          aria-label={`Phoneme ${p.text}, ${p.isGood ? 'Correct' : `Needs improvement: ${p.errorType}`}`}
                          className={`px-3 py-1 rounded-md text-lg font-medium shadow-sm transition-all block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                            p.isGood 
                              ? 'bg-white border border-green-200 text-green-700 cursor-default' 
                              : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 cursor-help'
                          }`}
                          style={{
                            boxShadow: p.isGood ? '0 1px 2px rgba(34, 197, 94, 0.1)' : '0 1px 2px rgba(251, 146, 60, 0.1)'
                          }}
                        >
                          {p.text}
                          {!p.isGood && (
                            <span className="ml-1 text-xs text-orange-400 align-top" aria-hidden="true">
                              <Info className="inline w-3 h-3" />
                            </span>
                          )}
                        </button>
                        
                        {/* Tooltip for BOTH Good and Needs Practice items */}
                        <div 
                            id={tooltipId}
                            role="tooltip"
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 bg-white text-left rounded-xl shadow-xl border border-gray-200 p-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0"
                        >
                            {p.isGood ? (
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-green-50 text-green-700 border-green-200 mb-2">
                                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                                        Excellent
                                    </span>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Your pronunciation matched the native speaker model accurately.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getErrorBadgeStyle(p.errorType)}`}>
                                            {p.errorType || 'Improvement'}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 font-medium text-sm mb-3">
                                        {p.feedback || "Pronunciation differs from native speaker."}
                                    </p>
                                    
                                    {p.suggestion && (
                                    <div className="bg-teal-50/50 rounded-lg p-3 border border-teal-100/50">
                                        <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-1 h-4 bg-teal-400 rounded-full" aria-hidden="true"></div>
                                        <span className="text-[10px] uppercase font-bold text-teal-700">Suggestion</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                        {p.suggestion}
                                        </p>
                                    </div>
                                    )}
                                </>
                            )}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px border-8 border-transparent border-t-white drop-shadow-sm"></div>
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button 
                      onClick={handlePlayNative}
                      className="flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <Volume2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      Hear Reference
                    </button>
                    <button 
                      onClick={handleRetry}
                      className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                      Try Again
                    </button>
                    {result.accuracy > 70 && currentIndex < filteredSentences.length - 1 && (
                       <button 
                          onClick={handleNext}
                          className="flex items-center px-4 py-2 bg-teal-700 text-white rounded-md text-sm font-medium hover:bg-teal-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Next Phrase
                          <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                        </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50 rounded-xl p-4 flex flex-col items-center justify-center border border-teal-100">
                    <div className="text-3xl font-bold text-teal-700">{result.accuracy}%</div>
                    <div className="text-xs text-teal-600 font-bold uppercase mt-1">Accuracy Score</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200">
                    <div className="text-3xl font-bold text-gray-700">{result.per}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase mt-1">Error Rate (PER)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <PronunciationGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};

export default PracticeArea;