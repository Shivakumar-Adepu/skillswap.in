import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, MessageCircle, Users, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { profile, chatUsers } = useUser();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home', ariaLabel: 'Go to Home feed' },
    { path: '/sparks', icon: Zap, label: 'Sparks', ariaLabel: 'View Sparks videos' },
    { path: '/chat', icon: MessageCircle, label: 'Chat', ariaLabel: 'Open messages' },
    { path: '/hubs', icon: Users, label: 'Hubs', ariaLabel: 'Browse skill hubs' },
    { path: '/profile', icon: User, label: 'Profile', ariaLabel: 'View your profile' }
  ];

  const unreadMessages = chatUsers.reduce((total, chat) => total + chat.unread, 0);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 px-4 py-2 z-50 shadow-2xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label, ariaLabel }) => {
            const isActive = location.pathname === path || 
                           (path === '/home' && location.pathname === '/dashboard') ||
                           (path === '/profile' && location.pathname.startsWith('/profile'));
            
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isActive
                    ? 'text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg transform scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:scale-105'
                }`}
                aria-label={ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`} />
                  {label === 'Chat' && unreadMessages > 0 && (
                    <div 
                      className="absolute -top-1 -right-1 min-w-[12px] h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                      aria-label={`${unreadMessages} unread messages`}
                    >
                      {unreadMessages > 9 ? (
                        <span className="text-[8px] font-bold text-white px-1">9+</span>
                      ) : (
                        <span className="text-[8px] font-bold text-white">{unreadMessages}</span>
                      )}
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;