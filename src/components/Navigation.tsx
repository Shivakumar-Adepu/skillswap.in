import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, MessageCircle, Users, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { profile, chatUsers } = useUser();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/sparks', icon: Zap, label: 'Sparks' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/hubs', icon: Users, label: 'Hubs' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 px-4 py-2 z-50 shadow-2xl">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
                           (path === '/home' && location.pathname === '/dashboard') ||
                           (path === '/profile' && location.pathname.startsWith('/profile'));
            
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg transform scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`} />
                  {label === 'Chat' && chatUsers.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"></div>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;