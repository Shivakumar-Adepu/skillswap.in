import React, { useState } from 'react';
import { Users, Plus, Search, TrendingUp, Crown, MessageCircle, ArrowLeft } from 'lucide-react';

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
  createdBy: string;
}

const Groups: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'job' | 'education' | 'technology'>('all');
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateHub, setShowCreateHub] = useState(false);
  const [newHubData, setNewHubData] = useState({
    name: '',
    description: '',
    category: 'education' as 'job' | 'education' | 'technology',
    isPrivate: false
  });

  const handleCreateHub = () => {
    if (newHubData.name.trim() && newHubData.description.trim()) {
      const newHub: Group = {
        id: Date.now().toString(),
        name: newHubData.name,
        description: newHubData.description,
        category: newHubData.category,
        members: 1,
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        isJoined: true,
        isPrivate: newHubData.isPrivate,
        lastActivity: 'now',
        createdBy: 'current-user'
      };
      
      setGroups(prev => [newHub, ...prev]);
      setNewHubData({ name: '', description: '', category: 'education', isPrivate: false });
      setShowCreateHub(false);
    }
  };

  const handleJoinHub = (hubId: string) => {
    setGroups(prev => prev.map(hub => 
      hub.id === hubId 
        ? { ...hub, isJoined: !hub.isJoined, members: hub.isJoined ? hub.members - 1 : hub.members + 1 }
        : hub
    ));
  };

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
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Hubs</h1>
          <button
            onClick={() => setShowCreateHub(true)}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-500"
            placeholder="Search hubs..."
          />
        </div>

        {/* Category Filters */}
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
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Groups List */}
      <div className="divide-y divide-gray-100">
        {filteredGroups.length > 0 ? filteredGroups.map(group => (
          <div key={group.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <img
                src={group.image}
                alt={group.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                  <span className="text-sm">{getCategoryIcon(group.category)}</span>
                  {group.isPrivate && <Crown className="w-3 h-3 text-yellow-500" />}
                </div>
                <p className="text-sm text-gray-600 truncate mb-1">{group.description}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{group.members.toLocaleString()} members</span>
                  <span>•</span>
                  <span>{group.lastActivity}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleJoinHub(group.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  group.isJoined
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {group.isJoined ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {searchQuery ? 'No hubs found' : 'No hubs yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try different search terms' : 'Create the first hub for your community'}
            </p>
            <button
              onClick={() => setShowCreateHub(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Hub
            </button>
          </div>
        )}
      </div>

      {/* Create Hub Modal */}
      {showCreateHub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowCreateHub(false)}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <h2 className="text-lg font-bold text-gray-900">Create Hub</h2>
                <button
                  onClick={handleCreateHub}
                  disabled={!newHubData.name.trim() || !newHubData.description.trim()}
                  className="text-purple-600 hover:text-purple-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hub Name</label>
                <input
                  type="text"
                  value={newHubData.name}
                  onChange={(e) => setNewHubData({ ...newHubData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter hub name..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newHubData.description}
                  onChange={(e) => setNewHubData({ ...newHubData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe your hub..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHubData.category}
                  onChange={(e) => setNewHubData({ ...newHubData, category: e.target.value as 'job' | 'education' | 'technology' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="education">📚 Education</option>
                  <option value="job">💼 Jobs</option>
                  <option value="technology">💻 Technology</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="private"
                  checked={newHubData.isPrivate}
                  onChange={(e) => setNewHubData({ ...newHubData, isPrivate: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="private" className="text-sm text-gray-700">
                  Make this hub private (invite only)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;