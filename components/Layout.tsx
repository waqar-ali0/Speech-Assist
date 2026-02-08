import React from 'react';
import { Home, Mic, LogOut } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  user: User | null;
  onNavigate: (view: 'DASHBOARD' | 'PRACTICE' | 'AUTH') => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, user, onNavigate, onLogout }) => {
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span 
                className="text-2xl font-bold text-teal-700 cursor-pointer"
                onClick={() => onNavigate('DASHBOARD')}
              >
                Speech Assist
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('DASHBOARD')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'DASHBOARD' 
                    ? 'text-teal-700 bg-teal-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              
              <button
                onClick={() => onNavigate('PRACTICE')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'PRACTICE' 
                    ? 'text-teal-700 bg-teal-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mic className="w-4 h-4 mr-2" />
                Practice
              </button>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs" title={user?.name}>
                  {initials}
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;