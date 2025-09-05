import React, { useState, useRef, useEffect } from 'react';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { Plus, MoreHorizontal, Bookmark, Send, Image as ImageIcon, Briefcase, GraduationCap, Cpu, Camera, X, TrendingUp, Zap, Users, Clock, Play, ChevronLeft, ChevronRight, Fire, Target, Award, MessageCircle, Video, Calendar, Star, ArrowRight, Lightbulb, Trophy, Eye, Search, Bell, Filter, Heart, Share2, BookOpen, Globe, Sparkles } from 'lucide-react';

const STORY_USERS = [
  {
    id: 'your-story',
    name: 'Your Story',
    avatar: '',
    hasStory: false,
    isYours: true
  },
  {
    id: '1',
    name: 'Sarah',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    hasStory: true,
    isYours: false
  },
  {
    id: '2',
    name: 'Alex',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    hasStory: true,
    isYours: false
  },
  {
    id: '3',
    name: 'Maria',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    hasStory: true,
    isYours: false
  },
  {
    id: '4',
    name: 'David',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    hasStory: true,
    isYours: false
  }
];

const QUICK_ACTIONS = [
  { icon: Video, label: 'Go Live', color: 'from-red-500 to-pink-600', action: 'live' },
  { icon: Camera, label: 'Create Spark', color: 'from-purple-500 to-indigo-600', action: 'spark' },
  { icon: Users, label: 'Join Hub', color: 'from-blue-500 to-cyan-600', action: 'hub' },
  { icon: BookOpen, label: 'Learn', color: 'from-green-500 to-emerald-600', action: 'learn' }
];

const TRENDING_TOPICS = [
  { name: 'React Hooks', posts: '2.3k', trend: '+15%' },
  { name: 'UI Design', posts: '1.8k', trend: '+22%' },
  { name: 'Python Tips', posts: '1.5k', trend: '+8%' },
  { name: 'Cooking Hacks', posts: '1.2k', trend: '+31%' }
];

const LIVE_SESSIONS = [
  {
    id: '1',
    title: 'JavaScript Masterclass',
    host: 'Sarah Chen',
    viewers: 234,
    category: 'technology',
    thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Digital Art Basics',
    host: 'Alex Kim',
    viewers: 156,
    category: 'education',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  }
];

const Feed: React.FC = () => {
  const { posts, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const { profile, allUsers, getUserById } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'job' | 'education' | 'technology'>('education');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'trending'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      addPost(newPostContent, selectedImage || undefined, 'post', selectedCategory);
      setNewPostContent('');
      setSelectedImage(null);
      setShowCreatePost(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'job': return <Briefcase className="w-3 h-3" />;
      case 'education': return <GraduationCap className="w-3 h-3" />;
      case 'technology': return <Cpu className="w-3 h-3" />;
      default: return <GraduationCap className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job': return 'from-green-500 to-emerald-600';
      case 'education': return 'from-blue-500 to-indigo-600';
      case 'technology': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const formatTime = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Stories Section */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {STORY_USERS.map(user => (
            <div key={user.id} className="flex-shrink-0 text-center">
              <div className={`relative w-16 h-16 rounded-full p-0.5 ${
                user.hasStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-200'
              }`}>
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  {user.isYours ? (
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-gray-600" />
                    </div>
                  ) : (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate w-16">{user.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white mx-4 my-4 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
          <Zap className="w-5 h-5 text-yellow-500 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center mb-2 shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Sessions */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            Live Now
          </h3>
          <button className="text-purple-600 text-sm font-medium">View All</button>
        </div>
        <div className="flex space-x-3 overflow-x-auto">
          {LIVE_SESSIONS.map(session => (
            <div key={session.id} className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative">
                <img
                  src={session.thumbnail}
                  alt={session.title}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  {session.viewers} watching
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{session.title}</h4>
                <p className="text-xs text-gray-600">by {session.host}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
          Trending Topics
        </h3>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">#{topic.name}</h4>
                <p className="text-xs text-gray-600">{topic.posts} posts</p>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-bold">{topic.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white mx-4 mb-4 rounded-2xl p-1 shadow-sm">
        <div className="flex">
          {[
            { key: 'all', label: 'For You', icon: Sparkles },
            { key: 'following', label: 'Following', icon: Users },
            { key: 'trending', label: 'Trending', icon: TrendingUp }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeFilter === filter.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              <span className="text-sm">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Prompt */}
      <div className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
        >
          <img
            src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-600 font-medium flex-1 text-left">Share your knowledge...</span>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-green-600" />
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Video className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4 mx-4">
        {posts.length > 0 ? posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                    <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(post.category)} rounded-full flex items-center space-x-1`}>
                      <div className="text-white">
                        {getCategoryIcon(post.category)}
                      </div>
                      <span className="text-white text-xs font-medium capitalize">{post.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{formatTime(post.createdAt)}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-gray-900 leading-relaxed">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="mb-3">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full object-cover max-h-96"
                />
              </div>
            )}

            {/* Engagement Actions */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => toggleClap(post.id)}
                    className={`flex items-center space-x-2 transition-all ${
                      post.hasClapped ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.hasClapped ? 'fill-current' : ''}`} />
                    <span className="font-semibold text-sm">{post.claps}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleDrop(post.id)}
                    className={`flex items-center space-x-2 transition-all ${
                      post.hasDropped ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">{post.drops}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleSpread(post.id)}
                    className={`flex items-center space-x-2 transition-all ${
                      post.hasSpread ? 'text-green-500' : 'text-gray-600 hover:text-green-500'
                    }`}
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-semibold text-sm">{post.spreads}</span>
                  </button>
                </div>
                
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to SkillSwap!</h3>
            <p className="text-gray-600 mb-6">Start sharing your knowledge and connect with learners worldwide</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowCreatePost(false);
                    setSelectedImage(null);
                    setNewPostContent('');
                  }}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <h2 className="text-lg font-bold text-gray-900">New Post</h2>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="text-purple-600 hover:text-purple-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{profile?.name}</h3>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as 'job' | 'education' | 'technology')}
                    className="text-sm text-gray-600 bg-transparent border-0 focus:ring-0 p-0"
                  >
                    <option value="education">📚 Education</option>
                    <option value="job">💼 Jobs</option>
                    <option value="technology">💻 Technology</option>
                  </select>
                </div>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full h-32 p-4 border-0 resize-none text-gray-900 placeholder-gray-500 focus:ring-0"
                placeholder="What's happening in your learning journey?"
                autoFocus
              />

              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="font-medium">Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;