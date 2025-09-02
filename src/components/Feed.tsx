import React, { useState, useRef } from 'react';
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
  Camera
} from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const { profile, allUsers } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'job' | 'education' | 'technology'>('education');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Stories Section - Other Users Only */}
      {allUsers.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {allUsers.slice(0, 10).map((user) => (
              <div key={user.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="text-xs text-gray-600 font-medium truncate w-16 text-center">
                  {user.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    ×
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