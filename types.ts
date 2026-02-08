export interface PhonemeData {
  id: string;
  text: string;
  isGood: boolean; // true = Green (Good), false = Orange (Needs Practice)
  feedback?: string; // Specific feedback on articulation
  suggestion?: string; // Actionable advice for correction
  errorType?: 'Placement' | 'Timing' | 'Voicing' | 'Stress' | 'Articulation' | 'General';
}

export interface AttemptResult {
  accuracy: number;
  per: number; // Phoneme Error Rate
  phonemes: PhonemeData[];
}

// Updated ActivityItem to match real data needs if used in UI, 
// but primarily we use PracticeSession for storage now.
export interface ActivityItem {
  id: string;
  date: string;
  description: string;
  improvement?: number; 
  scoreLabel: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  date: string; // ISO string
  displayDate: string; // "Oct 28"
  sentenceText: string;
  accuracy: number;
  per: number; // Phoneme Error Rate (0.0 to 1.0)
  phonemes: PhonemeData[];
}

export type ViewState = 'AUTH' | 'DASHBOARD' | 'PRACTICE';

export enum ProblemSound {
  TH = 'th',
  R = 'r',
  V = 'v',
  SCH = 'sch'
}

export interface PracticeSentence {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  focus: string; 
}

export interface PronunciationGuideItem {
  id: string;
  symbol: string;
  name: string;
  articulation: string;
  examples: string[];
}