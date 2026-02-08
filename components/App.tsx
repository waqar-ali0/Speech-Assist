import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import PracticeArea from './components/PracticeArea';
import { ViewState, User } from './types';
import { AuthService } from './services/storage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const existingUser = await AuthService.getCurrentUser();
        if (existingUser) {
          setUser(existingUser);
          setCurrentView('DASHBOARD');
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    setCurrentView('AUTH');
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-teal-700">Loading...</div>;
  }

  if (currentView === 'AUTH' || !user) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <Layout activeView={currentView} user={user} onNavigate={handleNavigate} onLogout={handleLogout}>
      {currentView === 'DASHBOARD' && <DashboardView user={user} />}
      {currentView === 'PRACTICE' && <PracticeArea user={user} />}
    </Layout>
  );
};

export default App;