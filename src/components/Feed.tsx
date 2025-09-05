import React, { useState, useRef, useEffect } from 'react';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { Plus, MoreHorizontal, Bookmark, Send, Image as ImageIcon, Briefcase, GraduationCap, Cpu, Camera, X, TrendingUp, Zap, Users, Clock, Play, ChevronLeft, ChevronRight, Siren as Fire, Target, Award, MessageCircle, Video, Calendar, Star, ArrowRight, Lightbulb, Trophy, Eye, Search, Bell, Filter, Heart, Share2, BookOpen, Globe, Sparkles, CheckCircle, Timer, Flame, Gift, Crown, Brain, Coffee, Sunrise, Moon } from 'lucide-react';

const DAILY_MISSIONS = [
  {
    id: 1,
    title: "Morning Spark",
    description: "Share one thing you learned yesterday",
    reward: 50,
    progress: 0,
    total: 1,
    icon: Sunrise,
    color: "from-orange-400 to-yellow-500",
    timeLeft: "2h 30m"
  },
  {
    id: 2,
    title: "Knowledge Drop",
    description: "Comment on 3 posts with helpful tips",
    reward: 30,
    progress: 1,
    total: 3,
    icon: Brain,
    color: "from-blue-400 to-indigo-500",
    timeLeft: "8h 15m"
  },
  {
    id: 3,
    title: "Connect & Grow",
    description: "Start a conversation with a new swapper",
    reward: 75,
    progress: 0,
    total: 1,
    icon: Users,
    color: "from-green-400 to-emerald-500",
    timeLeft: "12h 45m"
  }
];

const SKILL_OF_THE_DAY = {
  skill: "React Hooks",
  teacher: "Sarah Chen",
  avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  duration: "15 min",
  difficulty: "Intermediate",
  students: 234,
  rating: 4.9
};

const LEARNING_STREAK_DATA = {
  currentStreak: 7,
  longestStreak: 15,
  weeklyGoal: 5,
  weeklyProgress: 4
};

const QUICK_LEARNS = [
  {
    id: 1,
    title: "CSS Flexbox in 60 seconds",
    author: "Alex Kim",
    duration: "1m",
    thumbnail: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop",
    category: "technology"
  },
  {
    id: 2,
    title: "Perfect Pasta Technique",
    author: "Maria Garcia",
    duration: "2m",
    thumbnail: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop",
    category: "education"
  },
  {
    id: 3,
    title: "Interview Confidence Tips",
    author: "David Wilson",
    duration: "3m",
    thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop",
    category: "job"
  }
];

const COMMUNITY_CHALLENGES = [
  {
    id: 1,
    title: "30-Day Coding Challenge",
    participants: 1247,
    daysLeft: 23,
    reward: "Coding Master Badge",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Design December",
    participants: 856,
    daysLeft: 15,
    reward: "Design Pro Certificate",
    color: "from-blue-500 to-cyan-500"
  }
];

