import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { MessageCircle, Star, Zap, Award, Users, Settings, Share2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { profile } = useUser();
  
  // For MVP, we'll show the current user's profile
  const isOwnProfile = !userId || userId === profile?.id;
  const displayProfile = profile;

  if (!displayProfile) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={displayProfile.avatar}
            alt={displayProfile.name}
            className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0 ring-4 ring-white/30 shadow-2xl"
          />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
              <h1 className="text-3xl font-bold text-white">{displayProfile.name}</h1>
              {displayProfile.badges.includes('Verified') && (
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
              )}
            </div>
            
            <p className="text-white/90 mb-6 text-lg font-medium">{displayProfile.bio || "Building skills, one swap at a time ✨"}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="font-bold text-2xl text-white">{displayProfile.swappers}</div>
                <div className="text-white/80 text-sm font-medium">Swappers</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="font-bold text-2xl text-white">{displayProfile.swapping}</div>
                <div className="text-white/80 text-sm font-medium">Swapping</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="font-bold text-2xl text-yellow-300">{displayProfile.skillCoins}</div>
                <div className="text-white/80 text-sm font-medium">SkillCoins</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="font-bold text-2xl text-blue-300">Level {displayProfile.level}</div>
                <div className="text-white/80 text-sm font-medium">Mentor</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            {isOwnProfile ? (
              <>
                <button className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all font-bold">
                  <Settings className="w-6 h-6" />
                  <span>Edit Profile</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all font-bold">
                  <Share2 className="w-6 h-6" />
                  <span>Share</span>
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-purple-600 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-lg">
                  <Users className="w-6 h-6" />
                  <span>Connect</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all font-bold">
                  <MessageCircle className="w-6 h-6" />
                  <span>Message</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <Award className="w-5 h-5 text-white" />
          </div>
          Achievements
        </h2>
        <div className="flex flex-wrap gap-4">
          {displayProfile.badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 px-6 py-3 rounded-2xl shadow-sm">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-bold">{badge}</span>
            </div>
          ))}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 px-6 py-3 rounded-2xl shadow-sm">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-bold">Active Learner</span>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Teaching Skills */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            Can Teach
          </h2>
          <div className="space-y-4">
            {displayProfile.teachSkills.length > 0 ? (
              displayProfile.teachSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{skill.name}</h3>
                    <p className="text-green-600 text-sm font-semibold">Level {skill.level} • Expert</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-xl">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-800">25 coins/hr</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-gray-600 font-medium">No teaching skills added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Skills */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            Wants to Learn
          </h2>
          <div className="space-y-4">
            {displayProfile.learnSkills.length > 0 ? (
              displayProfile.learnSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{skill.name}</h3>
                    <p className="text-blue-600 text-sm font-semibold">Beginner • Eager to learn</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-xl">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-800">20 coins/hr</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-gray-600 font-medium">No learning goals added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg">Earned 25 SkillCoins teaching React</p>
              <p className="text-gray-500 font-medium">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg">Completed JavaScript Basics certificate</p>
              <p className="text-gray-500 font-medium">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg">Connected with new skill partner</p>
              <p className="text-gray-500 font-medium">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;