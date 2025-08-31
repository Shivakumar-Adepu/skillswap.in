import React, { useState } from 'react';
import { Users, Plus, Search, TrendingUp, Crown, MessageCircle } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  category: 'job' | 'education' | 'technology';
  members: number;
  image: string;
  isJoined: boolean;
  isPrivate: boolean;
  lastActivity: string;
}

const SAMPLE_GROUPS: Group[] = [
  {
    id: '1',
    name: 'React Developers Hub',
    description: 'Share React tips, tricks, and job opportunities',
    category: 'technology',
    members: 1247,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isJoined: true,
    isPrivate: false,
    lastActivity: '2m ago'
  },
  {
    id: '2',
    name: 'UI/UX Career Network',
    description: 'Design jobs, portfolio reviews, and mentorship',
    category: 'job',
    members: 892,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isJoined: false,
    isPrivate: false,
    lastActivity: '15m ago'
  },
  {
    id: '3',
    name: 'Python Learning Circle',
    description: 'Learn Python together through projects and challenges',
    category: 'education',
    members: 2156,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isJoined: true,
    isPrivate: false,
    lastActivity: '1h ago'
  }
];

const Groups: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'job' | 'education' | 'technology'>('all');
  const [groups] = useState<Group[]>(SAMPLE_GROUPS);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job': return 'from-green-500 to-emerald-600';
      case 'education': return 'from-blue-500 to-indigo-600';
      case 'technology': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'job': return '💼';
      case 'education': return '📚';
      case 'technology': return '💻';
      default: return '📚';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Search and Filters */}
      <div className="p-4 space-y-4 border-b border-gray-100">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-500"
            placeholder="Search hubs..."
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All', icon: '🌟' },
            { key: 'education', label: 'Education', icon: '📚' },
            { key: 'job', label: 'Jobs', icon: '💼' },
            { key: 'technology', label: 'Tech', icon: '💻' }
          ].map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all flex-shrink-0 ${
                selectedCategory === category.key
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Your Groups */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Hubs</h2>
          <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Create</span>
          </button>
        </div>

        <div className="space-y-3">
          {filteredGroups.filter(group => group.isJoined).map(group => (
            <div key={group.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl hover:from-purple-50 hover:to-pink-50 transition-all border border-gray-100 hover:border-purple-200">
              <img
                src={group.image}
                alt={group.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                  <span className="text-lg">{getCategoryIcon(group.category)}</span>
                </div>
                <p className="text-xs text-gray-600">{group.members.toLocaleString()} members • {group.lastActivity}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Discover Groups */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Discover Hubs</h2>
        </div>

        <div className="space-y-4">
          {filteredGroups.filter(group => !group.isJoined).map(group => (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900">{group.name}</h3>
                    <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(group.category)} rounded-full`}>
                      <span className="text-white text-xs font-bold">{getCategoryIcon(group.category)}</span>
                    </div>
                  </div>
                  {group.isPrivate && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{group.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{group.lastActivity}</span>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 text-sm shadow-lg">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No hubs found</h3>
          <p className="text-gray-600 text-sm mb-6">Try adjusting your search or explore different categories</p>
          <button
            onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Groups;