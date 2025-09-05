import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { usePost } from '../contexts/PostContext';
import { 
  MessageCircle, 
  Video, 
  Star, 
  Zap, 
  Award, 
  Users, 
  Settings, 
  Share2, 
  Grid, 
  Play, 
  Camera, 
  Plus, 
  Edit, 
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Crown,
  Target,
  BookOpen,
  Heart,
  Eye,
  Clock,
  Mail,
  Link as LinkIcon,
  ChevronRight,
  Badge
} from 'lucide-react';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { profile, getUserById, toggleSwap, addChatUser } = useUser();
  const { posts, reels } = usePost();
  const [activeTab, setActiveTab] = useState<'posts' | 'sparks' | 'skills' | 'hubs'>('posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile?.bio || '',
    name: profile?.name || '',
    location: profile?.location || '',
    email: profile?.email || '',
    website: profile?.website || ''
  });
  
  const isOwnProfile = !userId || userId === profile?.id;
  const displayProfile = isOwnProfile ? profile : getUserById(userId);

  if (!displayProfile) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">User not found</h3>
          <Link to="/search" className="text-purple-600 hover:text-purple-700 font-medium">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const isSwapping = profile?.isSwappingWith.includes(displayProfile.id) || false;
  const userPosts = posts.filter(post => post.userId === displayProfile.id);
  const userReels = reels.filter(reel => reel.userId === displayProfile.id);

  const handleSwap = () => {
    if (!isOwnProfile) {
      toggleSwap(displayProfile.id);
    }
  };

  const handleMessage = () => {
    if (!isOwnProfile) {
      addChatUser(displayProfile.id);
    }
  };

  const handleVideoCall = () => {
    alert('Starting live learning session...');
  };

  const handleScheduleSession = () => {
    alert('Opening session scheduler...');
  };

  const handleEditProfile = () => {
    if (profile) {
      profile.bio = editData.bio;
      profile.name = editData.name;
      profile.location = editData.location;
      profile.email = editData.email;
      profile.website = editData.website;
      setShowEditProfile(false);
    }
  };

  const skillCategories = [
    { name: 'Design', skills: ['UI/UX Design', 'Graphic Design'], color: 'from-pink-500 to-rose-600' },
    { name: 'Coding', skills: ['React', 'Python', 'JavaScript'], color: 'from-blue-500 to-indigo-600' },
    { name: 'Languages', skills: ['Spanish', 'French'], color: 'from-green-500 to-emerald-600' },
    { name: 'Business', skills: ['Marketing', 'Sales'], color: 'from-purple-500 to-violet-600' }
  ];

  const achievements = [
    { name: 'Skill Master', icon: Crown, color: 'text-yellow-500', description: 'Mastered 5+ skills' },
    { name: 'Great Teacher', icon: Award, color: 'text-blue-500', description: '100+ sessions taught' },
    { name: 'Community Builder', icon: Users, color: 'text-green-500', description: 'Created 3 hubs' },
    { name: 'Rising Star', icon: Star, color: 'text-purple-500', description: '1000+ claps received' }
  ];

  const stats = [
    { label: 'Posts', value: userPosts.length, icon: Grid },
    { label: 'Sparks', value: userReels.length, icon: Play },
    { label: 'Sessions', value: 47, icon: Video },
    { label: 'Hubs', value: 8, icon: Users }
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <img
              src={displayProfile.avatar}
              alt={displayProfile.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg mx-auto"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
            {displayProfile.isOnline && (
              <div className="absolute bottom-2 right-1/2 transform translate-x-8 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* Name and Handle */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{displayProfile.name}</h1>
              {displayProfile.badges?.includes('Verified') && (
                <Shield className="w-5 h-5 text-blue-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600">@{displayProfile.name.toLowerCase().replace(' ', '')}</p>
            
            {/* Level Badge */}
            <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full mt-2">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Level {displayProfile.level}</span>
            </div>
          </div>

          {/* Bio */}
          <div className="text-center mb-4">
            <p className="text-gray-900 leading-relaxed mb-2">
              {displayProfile.bio || "Building skills, one swap at a time ✨"}
            </p>
            
            {/* Location and Contact */}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              {displayProfile.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{displayProfile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(displayProfile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-lg text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Follower Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="font-bold text-gray-900">{displayProfile.swappers || 0}</div>
              <div className="text-sm text-gray-600">Swappers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">{displayProfile.swapping || 0}</div>
              <div className="text-sm text-gray-600">Swapping</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isOwnProfile ? (
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleSwap}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                    isSwapping
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isSwapping ? 'Swapping' : 'Swap'}
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleMessage}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                  <button
                    onClick={handleScheduleSession}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-gray-100 bg-white sticky top-16 z-10">
        <div className="flex">
          {[
            { key: 'posts', label: 'Posts', icon: Grid },
            { key: 'sparks', label: 'Sparks', icon: Play },
            { key: 'skills', label: 'Skills', icon: Target },
            { key: 'hubs', label: 'Hubs', icon: Users }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map(post => (
                <div key={post.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-2">
                      <p className="text-xs text-gray-700 text-center line-clamp-4 font-medium">
                        {post.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">
                {isOwnProfile ? 'Share your first post!' : `${displayProfile.name} hasn't posted yet`}
              </p>
              {isOwnProfile && (
                <Link 
                  to="/home"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>
              )}
            </div>
          )
        )}

        {activeTab === 'sparks' && (
          userReels.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {userReels.map(reel => (
                <div key={reel.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-xs text-white font-medium line-clamp-2 bg-black/50 rounded p-1">
                      {reel.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No sparks yet</h3>
              <p className="text-gray-600 mb-4">
                {isOwnProfile ? 'Create your first spark!' : `${displayProfile.name} hasn't created sparks yet`}
              </p>
              {isOwnProfile && (
                <Link 
                  to="/sparks"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Create Spark</span>
                </Link>
              )}
            </div>
          )
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Skills by Category */}
            {skillCategories.map(category => (
              <div key={category.name} className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <div className={`w-4 h-4 bg-gradient-to-r ${category.color} rounded-full`}></div>
                  <span>{category.name}</span>
                </h3>
                <div className="space-y-2">
                  {category.skills.map(skill => (
                    <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{skill}</h4>
                          <p className="text-sm text-gray-600">Expert Level</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                        <span className="text-xs text-gray-500">23 endorsements</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Achievements */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Achievements</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <div key={achievement.name} className="bg-gradient-to-r from-gray-50 to-purple-50 p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                      <h4 className="font-semibold text-gray-900 text-sm">{achievement.name}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hubs' && (
          <div className="space-y-4">
            {/* Created Hubs */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Created Hubs</h3>
              <div className="space-y-3">
                {['React Developers', 'UI/UX Designers'].map(hub => (
                  <div key={hub} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{hub}</h4>
                      <p className="text-sm text-gray-600">1.2k members • Active</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Joined Hubs */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Joined Hubs</h3>
              <div className="space-y-3">
                {['JavaScript Masters', 'Design Thinking', 'Career Growth'].map(hub => (
                  <div key={hub} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{hub}</h4>
                      <p className="text-sm text-gray-600">856 members • Member</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={handleEditProfile}
                  className="text-purple-600 hover:text-purple-700 font-bold"
                >
                  Save
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={displayProfile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Tap to change profile picture</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;