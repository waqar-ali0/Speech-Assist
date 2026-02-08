import { AttemptResult, PhonemeData, PracticeSentence, PronunciationGuideItem } from '../types';

// NOTE: User activity data has been removed in favor of the real database in storage.ts
// Only static content (Curriculum) remains here.

export const PRACTICE_SENTENCES: PracticeSentence[] = [
  // --- EASY LEVEL ---
  {
    id: 'e1',
    text: "Hello, how are you today?",
    difficulty: "Easy",
    focus: "Basic greeting"
  },
  {
    id: 'e2',
    text: "The sun is shining bright outside.",
    difficulty: "Easy",
    focus: "Simple vowels"
  },
  {
    id: 'e3',
    text: "I like to eat apples and bananas.",
    difficulty: "Easy",
    focus: "Common fruits"
  },
  {
    id: 'e4',
    text: "My cat sleeps on the warm bed.",
    difficulty: "Easy",
    focus: "Short vowels"
  },
  {
    id: 'e5',
    text: "Can you open the door please?",
    difficulty: "Easy",
    focus: "Polite request"
  },
  {
    id: 'e6',
    text: "It is time to go home now.",
    difficulty: "Easy",
    focus: "Basic time"
  },
  {
    id: 'e7',
    text: "She has a red pen on her desk.",
    difficulty: "Easy",
    focus: "Colors and location"
  },
  {
    id: 'e8',
    text: "We play football in the park.",
    difficulty: "Easy",
    focus: "Action verbs"
  },
  {
    id: 'e9',
    text: "The dog runs very fast.",
    difficulty: "Easy",
    focus: "Simple subject-verb"
  },
  {
    id: 'e10',
    text: "One, two, three, four, five.",
    difficulty: "Easy",
    focus: "Numbers"
  },
  {
    id: 'e11',
    text: "Do you have a map?",
    difficulty: "Easy",
    focus: "Simple question"
  },
  {
    id: 'e12',
    text: "The bus stop is near here.",
    difficulty: "Easy",
    focus: "Directions"
  },

  // --- MEDIUM LEVEL ---
  {
    id: 'm1',
    text: "Please visit the Ulster University campus tomorrow.",
    difficulty: "Medium",
    focus: "General fluency"
  },
  {
    id: 'm2',
    text: "The rain in Spain stays mainly in the plain.",
    difficulty: "Medium",
    focus: "ai diphthong"
  },
  {
    id: 'm3',
    text: "I would like a large cup of coffee with milk.",
    difficulty: "Medium",
    focus: "Ordering"
  },
  {
    id: 'm4',
    text: "Yesterday, I went to the cinema with my friends.",
    difficulty: "Medium",
    focus: "Past tense"
  },
  {
    id: 'm5',
    text: "The quick brown fox jumps over the lazy dog.",
    difficulty: "Medium",
    focus: "All alphabets"
  },
  {
    id: 'm6',
    text: "Red lorry, yellow lorry, red lorry, yellow lorry.",
    difficulty: "Medium",
    focus: "r and l distinction"
  },
  {
    id: 'm7',
    text: "I saw Susie sitting in a shoeshine shop.",
    difficulty: "Medium",
    focus: "s and sh alternation"
  },
  {
    id: 'm8',
    text: "A proper cup of coffee from a proper copper coffee pot.",
    difficulty: "Medium",
    focus: "p, k and f sounds"
  },
  {
    id: 'm9',
    text: "Could you tell me the way to the central library?",
    difficulty: "Medium",
    focus: "Polite questions"
  },
  {
    id: 'm10',
    text: "This weather is quite unpredictable for the season.",
    difficulty: "Medium",
    focus: "Vocabulary"
  },
  {
    id: 'm11',
    text: "He parked his car in the yard not far from the park.",
    difficulty: "Medium",
    focus: "R control (ar)"
  },
  {
    id: 'm12',
    text: "Measure the pleasure of the treasure.",
    difficulty: "Medium",
    focus: "zh sound"
  },
  {
    id: 'm13',
    text: "Think about the three things you need.",
    difficulty: "Medium",
    focus: "th sound"
  },
  {
    id: 'm14',
    text: "Very few vets visit the village.",
    difficulty: "Medium",
    focus: "v sound"
  },

  // --- HARD LEVEL ---
  {
    id: 'h1',
    text: "She sells seashells by the seashore.",
    difficulty: "Hard",
    focus: "s and sh sounds"
  },
  {
    id: 'h2',
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    difficulty: "Hard",
    focus: "w and ch sounds"
  },
  {
    id: 'h3',
    text: "Peter Piper picked a peck of pickled peppers.",
    difficulty: "Hard",
    focus: "p sound (plosive)"
  },
  {
    id: 'h4',
    text: "Thirty-three thousand thirsty thunderbolts thudded through the thicket.",
    difficulty: "Hard",
    focus: "th sound"
  },
  {
    id: 'h5',
    text: "The sixth sick sheik's sixth sheep's sick.",
    difficulty: "Hard",
    focus: "Complex clusters"
  },
  {
    id: 'h6',
    text: "Unique New York, you know you need unique New York.",
    difficulty: "Hard",
    focus: "y, n, k sounds"
  },
  {
    id: 'h7',
    text: "Rory the warrior and Roger the worrier were reared wrongly in a rural brewery.",
    difficulty: "Hard",
    focus: "r and w sounds"
  },
  {
    id: 'h8',
    text: "Which wristwatches are Swiss wristwatches?",
    difficulty: "Hard",
    focus: "w, s, ch clusters"
  },
  {
    id: 'h9',
    text: "Betty Botter bought some butter but she said the butter's bitter.",
    difficulty: "Hard",
    focus: "b, t (flap t)"
  },
  {
    id: 'h10',
    text: "Lesser leather never weathered wetter weather better.",
    difficulty: "Hard",
    focus: "l, th, w, r"
  },
  {
    id: 'h11',
    text: "If a dog chews shoes, whose shoes does he choose?",
    difficulty: "Hard",
    focus: "ch, sh, z"
  },
  {
    id: 'h12',
    text: "Fred fed Ted bread and Ted fed Fred bread.",
    difficulty: "Hard",
    focus: "Short e, d, r"
  }
];

