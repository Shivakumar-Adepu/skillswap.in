import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { usePost } from '../contexts/PostContext';
import { MessageCircle, Video, Star, Zap, Award, Users, Settings, Share2, Grid, Play, Camera, Plus, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { profile, getUserById, toggleSwap, addChatUser } = useUser();
  const { posts, reels } = usePost();
  const [activeTab, setActiveTab] = useState<'posts' | 'sparks'>('posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile?.bio || '',
    name: profile?.name || ''
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

  const handleEditProfile = () => {
    if (profile) {
      profile.bio = editData.bio;
      profile.name = editData.name;
      setShowEditProfile(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={displayProfile.avatar}
            alt={displayProfile.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{displayProfile.name}</h1>
              {displayProfile.badges?.includes('Verified') && (
                <Star className="w-5 h-5 text-blue-500 fill-current" />
              )}
              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full">
                <Zap className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">{displayProfile.level}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-bold text-gray-900">{userPosts.length + userReels.length}</div>
                <div className="text-xs text-gray-600">posts</div>
              </div>
              <div>
                <div className="font-bold text-gray-900">{displayProfile.swappers || 0}</div>
                <div className="text-xs text-gray-600">swappers</div>
              </div>
              <div>
                <div className="font-bold text-gray-900">{displayProfile.swapping || 0}</div>
                <div className="text-xs text-gray-600">swapping</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed">
            {displayProfile.bio || "Building skills, one swap at a time ✨"}
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-3 mb-6">
          {displayProfile.teachSkills && displayProfile.teachSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Can Teach</h3>
              <div className="flex flex-wrap gap-2">
                {displayProfile.teachSkills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🎓 {skill.name} • Level {skill.level}
                  </span>
                ))}
                {displayProfile.teachSkills.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{displayProfile.teachSkills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {displayProfile.learnSkills && displayProfile.learnSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Wants to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {displayProfile.learnSkills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    📚 {skill.name} • Level {skill.level}
                  </span>
                ))}
                {displayProfile.learnSkills.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{displayProfile.learnSkills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isOwnProfile ? (
            <>
              <button 
                onClick={() => setShowEditProfile(true)}
                className="flex-1 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="flex-1 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSwap}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  isSwapping
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isSwapping ? 'Swapping' : 'Swap'}
              </button>
              <button
                onClick={handleMessage}
                className="bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button
                onClick={handleVideoCall}
                className="bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Video className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="font-medium">Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('sparks')}
            className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
              activeTab === 'sparks'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Sparks</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-1">
        {activeTab === 'posts' ? (
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
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>
              )}
            </div>
          )
        ) : (
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
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Create Spark</span>
                </Link>
              )}
            </div>
          )
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100">
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
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;