const Feed: React.FC = () => {
  const { posts, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const { profile, allUsers } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'job' | 'education' | 'technology'>('education');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      addPost(newPostContent, selectedImage || undefined, 'post', selectedCategory);
      setNewPostContent('');
      setSelectedImage(null);
      setShowCreatePost(false);
      
      // Complete morning spark mission if not already completed
      if (!completedMissions.includes(1)) {
        setCompletedMissions(prev => [...prev, 1]);
      }
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

  const completeMission = (missionId: number) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions(prev => [...prev, missionId]);
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
      {/* Welcome Header with Streak */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Good Morning! 🌅</h1>
            <p className="text-white/90">Ready to learn something new?</p>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-bold text-lg">{LEARNING_STREAK_DATA.currentStreak}</span>
            </div>
            <p className="text-xs text-white/80 mt-1">Day Streak</p>
          </div>
        </div>
        
        {/* Weekly Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Weekly Goal Progress</span>
            <span className="text-sm">{LEARNING_STREAK_DATA.weeklyProgress}/{LEARNING_STREAK_DATA.weeklyGoal}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(LEARNING_STREAK_DATA.weeklyProgress / LEARNING_STREAK_DATA.weeklyGoal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Missions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Target className="w-6 h-6 text-purple-600 mr-2" />
            Today's Missions
          </h2>
          <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
            {completedMissions.length}/3 Complete
          </div>
        </div>
        
        <div className="space-y-3">
          {DAILY_MISSIONS.map(mission => {
            const IconComponent = mission.icon;
            const isCompleted = completedMissions.includes(mission.id);
            const progressPercentage = (mission.progress / mission.total) * 100;
            
            return (
              <div key={mission.id} className={`p-4 rounded-2xl border-2 transition-all ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-purple-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${mission.color} rounded-full flex items-center justify-center shadow-lg`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <IconComponent className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{mission.title}</h3>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Gift className="w-4 h-4" />
                        <span className="text-sm font-bold">+{mission.reward}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
                    
                    {!isCompleted && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Progress: {mission.progress}/{mission.total}</span>
                          <span className="text-xs text-red-500 flex items-center">
                            <Timer className="w-3 h-3 mr-1" />
                            {mission.timeLeft} left
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${mission.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </>
                    )}
                    
                    {isCompleted && (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mission Completed! +{mission.reward} SkillCoins earned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill of the Day */}
      <div className="mx-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <Crown className="w-6 h-6 text-yellow-500 mr-2" />
          Featured Skill Today
        </h2>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={SKILL_OF_THE_DAY.avatar}
              alt={SKILL_OF_THE_DAY.teacher}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-300"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{SKILL_OF_THE_DAY.skill}</h3>
              <p className="text-gray-600">with {SKILL_OF_THE_DAY.teacher}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 text-yellow-600 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{SKILL_OF_THE_DAY.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{SKILL_OF_THE_DAY.students} students</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {SKILL_OF_THE_DAY.duration}
              </span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                {SKILL_OF_THE_DAY.difficulty}
              </span>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] shadow-lg">
            Start Learning Now
          </button>
        </div>
      </div>

      {/* Quick Learn Section */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Lightbulb className="w-6 h-6 text-blue-500 mr-2" />
            Quick Learns
          </h2>
          <button className="text-purple-600 text-sm font-medium">View All</button>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {QUICK_LEARNS.map(learn => (
            <div key={learn.id} className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={learn.thumbnail}
                alt={learn.title}
                className="w-full h-24 object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{learn.title}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{learn.author}</p>
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                    {learn.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Challenges */}
      <div className="mx-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <Trophy className="w-6 h-6 text-purple-500 mr-2" />
          Community Challenges
        </h2>
        
        <div className="space-y-3">
          {COMMUNITY_CHALLENGES.map(challenge => (
            <div key={challenge.id} className={`bg-gradient-to-r ${challenge.color} rounded-2xl p-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{challenge.title}</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-bold">{challenge.daysLeft} days left</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm mb-1">{challenge.participants.toLocaleString()} participants</p>
                  <p className="text-white/80 text-xs">Reward: {challenge.reward}</p>
                </div>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  Join Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Something Section */}
      <div className="mx-4 mb-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
            Share Your Knowledge
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium text-gray-900">Create Post</span>
            </button>
            
            <button className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-pink-600" />
              </div>
              <span className="font-medium text-gray-900">Create Spark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mx-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <Globe className="w-6 h-6 text-green-500 mr-2" />
          Community Feed
        </h2>
        
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
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
                        <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(post.category)} rounded-full`}>
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
                          post.hasClapped ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
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
            ))}
            
            <button className="w-full py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors">
              View More Posts
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to SkillSwap!</h3>
            <p className="text-gray-600 mb-6">Complete your first mission to start your learning journey</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Share Your First Knowledge
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
                <h2 className="text-lg font-bold text-gray-900">Share Knowledge</h2>
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
                placeholder="Share something valuable you learned today..."
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
                  <span className="font-medium">Add Photo</span>
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