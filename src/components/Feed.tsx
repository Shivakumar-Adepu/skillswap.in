import React, { useState } from 'react';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { 
  Plus, 
  MoreHorizontal, 
  Bookmark, 
  Send,
  Camera,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  Cpu
} from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const { profile, allUsers } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'job' | 'education' | 'technology'>('education');

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      addPost(newPostContent, undefined, 'post', selectedCategory);
      setNewPostContent('');
      setShowCreatePost(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'job': return <Briefcase className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'technology': return <Cpu className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
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
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Stories Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {/* Your Story */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="relative">
              <img
                src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                alt="Your story"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-2 border-white">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Your story</span>
          </div>

          {/* Other Users' Stories */}
          {allUsers.slice(0, 8).map((user) => (
            <div key={user.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium truncate w-16 text-center">
                {user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Button */}
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl hover:from-purple-50 hover:to-pink-50 transition-all border border-gray-200 hover:border-purple-200"
        >
          <img
            src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-600 font-medium">Share your knowledge...</span>
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-0">
        {posts.length > 0 ? posts.map((post) => (
          <div key={post.id} className="bg-white border-b border-gray-100">
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
                    <h3 className="font-semibold text-gray-900 text-sm">{post.userName}</h3>
                    <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(post.category)} rounded-full flex items-center space-x-1`}>
                      <div className="text-white">
                        {getCategoryIcon(post.category)}
                      </div>
                      <span className="text-white text-xs font-bold capitalize">{post.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{formatTime(post.createdAt)}</p>
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
              <div className="px-4 pb-3">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-2xl object-cover max-h-96"
                />
              </div>
            )}

            {/* Engagement Actions */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => toggleClap(post.id)}
                    className={`flex items-center space-x-2 transition-all transform hover:scale-110 ${
                      post.hasClapped ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    <span className="text-xl">👏</span>
                    <span className="font-semibold text-sm">{post.claps}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleDrop(post.id)}
                    className={`flex items-center space-x-2 transition-all transform hover:scale-110 ${
                      post.hasDropped ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                    }`}
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-semibold text-sm">{post.drops}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleSpread(post.id)}
                    className={`flex items-center space-x-2 transition-all transform hover:scale-110 ${
                      post.hasSpread ? 'text-green-500' : 'text-gray-600 hover:text-green-500'
                    }`}
                  >
                    <span className="text-xl">🌍</span>
                    <span className="font-semibold text-sm">{post.spreads}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to SkillSwape!</h3>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
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
                className="w-full h-32 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Share your knowledge, ask questions, or post opportunities..."
              />

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Gallery</span>
                  </button>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;