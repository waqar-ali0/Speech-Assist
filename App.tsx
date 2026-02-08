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

  useEffect(() => {
    // Check for existing session
    const existingUser = AuthService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
      setCurrentView('DASHBOARD');
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setCurrentView('AUTH');
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
  };

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