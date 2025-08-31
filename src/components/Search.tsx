import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Star, Zap, MessageCircle, Users } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Search: React.FC = () => {
  const { profile, allUsers, addChatUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  
  // Filter out current user and apply search/filter
  const filteredUsers = allUsers
    .filter(user => user.id !== profile?.id)
    .filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.teachSkills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         user.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterSkill || user.teachSkills.some(skill => skill.name === filterSkill);
    return matchesSearch && matchesFilter;
  });

  const handleConnect = (userId: string) => {
    addChatUser(userId);
    // Could show a success toast here
  };

  // Get unique skills for filter dropdown
  const allSkills = Array.from(new Set(
    allUsers.flatMap(user => user.teachSkills.map(skill => skill.name))
  )).sort();

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
            <SearchIcon className="w-6 h-6 text-white" />
          </div>
          Discover Amazing Skills ✨
        </h1>
        <p className="text-white/90 text-lg">Connect with {allUsers.length} talented people ready to share knowledge</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 relative group">
            <SearchIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg placeholder-gray-400"
              placeholder="Search skills, names, or interests..."
            />
          </div>
          
          <div className="md:w-56">
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          
          <button className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all transform hover:scale-105 font-semibold">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                  src={user.avatar}
                  alt={user.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl group-hover:ring-purple-200 transition-all"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                    {user.badges.length > 0 && (
                      <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-sm">
                        {user.badges[0]}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{user.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span className="font-medium">{user.swaps} swaps completed</span>
                    <span>•</span>
                    <span className="text-purple-600 font-medium">Level {user.level}</span>
                  </div>
                  
                  <p className="text-gray-700 font-medium">{user.bio || "Passionate about sharing knowledge and learning new skills!"}</p>
                </div>
              </div>

              <div className="flex-1 lg:max-w-md">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2 shadow-sm"></div>
                      Can Teach
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.teachSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-sm font-bold shadow-sm">
                          {skill.name}
                        </span>
                      ))}
                      {user.teachSkills.length > 3 && (
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
                          +{user.teachSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-2 shadow-sm"></div>
                      Wants to Learn
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.learnSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-xl text-sm font-bold shadow-sm">
                          {skill.name}
                        </span>
                      ))}
                      {user.learnSkills.length > 3 && (
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
                          +{user.learnSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-2 rounded-xl">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-800 font-bold text-sm">{20 + Math.floor(Math.random() * 20)} coins/hr</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last active: {user.isOnline ? 'Online now' : '2h ago'}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleConnect(user.id)}
                      className="flex items-center space-x-2 px-5 py-3 text-purple-600 hover:text-purple-700 font-bold transition-all hover:bg-purple-50 rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold shadow-lg">
                      <Users className="w-4 h-4" />
                      <span>Request Swap</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No skill partners found</h3>
          <p className="text-gray-600 text-lg mb-6">Try adjusting your search or explore different skills</p>
          <button 
            onClick={() => {setSearchQuery(''); setFilterSkill('');}}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {allUsers.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Be the first to join!</h3>
          <p className="text-gray-600 text-lg">Complete your profile and start building the SkillSwape community</p>
        </div>
      )}
    </div>
  );
};

export default Search;