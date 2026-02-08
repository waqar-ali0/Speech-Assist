import { User, PracticeSession, AttemptResult } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// To enable Supabase, create a .env file in your project root with:
// VITE_SUPABASE_URL=your_project_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

// Note: We use import.meta.env for Vite support. In some environments this might need fallback.
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL;
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

let supabase: SupabaseClient | null = null;
if (USE_SUPABASE) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('🔌 Connected to Supabase');
} else {
  console.log('💾 Using LocalStorage (Mock Database)');
}

// --- LOCAL STORAGE IMPLEMENTATION (Fallback) ---
const USERS_KEY = 'speech_assist_users';
const CURRENT_USER_KEY = 'speech_assist_current_user';
const SESSIONS_KEY = 'speech_assist_sessions';

const getLocalUsers = (): Record<string, User & { password: string }> => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
};

const saveLocalUsers = (users: Record<string, User & { password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getLocalSessions = (): PracticeSession[] => {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalSessions = (sessions: PracticeSession[]) => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// --- UNIFIED SERVICES ---

export const AuthService = {
  login: async (email: string, password: string): Promise<User | null> => {
    if (USE_SUPABASE && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error.message);
        throw new Error(error.message);
      }
      if (!data.user) return null;
      
      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || 'User'
      };
    } else {
      // Local Fallback
      return new Promise((resolve) => {
        const users = getLocalUsers();
        const foundUser = Object.values(users).find(u => u.email === email && u.password === password);
        if (foundUser) {
          const { password: _, ...userWithoutPass } = foundUser;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
          resolve(userWithoutPass);
        } else {
          resolve(null);
        }
      });
    }
  },

  signup: async (email: string, password: string, name: string): Promise<User | null> => {
    if (USE_SUPABASE && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) {
        console.error('Signup error:', error.message);
        throw new Error(error.message);
      }
      if (!data.user) return null;

      // If email confirmation is enabled, identities will be empty for existing users
      if (data.user.identities && data.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: name
      };
    } else {
      // Local Fallback
      return new Promise((resolve) => {
        const users = getLocalUsers();
        if (Object.values(users).some(u => u.email === email)) {
          resolve(null);
          return;
        }

        const id = Date.now().toString();
        const newUser = { id, email, password, name };
        users[id] = newUser;
        saveLocalUsers(users);

        const { password: _, ...userWithoutPass } = newUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
        resolve(userWithoutPass);
      });
    }
  },

  logout: async () => {
    if (USE_SUPABASE && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (USE_SUPABASE && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User'
        };
      }
      return null;
    } else {
      // Local Fallback
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    }
  }
};

export const DataService = {
  saveSession: async (userId: string, result: AttemptResult, sentenceText: string): Promise<PracticeSession | null> => {
    const now = new Date();
    
    if (USE_SUPABASE && supabase) {
      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: userId,
          sentence_text: sentenceText,
          accuracy: result.accuracy,
          per: result.per,
          phonemes: result.phonemes, // Supabase handles JSONB automatically
          created_at: now.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving session:', error);
        return null;
      }

      return {
        id: data.id.toString(),
        userId: data.user_id,
        date: data.created_at,
        displayDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sentenceText: data.sentence_text,
        accuracy: Number(data.accuracy),
        per: Number(data.per),
        phonemes: data.phonemes
      };
    } else {
      // Local Fallback
      return new Promise((resolve) => {
        const sessions = getLocalSessions();
        const newSession: PracticeSession = {
          id: Date.now().toString(),
          userId,
          date: now.toISOString(),
          displayDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sentenceText,
          accuracy: result.accuracy,
          per: result.per,
          phonemes: result.phonemes
        };
        sessions.push(newSession);
        saveLocalSessions(sessions);
        resolve(newSession);
      });
    }
  },

  getUserHistory: async (userId: string): Promise<PracticeSession[]> => {
    if (USE_SUPABASE && supabase) {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return [];
      }

      return data.map((d: any) => ({
        id: d.id.toString(),
        userId: d.user_id,
        date: d.created_at,
        displayDate: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sentenceText: d.sentence_text,
        accuracy: Number(d.accuracy),
        per: Number(d.per),
        phonemes: d.phonemes
      }));
    } else {
      // Local Fallback
      return new Promise((resolve) => {
        const sessions = getLocalSessions();
        const userSessions = sessions
          .filter(s => s.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(userSessions);
      });
    }
  }
};