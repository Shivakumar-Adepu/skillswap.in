import React, { useState, useRef } from 'react';
import { usePost } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  MoreVertical,
  Plus,
  Camera,
  Video,
  Briefcase,
  GraduationCap,
  Cpu
} from 'lucide-react';

const Reels: React.FC = () => {
  const { reels, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const { profile } = useUser();
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showCreateSpark, setShowCreateSpark] = useState(false);
  const [newSparkContent, setNewSparkContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'job' | 'education' | 'technology'>('education');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateSpark = () => {
    if (newSparkContent.trim()) {
      addPost(newSparkContent, selectedVideo || undefined, 'reel', selectedCategory);
      setNewSparkContent('');
      setSelectedVideo(null);
      setShowCreateSpark(false);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if video is under 2 minutes (120 seconds)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 120) {
          alert('Video must be 2 minutes or less');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedVideo(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      };
      video.src = URL.createObjectURL(file);
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

  if (reels.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-black min-h-screen flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">No Sparks Yet!</h3>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Be the first to create educational content and inspire others to learn
          </p>
          <button 
            onClick={() => setShowCreateSpark(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl"
          >
            Create First Spark
          </button>
        </div>

        {/* Create Spark Modal */}
        {showCreateSpark && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Create Spark</h2>
                  <button
                    onClick={() => {
                      setShowCreateSpark(false);
                      setSelectedVideo(null);
                      setNewSparkContent('');
                    }}
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
                  value={newSparkContent}
                  onChange={(e) => setNewSparkContent(e.target.value)}
                  className="w-full h-24 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  placeholder="Describe your educational spark..."
                />

                {selectedVideo && (
                  <div className="relative">
                    <video
                      src={selectedVideo}
                      className="w-full h-48 object-cover rounded-2xl"
                      controls
                    />
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Video (max 2 min)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                  
                  <button
                    onClick={handleCreateSpark}
                    disabled={!newSparkContent.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Create Spark
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const reel = reels[currentReel];

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden">
      {/* Create Spark Button */}
      <button
        onClick={() => setShowCreateSpark(true)}
        className="absolute top-20 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Reel Content Area */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white p-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${getCategoryColor(reel.category)} rounded-full mb-6 shadow-lg`}>
            {getCategoryIcon(reel.category)}
            <span className="text-white text-sm font-bold capitalize">{reel.category}</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 leading-tight">{reel.content}</h2>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img
              src={reel.userAvatar}
              alt={reel.userName}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
            />
            <span className="text-white/90 font-medium">{reel.userName}</span>
          </div>
        </div>

        {/* Play/Pause Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
        >
          {isPlaying ? (
            <Pause className="w-16 h-16 text-white" />
          ) : (
            <Play className="w-16 h-16 text-white" />
          )}
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col space-y-6">
        <div className="text-center">
          <button
            onClick={() => toggleClap(reel.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              reel.hasClapped ? 'bg-orange-500 shadow-lg' : 'bg-black/30 backdrop-blur-sm'
            }`}
          >
            <span className="text-2xl">👏</span>
          </button>
          <span className="text-white text-xs font-bold mt-1 block">{reel.claps}</span>
        </div>

        <div className="text-center">
          <button
            onClick={() => toggleDrop(reel.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              reel.hasDropped ? 'bg-blue-500 shadow-lg' : 'bg-black/30 backdrop-blur-sm'
            }`}
          >
            <span className="text-2xl">💬</span>
          </button>
          <span className="text-white text-xs font-bold mt-1 block">{reel.drops}</span>
        </div>

        <div className="text-center">
          <button
            onClick={() => toggleSpread(reel.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              reel.hasSpread ? 'bg-green-500 shadow-lg' : 'bg-black/30 backdrop-blur-sm'
            }`}
          >
            <span className="text-2xl">🌍</span>
          </button>
          <span className="text-white text-xs font-bold mt-1 block">{reel.spreads}</span>
        </div>

        <button className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all">
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Audio Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-20 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Navigation Dots */}
      {reels.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReel(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentReel ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Create Spark Modal */}
      {showCreateSpark && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Spark</h2>
                <button
                  onClick={() => {
                    setShowCreateSpark(false);
                    setSelectedVideo(null);
                    setNewSparkContent('');
                  }}
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
                value={newSparkContent}
                onChange={(e) => setNewSparkContent(e.target.value)}
                className="w-full h-24 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Describe your educational spark..."
              />

              {selectedVideo && (
                <div className="relative">
                  <video
                    src={selectedVideo}
                    className="w-full h-48 object-cover rounded-2xl"
                    controls
                  />
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-sm font-medium">Add Video (max 2 min)</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                
                <button
                  onClick={handleCreateSpark}
                  disabled={!newSparkContent.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Create Spark
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const reel = reels[currentReel];

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden">
      {/* Create Spark Button */}
      <button
        onClick={() => setShowCreateSpark(true)}
        className="absolute top-20 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Reel Content Area */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white p-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${getCategoryColor(reel.category)} rounded-full mb-6 shadow-lg`}>
            {getCategoryIcon(reel.category)}
            <span className="text-white text-sm font-bold capitalize">{reel.category}</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 leading-tight">{reel.content}</h2>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img
              src={reel.userAvatar}
              alt={reel.userName}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
            />
            <span className="text-white/90 font-medium">{reel.userName}</span>
          </div>
        </div>

        {/* Play/Pause Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
        >
          {isPlaying ? (
            <Pause className="w-16 h-16 text-white" />
          ) : (
            <Play className="w-16 h-16 text-white" />
          )}
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col space-y-6">
        <div className="text-center">
          <button
            onClick={() => toggleClap(reel.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              reel.hasClapped ? 'bg-orange-500 shadow-lg' : 'bg-black/30 backdrop-blur-sm'
            }`}
          >
            <span className="text-2xl">👏</span>
          </button>
          <span className="text-white text-xs font-bold mt-1 block">{reel.claps}</span>
        </div>

        <div className="text-center">
          <button
            onClick={() => toggleDrop(reel.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              reel.hasDropped ? 'bg-blue-500 shadow-lg' : 'bg-black/30 backdrop-blur-sm'
            }`}
          >
            <span className="text-2xl">💬</span>
          </button>
          <span className="text-white text-xs font-bold mt-1 block">{reel.drops}</span>
        </div>

        <div className="text-center">
          <button
            onClick={() => toggleSpread(reel.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
              reel.hasSpread ? 'bg-green-500 shadow-lg' : 'bg-black/30 backdrop-blur-sm'
            }`}
          >
            <span className="text-2xl">🌍</span>
          </button>
          <span className="text-white text-xs font-bold mt-1 block">{reel.spreads}</span>
        </div>

        <button className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all">
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Audio Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-20 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Navigation Dots */}
      {reels.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReel(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentReel ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Create Spark Modal */}
      {showCreateSpark && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Spark</h2>
                <button
                  onClick={() => {
                    setShowCreateSpark(false);
                    setSelectedVideo(null);
                    setNewSparkContent('');
                  }}
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
                value={newSparkContent}
                onChange={(e) => setNewSparkContent(e.target.value)}
                className="w-full h-24 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Describe your educational spark..."
              />

              {selectedVideo && (
                <div className="relative">
                  <video
                    src={selectedVideo}
                    className="w-full h-48 object-cover rounded-2xl"
                    controls
                  />
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-sm font-medium">Add Video (max 2 min)</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                
                <button
                  onClick={handleCreateSpark}
                  disabled={!newSparkContent.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Create Spark
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;