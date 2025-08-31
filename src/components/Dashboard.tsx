import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Star, 
  Clock, 
  MessageCircle,
  Zap,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { profile, allUsers } = useUser();
  const { user } = useAuth();

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate skill matches based on user's learning interests and other users' teaching skills
  const skillMatches = allUsers
    .filter(u => u.id !== profile.id)
    .map(otherUser => {
      const matchingSkills = profile.learnSkills.filter(skill => 
        otherUser.teachSkills.some(teachSkill => 
          teachSkill.name.toLowerCase().includes(skill.name.toLowerCase()) ||
          skill.name.toLowerCase().includes(teachSkill.name.toLowerCase())
        )
      );
      
      const compatibility = Math.min(95, Math.max(65, 
        (matchingSkills.length / Math.max(profile.learnSkills.length, 1)) * 100 + 
        Math.random() * 20
      ));
      
      return {
        ...otherUser,
        matchingSkills,
        compatibility: Math.round(compatibility)
      };
    })
    .filter(match => match.matchingSkills.length > 0)
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 6);

  const upcomingSwaps = [
    {
      id: 1,
      skill: 'React Development',
      partner: 'Sarah Chen',
      time: '2:00 PM',
      type: 'micro',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 2,
      skill: 'Spanish Conversation',
      partner: 'Carlos Rodriguez',
      time: '4:30 PM',
      type: 'full',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    }
  ];

  const quickActions = [
    { icon: Users, label: 'Find Swappers', color: 'bg-purple-500', action: 'search' },
    { icon: Calendar, label: 'Schedule Swap', color: 'bg-teal-500', action: 'schedule' },
    { icon: Zap, label: 'Quick Match', color: 'bg-orange-500', action: 'quick' },
    { icon: MessageCircle, label: 'Messages', color: 'bg-blue-500', action: 'chat' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile.name}! 👋
              </h1>
              <p className="text-gray-600">Ready to swap some skills today?</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900">{profile.skillCoins}</span>
                  <span className="text-sm text-gray-600">SkillCoins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Skill Matches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">AI Skill Matches</h2>
                      <p className="text-sm text-gray-600">Perfect swappers for your learning goals</p>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {skillMatches.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {skillMatches.map((match) => (
                      <div key={match.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <img
                            src={match.avatar}
                            alt={match.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{match.name}</h3>
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${match.compatibility >= 85 ? 'bg-green-500' : match.compatibility >= 70 ? 'bg-yellow-500' : 'bg-orange-500'}`}></div>
                                <span className={`text-sm font-medium ${match.compatibility >= 85 ? 'text-green-600' : match.compatibility >= 70 ? 'text-yellow-600' : 'text-orange-600'}`}>
                                  {match.compatibility}%
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{match.bio}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {match.matchingSkills.slice(0, 2).map((skill, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                  {skill}
                                </span>
                              ))}
                              {match.matchingSkills.length > 2 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  +{match.matchingSkills.length - 2} more
                                </span>
                              )}
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02]">
                              Send Swap Request
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Yet</h3>
                    <p className="text-gray-600 mb-4">Complete your profile to find perfect skill swappers!</p>
                    <button className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-200">
                      Complete Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Swaps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Swaps</h2>
                    <p className="text-sm text-gray-600">Your scheduled learning sessions</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {upcomingSwaps.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSwaps.map((swap) => (
                      <div key={swap.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                        <img
                          src={swap.avatar}
                          alt={swap.partner}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{swap.skill}</h3>
                          <p className="text-sm text-gray-600">with {swap.partner}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{swap.time}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            swap.type === 'micro' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {swap.type === 'micro' ? '⚡ Micro' : '⏰ Full'} Swap
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Swaps</h3>
                    <p className="text-gray-600 mb-4">Schedule your first skill swap session!</p>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                      Find Swappers
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{profile.swappers}</p>
                    <p className="text-sm text-gray-600">Swappers</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{profile.swapping}</p>
                    <p className="text-sm text-gray-600">Swapping</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Level Progress</h3>
                  <p className="text-sm text-gray-600">Level {profile.level}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress to Level {profile.level + 1}</span>
                  <span className="font-medium text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500">Complete 3 more swaps to level up!</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>Recent Activity</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Earned 50 SkillCoins</p>
                    <p className="text-xs text-gray-600">Teaching Python basics</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New swapper connected</p>
                    <p className="text-xs text-gray-600">Maria Garcia joined</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Badge unlocked</p>
                    <p className="text-xs text-gray-600">Active Swapper</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Goal */}
            <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Today's Goal</span>
              </h3>
              <p className="text-purple-100 text-sm mb-4">Complete 2 skill swaps</p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-purple-100">1 of 2 completed</p>
            </div>

            {/* Trending Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span>Trending Skills</span>
              </h3>
              
              <div className="space-y-3">
                {['React Development', 'UI/UX Design', 'Spanish', 'Photography', 'Data Science'].map((skill, index) => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{skill}</span>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Learn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}