import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, MessageCircle, Video } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
  const { profile, searchUsers, toggleSwap, addChatUser, allUsers } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchUsers(searchQuery);
      setSearchResults(results);
    } else {
      // Show all users when no search query
      setSearchResults(allUsers);
    }
  }, [searchQuery, searchUsers, allUsers]);

  const handleSwap = (userId: string) => {
    toggleSwap(userId);
  };

  const handleMessage = (userId: string) => {
    addChatUser(userId);
  };

  const isSwapping = (userId: string) => {
    return profile?.isSwappingWith.includes(userId) || false;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-500"
            placeholder="Search people..."
            autoFocus
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="divide-y divide-gray-100">
        {searchResults.length === 0 ? (
          <div className="text-center py-16 px-4">
            {searchQuery.trim() === '' ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Discover People</h3>
                <p className="text-gray-600">Search for skill partners by name or expertise</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try searching for different names or skills</p>
              </>
            )}
          </div>
        ) : (
          searchResults.map(user => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                {/* Left: Avatar */}
                <Link to={`/profile/${user.id}`}>
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                </Link>

                {/* Center: Name */}
                <Link to={`/profile/${user.id}`} className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {user.teachSkills.length > 0 
                      ? `Teaches ${user.teachSkills.slice(0, 2).map(s => s.name).join(', ')}`
                      : 'New to SkillSwap'
                    }
                  </p>
                </Link>

                {/* Right: Swap Button */}
                <button
                  onClick={() => handleSwap(user.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isSwapping(user.id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isSwapping(user.id) ? 'Swapping' : 'Swap'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;