import React, { useState } from 'react';
import { Search, Star, Clock, Award, Filter, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SkillListing {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  skillName: string;
  category: 'job' | 'education' | 'technology';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  isPopular: boolean;
}

const SkillMarketplace: React.FC = () => {
  const { profile } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'job' | 'education' | 'technology'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [skillListings] = useState<SkillListing[]>([
    {
      id: '1',
      teacherId: 'teacher1',
      teacherName: 'Sarah Chen',
      teacherAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skillName: 'React Development',
      category: 'technology',
      level: 'intermediate',
      duration: '1 hour',
      price: 25,
      rating: 4.9,
      reviews: 127,
      description: 'Learn React fundamentals and build your first app',
      tags: ['React', 'JavaScript', 'Frontend'],
      isPopular: true
    },
    {
      id: '2',
      teacherId: 'teacher2',
      teacherName: 'Carlos Rodriguez',
      teacherAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skillName: 'Spanish Conversation',
      category: 'education',
      level: 'beginner',
      duration: '30 minutes',
      price: 15,
      rating: 4.8,
      reviews: 89,
      description: 'Practice conversational Spanish with a native speaker',
      tags: ['Spanish', 'Language', 'Conversation'],
      isPopular: false
    },
    {
      id: '3',
      teacherId: 'teacher3',
      teacherName: 'Alex Kim',
      teacherAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skillName: 'Job Interview Prep',
      category: 'job',
      level: 'intermediate',
      duration: '45 minutes',
      price: 30,
      rating: 4.7,
      reviews: 156,
      description: 'Master job interviews with proven strategies',
      tags: ['Interview', 'Career', 'Professional'],
      isPopular: true
    }
  ]);

  const filteredListings = skillListings.filter(listing => {
    const matchesSearch = listing.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || listing.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job': return 'from-green-500 to-emerald-600';
      case 'education': return 'from-blue-500 to-indigo-600';
      case 'technology': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookSession = (listing: SkillListing) => {
    if (profile && profile.skillCoins >= listing.price) {
      alert(`Session booked with ${listing.teacherName}! ${listing.price} SkillCoins deducted.`);
    } else {
      alert('Insufficient SkillCoins! Earn more by teaching skills.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Skill Marketplace</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all placeholder-gray-500"
            placeholder="Search skills..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: 'all', label: 'All' },
              { key: 'education', label: 'Education' },
              { key: 'job', label: 'Jobs' },
              { key: 'technology', label: 'Tech' }
            ].map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex-shrink-0 ${
                  selectedCategory === category.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Level Filter */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-700 mb-2">Skill Level</h3>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Levels' },
                { key: 'beginner', label: 'Beginner' },
                { key: 'intermediate', label: 'Intermediate' },
                { key: 'advanced', label: 'Advanced' }
              ].map(level => (
                <button
                  key={level.key}
                  onClick={() => setSelectedLevel(level.key as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedLevel === level.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skill Listings */}
      <div className="p-4 space-y-4">
        {filteredListings.map(listing => (
          <div key={listing.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={listing.teacherAvatar}
                alt={listing.teacherName}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{listing.skillName}</h3>
                  {listing.isPopular && (
                    <div className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 text-orange-600" />
                      <span className="text-xs font-medium text-orange-600">Popular</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">by {listing.teacherName}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
                    <span className="text-sm text-gray-500">({listing.reviews})</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{listing.duration}</span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(listing.level)}`}>
                    {listing.level}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{listing.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {listing.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{listing.price}</span>
                    <span className="text-sm text-gray-600">SkillCoins</span>
                  </div>
                  
                  <button
                    onClick={() => handleBookSession(listing)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMarketplace;