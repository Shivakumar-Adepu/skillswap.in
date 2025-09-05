import React, { useState, useRef, useEffect } from 'react';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { 
  Plus, 
  MoreHorizontal, 
  Bookmark, 
  Send,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  Cpu,
  Camera,
  X,
  TrendingUp,
  Zap,
  Users,
  Clock,
  Play,
  ChevronLeft,
  ChevronRight,
  Fire,
  Target,
  Award,
  MessageCircle,
  Video,
  Calendar,
  Star,
  ArrowRight,
  Lightbulb,
  Trophy,
  Eye
} from 'lucide-react';

const DAILY_CHALLENGES = [
  {
    id: 1,
    title: "Teach something in 30 seconds 🎥",
    description: "Share a quick skill tip in a Spark",
    icon: "🎥",
    color: "from-red-500 to-pink-600"
  },
  {
    id: 2,
    title: "Share your best design hack 🎨",
    description: "Post your favorite design trick",
    icon: "🎨",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 3,
    title: "Explain one coding trick 💻",
    description: "Help others with a programming tip",
    icon: "💻",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 4,
    title: "Share a life hack ⚡",
    description: "Post something that makes life easier",
    icon: "⚡",
    color: "from-yellow-500 to-orange-600"
  }
];

const TRENDING_SKILLS = [
  { name: "React Development", trend: "+45%", icon: "⚛️" },
  { name: "UI/UX Design", trend: "+32%", icon: "🎨" },
  { name: "Cooking", trend: "+28%", icon: "🍳" },
  { name: "Photography", trend: "+25%", icon: "📸" },
  { name: "Spanish", trend: "+22%", icon: "🇪🇸" }
];

const SKILL_TIPS = [
  {
    title: "5-minute Video Editing Tips",
    description: "Learn basic cuts and transitions",
    icon: "🎬",
    category: "technology"
  },
  {
    title: "Learn one word of Japanese today",
    description: "こんにちは (Konnichiwa) = Hello",
    icon: "🇯🇵",
    category: "education"
  },
  {
    title: "Shortcut of the day",
    description: "Ctrl+Shift+T → Reopen closed tab",
    icon: "⌨️",
    category: "technology"
  },
  {
    title: "Quick Cooking Hack",
    description: "Add salt to pasta water for better flavor",
    icon: "🧂",
    category: "education"
  }
];

const POLLS = [
  {
    id: 1,
    question: "Which is harder to learn?",
    options: ["React", "Angular"],
    votes: [156, 89],
    category: "technology"
  },
  {
    id: 2,
    question: "Best time to learn new skills?",
    options: ["Morning", "Evening"],
    votes: [203, 167],
    category: "education"
  }
];

const Feed: React.FC = () => {
  const { posts, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const { profile, allUsers, getUserById } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'job' | 'education' | 'technology'>('education');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentChallenge] = useState(DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)]);
  const [userStreak] = useState(Math.floor(Math.random() * 15) + 1);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [showPoll, setShowPoll] = useState(false);
  const [currentPoll] = useState(POLLS[Math.floor(Math.random() * POLLS.length)]);
  const [pollVote, setPollVote] = useState<number | null>(null);
  const [showSkillTip, setShowSkillTip] = useState(false);
  const [currentSkillTip] = useState(SKILL_TIPS[Math.floor(Math.random() * SKILL_TIPS.length)]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get suggested users based on skills
    if (profile && allUsers.length > 0) {
      const suggestions = allUsers
        .filter(user => !profile.isSwappingWith.includes(user.id))
        .slice(0, 5);
      setSuggestedUsers(suggestions);
    }
  }, [profile, allUsers]);

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

  const handlePollVote = (optionIndex: number) => {
    setPollVote(optionIndex);
    setShowPoll(false);
  };

  const nextSuggestion = () => {
    setCurrentSuggestionIndex((prev) => 
      prev >= suggestedUsers.length - 1 ? 0 : prev + 1
    );
  };

  const prevSuggestion = () => {
    setCurrentSuggestionIndex((prev) => 
      prev <= 0 ? suggestedUsers.length - 1 : prev - 1
    );
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
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Live Sessions Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 m-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <p className="font-bold text-sm">Live now: Learn Guitar with Ramesh 🎸</p>
              <p className="text-xs opacity-90">23 people watching</p>
            </div>
          </div>
          <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-all">
            Join
          </button>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="mx-4 mb-4 bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Fire className="w-6 h-6" />
            <div>
              <p className="font-bold">🔥 You're on a {userStreak}-day learning streak!</p>
              <p className="text-sm opacity-90">Keep it up! Share something today</p>
            </div>
          </div>
          <Trophy className="w-8 h-8 opacity-80" />
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="mx-4 mb-4">
        <div className={`bg-gradient-to-r ${currentChallenge.color} text-white p-4 rounded-2xl shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span className="font-bold">Daily Challenge</span>
            </div>
            <span className="text-2xl">{currentChallenge.icon}</span>
          </div>
          <h3 className="font-bold text-lg mb-1">{currentChallenge.title}</h3>
          <p className="text-sm opacity-90 mb-3">{currentChallenge.description}</p>
          <button 
            onClick={() => setShowCreatePost(true)}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-all"
          >
            Take Challenge
          </button>
        </div>
      </div>

      {/* Suggested Connections */}
      {suggestedUsers.length > 0 && (
        <div className="mx-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Suggested Connections</h3>
            <span className="text-sm text-purple-600 font-medium">Find skill partners</span>
          </div>
          
          <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            {suggestedUsers.length > 1 && (
              <>
                <button
                  onClick={prevSuggestion}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center z-10 hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={nextSuggestion}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center z-10 hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}
            
            <div className="flex items-center space-x-4 px-8">
              <img
                src={suggestedUsers[currentSuggestionIndex]?.avatar}
                alt={suggestedUsers[currentSuggestionIndex]?.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{suggestedUsers[currentSuggestionIndex]?.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {suggestedUsers[currentSuggestionIndex]?.teachSkills[0]?.name || 'New to SkillSwap'}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>4.8</span>
                  <span>•</span>
                  <span>23 swaps</span>
                </div>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trending Skills */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>Trending Skills</span>
          </h3>
          <span className="text-sm text-gray-500">This week</span>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {TRENDING_SKILLS.map((skill, index) => (
            <div key={index} className="flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 min-w-[140px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{skill.icon}</span>
                <span className="text-xs font-bold text-green-600">{skill.trend}</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{skill.name}</p>
              <p className="text-xs text-gray-600">Trending now</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Button */}
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
        >
          <img
            src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-gray-600 font-medium">What's on your mind?</span>
        </button>
      </div>

      {/* Interactive Poll */}
      {showPoll && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Quick Poll</span>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-3">{currentPoll.question}</h4>
          
          <div className="space-y-2">
            {currentPoll.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handlePollVote(index)}
                className="w-full text-left p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  <span className="text-sm text-gray-500">{currentPoll.votes[index]} votes</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skill Tip Card */}
      {showSkillTip && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Skill Tip</span>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{currentSkillTip.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{currentSkillTip.title}</h4>
              <p className="text-sm text-gray-600">{currentSkillTip.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-0">
        {posts.length > 0 ? posts.map((post, index) => (
          <React.Fragment key={post.id}>
            {/* Insert interactive elements between posts */}
            {index === 1 && !showPoll && (
              <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-gray-900">Quick Poll</span>
                  </div>
                  <button
                    onClick={() => setShowPoll(true)}
                    className="text-blue-600 font-medium text-sm hover:text-blue-700"
                  >
                    Participate
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{currentPoll.question}</p>
              </div>
            )}
            
            {index === 2 && !showSkillTip && (
              <div className="mx-4 mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span className="font-bold text-gray-900">Skill Tip</span>
                  </div>
                  <button
                    onClick={() => setShowSkillTip(true)}
                    className="text-yellow-600 font-medium text-sm hover:text-yellow-700"
                  >
                    Learn
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{currentSkillTip.title}</p>
              </div>
            )}

            {/* Match Card */}
            {index === 3 && suggestedUsers.length > 0 && (
              <div className="mx-4 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={suggestedUsers[0]?.avatar}
                    alt={suggestedUsers[0]?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">Meet {suggestedUsers[0]?.name} 👋</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      They know {suggestedUsers[0]?.teachSkills[0]?.name} and want to learn React — just like you!
                    </p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-purple-700 transition-colors">
                    Swap
                  </button>
                </div>
              </div>
            )}

            {/* Regular Post */}
            <div className="bg-white border-b border-gray-100">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{post.userName}</h3>
                      <div className={`px-2 py-0.5 bg-gradient-to-r ${getCategoryColor(post.category)} rounded-full flex items-center space-x-1`}>
                        <div className="text-white">
                          {getCategoryIcon(post.category)}
                        </div>
                        <span className="text-white text-xs font-medium capitalize">{post.category}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{formatTime(post.createdAt)}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
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
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => toggleClap(post.id)}
                      className={`flex items-center space-x-2 transition-all ${
                        post.hasClapped ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                      }`}
                    >
                      <span className="text-xl">👏</span>
                      <span className="font-semibold text-sm">{post.claps}</span>
                    </button>
                    
                    <button
                      onClick={() => toggleDrop(post.id)}
                      className={`flex items-center space-x-2 transition-all ${
                        post.hasDropped ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <span className="text-xl">💬</span>
                      <span className="font-semibold text-sm">{post.drops}</span>
                    </button>
                    
                    <button
                      onClick={() => toggleSpread(post.id)}
                      className={`flex items-center space-x-2 transition-all ${
                        post.hasSpread ? 'text-green-500' : 'text-gray-600 hover:text-green-500'
                      }`}
                    >
                      <span className="text-xl">🌍</span>
                      <span className="font-semibold text-sm">{post.spreads}</span>
                    </button>
                  </div>
                  
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        )) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-purple-600" />
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

      {/* Swap Board Section */}
      <div className="mx-4 my-6 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Swap Board</span>
          </div>
          <button className="text-teal-600 font-medium text-sm hover:text-teal-700">
            Post Exchange
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white border border-teal-100 rounded-xl p-3">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">I can teach:</span> Photoshop
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-semibold">I want to learn:</span> Guitar
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">Posted by Sarah • 2h ago</span>
              <button className="text-teal-600 font-medium text-xs hover:text-teal-700">
                Connect
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-teal-100 rounded-xl p-3">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">I can teach:</span> Python
            </p>
            <p className="text-sm text-gray-900">
              <span className="font-semibold">I want to learn:</span> Cooking
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">Posted by Alex • 4h ago</span>
              <button className="text-teal-600 font-medium text-xs hover:text-teal-700">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured User Spotlight */}
      <div className="mx-4 mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span className="font-bold">Spotlight User</span>
          </div>
          <span className="text-sm opacity-90">This week</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
            alt="Featured user"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/30"
          />
          <div className="flex-1">
            <h4 className="font-bold text-lg">Sarah Chen</h4>
            <p className="text-sm opacity-90 mb-1">Top React Developer</p>
            <div className="flex items-center space-x-1 text-sm opacity-80">
              <Star className="w-3 h-3 fill-current" />
              <span>4.9</span>
              <span>•</span>
              <span>127 students taught</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold hover:bg-white/30 transition-all">
              Follow
            </button>
            <button className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold hover:bg-white/30 transition-all">
              Chat
            </button>
          </div>
        </div>
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
                  className="w-8 h-8 rounded-full object-cover"
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
                  <span className="font-medium">Gallery</span>
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