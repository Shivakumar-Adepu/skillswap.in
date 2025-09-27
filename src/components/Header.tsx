import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Wallet, Sparkles, Bell, Menu, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { profile } = useUser();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/home': return 'Home';
      case '/sparks': return 'Sparks';
      case '/chat': return 'Messages';
      case '/hubs': return 'Hubs';
      case '/profile': return 'Profile';
      case '/wallet': return 'Wallet';
      case '/search': return 'Search';
      case '/notifications': return 'Notifications';
      case '/marketplace': return 'Marketplace';
      case '/achievements': return 'Achievements';
      default: return 'SkillSwap';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-4 py-3 z-50 shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <Link to="/home" className="flex items-center space-x-2" aria-label="SkillSwap Home">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">SkillSwap</span>
          </Link>
          <span className="text-lg font-semibold text-gray-700 sm:hidden">{getPageTitle()}</span>
        </div>

        {/* Search Bar - Hidden on mobile, shown on larger screens */}
        <div className="flex-1 max-w-xs mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm placeholder-gray-500"
              placeholder="Search skills..."
              aria-label="Search skills"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Icon for Mobile */}
          <Link 
            to="/search"
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <Link 
            to="/notifications"
            className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Link>

          {/* Wallet */}
          <Link 
            to="/wallet"
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
            aria-label={`Wallet: ${profile?.skillCoins || 0} SkillCoins`}
          >
            <Wallet className="w-4 h-4" />
            <span className="font-bold text-sm">{profile?.skillCoins || 0}</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
          <div className="max-w-md mx-auto p-4">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm placeholder-gray-500"
                placeholder="Search skills..."
                aria-label="Search skills"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to="/marketplace" 
                className="p-3 text-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                to="/achievements" 
                className="p-3 text-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Achievements
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;