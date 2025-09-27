import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Wallet, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { profile } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-4 py-3 z-50 shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">SkillSwap</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm placeholder-gray-500"
              placeholder="Search skills..."
            />
          </div>
        </div>

        {/* Wallet */}
        <Link 
          to="/wallet"
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
        >
          <Wallet className="w-4 h-4" />
          <span className="font-bold text-sm">{profile?.skillCoins || 0}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;