export const PRONUNCIATION_GUIDE_DATA: PronunciationGuideItem[] = [
  {
    id: 'th-unvoiced',
    symbol: '/θ/',
    name: 'Unvoiced TH',
    articulation: 'Place the tip of your tongue between your upper and lower teeth. Blow air through the gap without vibrating your vocal cords.',
    examples: ['Think', 'Bath', 'Thanks']
  },
  {
    id: 'th-voiced',
    symbol: '/ð/',
    name: 'Voiced TH',
    articulation: 'Similar to unvoiced TH, place tongue between teeth, but vibrate your vocal cords as you push air through.',
    examples: ['This', 'Mother', 'The']
  },
  {
    id: 'r',
    symbol: '/r/',
    name: 'R Sound',
    articulation: 'Curl the tip of your tongue back towards the roof of your mouth without touching it. Round your lips slightly.',
    examples: ['Red', 'Car', 'Right']
  },
  {
    id: 'v',
    symbol: '/v/',
    name: 'V Sound',
    articulation: 'Place your top teeth gently on your bottom lip. Push air through while vibrating your vocal cords.',
    examples: ['Very', 'Have', 'Van']
  },
  {
    id: 'schwa',
    symbol: '/ə/',
    name: 'Schwa',
    articulation: 'The most common sound in English. Relax your mouth completely, jaw slightly open, tongue resting flat. Make a short "uh" sound.',
    examples: ['About', 'Teacher', 'Banana']
  }
];

const FEEDBACK_DETAILS = [
  { message: "Tongue placement too high", type: 'Placement', suggestion: "Try lowering your tongue slightly to create more space." },
  { message: "Vowel sound too short", type: 'Timing', suggestion: "Lengthen the vowel sound; hold it a bit longer." },
  { message: "Missed aspiration", type: 'Articulation', suggestion: "Release a small burst of air when saying this sound." },
  { message: "Incorrect voicing", type: 'Voicing', suggestion: "Feel the vibration in your throat (vocal cords)." },
  { message: "Stress placement off", type: 'Stress', suggestion: "Emphasize this syllable more strongly." },
  { message: "Lips not rounded enough", type: 'Placement', suggestion: "Round your lips forward into a circle shape." },
  { message: "Jaw too closed", type: 'Placement', suggestion: "Drop your jaw to open the mouth vertically." },
  { message: "Airflow blocked", type: 'Articulation', suggestion: "Ensure air flows continuously without stopping." }
] as const;

// Engine for simulating feedback (since we don't have a real ML backend)
// Updated to accept an optional transcript for more realistic simulation based on actual input
export const generateSimulationResult = (text: string, transcript?: string): AttemptResult => {
  const words = text.split(' ');
  const phonemes: PhonemeData[] = [];
  let totalPhonemes = 0;
  let goodPhonemes = 0;
  let idCounter = 1;

  // Normalize transcript if provided for better matching
  const transcriptLower = transcript ? transcript.toLowerCase() : '';

  words.forEach(word => {
    // Check if the word (stripped of punctuation) appears in the transcript
    const wordClean = word.toLowerCase().replace(/[^\w]/g, '');
    const isWordRecognized = transcript 
        ? transcriptLower.includes(wordClean) 
        : Math.random() > 0.25;

    const chunks = word.match(/.{1,3}/g) || [word];
    
    chunks.forEach(chunk => {
      // Determine goodness based on word recognition + some probability
      let isGood;
      if (transcript) {
          // If transcript exists, heavily weight whether the word was recognized
          if (isWordRecognized) {
              isGood = Math.random() > 0.1; // 90% chance good if recognized
          } else {
              isGood = Math.random() > 0.8; // 20% chance good if not recognized (maybe partial?)
          }
      } else {
          // Default random fallback
          isGood = Math.random() > 0.25;
      }

      let feedback = undefined;
      let suggestion = undefined;
      let errorType: PhonemeData['errorType'] = undefined;
      
      if (!isGood) {
        const detail = FEEDBACK_DETAILS[Math.floor(Math.random() * FEEDBACK_DETAILS.length)];
        feedback = detail.message;
        suggestion = detail.suggestion;
        errorType = detail.type as PhonemeData['errorType'];
      }
      
      phonemes.push({
        id: `${Date.now()}-${idCounter++}`,
        text: chunk,
        isGood,
        feedback,
        suggestion,
        errorType
      });

      totalPhonemes++;
      if (isGood) goodPhonemes++;
    });
  });

  const accuracy = totalPhonemes > 0 ? Math.round((goodPhonemes / totalPhonemes) * 100) : 0;
  const per = totalPhonemes > 0 ? parseFloat(((totalPhonemes - goodPhonemes) / totalPhonemes).toFixed(2)) : 0;

  return {
    accuracy,
    per,
    phonemes
  };
};