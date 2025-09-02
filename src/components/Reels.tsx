import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, MoreVertical, Camera, Upload, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { usePost } from '../contexts/PostContext';

const Reels: React.FC = () => {
  const { profile } = useUser();
  const { reels, toggleClap, toggleDrop, toggleSpread, addPost } = usePost();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReel, setNewReel] = useState({
    caption: '',
    category: 'education' as 'job' | 'education' | 'technology',
    videoFile: null as File | null
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentReel = reels[currentReelIndex];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentReelIndex]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleSwipeUp = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleSwipeDown = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleCreateReel = () => {
    if (!profile) return;
    setShowCreateModal(true);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration <= 120) { // 2 minutes
          setNewReel(prev => ({ ...prev, videoFile: file }));
        } else {
          alert('Video must be 2 minutes or less');
        }
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handlePublishReel = () => {
    if (!profile || !newReel.videoFile) return;

    const videoUrl = URL.createObjectURL(newReel.videoFile);
    addPost(newReel.caption, videoUrl, 'reel', newReel.category);
    
    setShowCreateModal(false);
    setNewReel({ caption: '', category: 'education', videoFile: null });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job': return 'bg-green-500';
      case 'education': return 'bg-blue-500';
      case 'technology': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Join SkillSwap</h2>
          <p className="text-gray-400">Sign up to watch and create Sparks</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <button
          onClick={handleCreateReel}
          className="absolute top-4 right-4 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Camera className="w-6 h-6" />
        </button>
        
        <div className="text-white text-center p-8">
          <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No Sparks Yet</h2>
          <p className="text-gray-400 mb-6">Be the first to share your knowledge!</p>
          <button
            onClick={handleCreateReel}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Create Your First Spark
          </button>
        </div>

        {/* Create Spark Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Create Spark</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video (Max 2 minutes)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {newReel.videoFile ? newReel.videoFile.name : 'Tap to select video'}
                    </p>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                  <textarea
                    value={newReel.caption}
                    onChange={(e) => setNewReel(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Share your knowledge..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newReel.category}
                    onChange={(e) => setNewReel(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="education">📚 Education</option>
                    <option value="job">💼 Jobs</option>
                    <option value="technology">💻 Technology</option>
                  </select>
                </div>

                <button
                  onClick={handlePublishReel}
                  disabled={!newReel.videoFile || !newReel.caption.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Publish Spark
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Create Spark Button */}
      <button
        onClick={handleCreateReel}
        className="absolute top-4 right-4 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Camera className="w-6 h-6" />
      </button>

      {/* Reel Container */}
      <div className="relative h-full w-full">
        {currentReel && (
          <>
            {/* Video */}
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="w-20 h-20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{currentReel.userName}</h3>
                <p className="text-sm opacity-80">{currentReel.content}</p>
              </div>
            </div>

            {/* User Info & Caption */}
            <div className="absolute bottom-20 left-4 right-20 text-white">
              <div className="flex items-center mb-3">
                <img
                  src={currentReel.userAvatar}
                  alt={currentReel.userName}
                  className="w-12 h-12 rounded-full border-2 border-white mr-3"
                />
                <div>
                  <h3 className="font-semibold text-lg">{currentReel.userName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentReel.category)} text-white`}>
                    {currentReel.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{currentReel.content}</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleClap(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.hasClapped 
                      ? 'bg-yellow-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">👏</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">
                  {currentReel.claps > 999 ? `${(currentReel.claps / 1000).toFixed(1)}k` : currentReel.claps}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleDrop(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.hasDropped 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">💬</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentReel.drops}</span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleSpread(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.hasSpread 
                      ? 'bg-green-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">🌍</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentReel.spreads}</span>
              </div>

              <button className="p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all">
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Volume Control */}
            <button
              onClick={handleMuteToggle}
              className="absolute top-20 right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Navigation Indicators */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
              {reels.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-8 rounded-full transition-all ${
                    index === currentReelIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Swipe Areas */}
        <div
          className="absolute top-0 left-0 w-full h-1/2 z-10"
          onClick={handleSwipeDown}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1/2 z-10"
          onClick={handleSwipeUp}
        />
      </div>

      {/* Create Spark Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Spark</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video (Max 2 minutes)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {newReel.videoFile ? newReel.videoFile.name : 'Tap to select video from Gallery'}
                  </p>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  value={newReel.caption}
                  onChange={(e) => setNewReel(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Share your knowledge..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newReel.category}
                  onChange={(e) => setNewReel(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="education">📚 Education</option>
                  <option value="job">💼 Jobs</option>
                  <option value="technology">💻 Technology</option>
                </select>
              </div>

              <button
                onClick={handlePublishReel}
                disabled={!newReel.videoFile || !newReel.caption.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Publish Spark
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Create Spark Button */}
      <button
        onClick={handleCreateReel}
        className="absolute top-4 right-4 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Camera className="w-6 h-6" />
      </button>

      {/* Reel Container */}
      <div className="relative h-full w-full">
        {currentReel && (
          <>
            {/* Video Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="w-20 h-20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{currentReel.userName}</h3>
                <p className="text-sm opacity-80">{currentReel.content}</p>
              </div>
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Play className="w-20 h-20 text-white opacity-80" />
              </div>
            )}

            {/* User Info & Caption */}
            <div className="absolute bottom-20 left-4 right-20 text-white">
              <div className="flex items-center mb-3">
                <img
                  src={currentReel.userAvatar}
                  alt={currentReel.userName}
                  className="w-12 h-12 rounded-full border-2 border-white mr-3"
                />
                <div>
                  <h3 className="font-semibold text-lg">{currentReel.userName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentReel.category)} text-white`}>
                    {currentReel.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{currentReel.content}</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleClap(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.hasClapped 
                      ? 'bg-yellow-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">👏</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">
                  {currentReel.claps > 999 ? `${(currentReel.claps / 1000).toFixed(1)}k` : currentReel.claps}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleDrop(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.hasDropped 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">💬</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentReel.drops}</span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleSpread(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.hasSpread 
                      ? 'bg-green-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">🌍</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentReel.spreads}</span>
              </div>

              <button className="p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all">
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Volume Control */}
            <button
              onClick={handleMuteToggle}
              className="absolute top-20 right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Navigation Indicators */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
              {reels.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-8 rounded-full transition-all ${
                    index === currentReelIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Swipe Areas */}
        <div
          className="absolute top-0 left-0 w-full h-1/2 z-10"
          onClick={handleSwipeDown}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1/2 z-10"
          onClick={handleSwipeUp}
        />
      </div>

      {/* Create Spark Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Spark</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video (Max 2 minutes)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {newReel.videoFile ? newReel.videoFile.name : 'Tap to select video from Gallery'}
                  </p>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  value={newReel.caption}
                  onChange={(e) => setNewReel(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Share your knowledge..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newReel.category}
                  onChange={(e) => setNewReel(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="education">📚 Education</option>
                  <option value="job">💼 Jobs</option>
                  <option value="technology">💻 Technology</option>
                </select>
              </div>

              <button
                onClick={handlePublishReel}
                disabled={!newReel.videoFile || !newReel.caption.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Publish Spark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;