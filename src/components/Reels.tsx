import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, MoreVertical, Camera, Upload } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Reel {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  videoUrl: string;
  caption: string;
  category: 'jobs' | 'education' | 'technology';
  claps: number;
  drops: number;
  spreads: number;
  timestamp: Date;
  isClapped: boolean;
  isDropped: boolean;
  isSpread: boolean;
}

const Reels: React.FC = () => {
  const { profile, allUsers } = useUser();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReel, setNewReel] = useState({
    caption: '',
    category: 'education' as 'jobs' | 'education' | 'technology',
    videoFile: null as File | null
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample reels data - in production this would come from your backend
  const [reels, setReels] = useState<Reel[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'TechGuru_Sarah',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      caption: '5 Essential JavaScript Tips Every Developer Should Know! 🚀 #WebDev #JavaScript #Programming',
      category: 'technology',
      claps: 1247,
      drops: 89,
      spreads: 156,
      timestamp: new Date('2024-01-15T10:30:00'),
      isClapped: false,
      isDropped: false,
      isSpread: false
    },
    {
      id: '2',
      userId: 'user2',
      username: 'CareerCoach_Mike',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      caption: 'How to Ace Your Next Job Interview - Top 3 Mistakes to Avoid! 💼 #CareerTips #JobInterview #Success',
      category: 'jobs',
      claps: 892,
      drops: 67,
      spreads: 234,
      timestamp: new Date('2024-01-15T09:15:00'),
      isClapped: true,
      isDropped: false,
      isSpread: false
    },
    {
      id: '3',
      userId: 'user3',
      username: 'EduExplorer_Lisa',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      caption: 'Learn Python in 60 Seconds! Quick tutorial for beginners 🐍 #Python #Education #Coding',
      category: 'education',
      claps: 2156,
      drops: 145,
      spreads: 89,
      timestamp: new Date('2024-01-15T08:45:00'),
      isClapped: false,
      isDropped: true,
      isSpread: false
    }
  ]);

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

  const handleClap = (reelId: string) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isClapped: !reel.isClapped,
            claps: reel.isClapped ? reel.claps - 1 : reel.claps + 1
          }
        : reel
    ));
  };

  const handleDrop = (reelId: string) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isDropped: !reel.isDropped,
            drops: reel.isDropped ? reel.drops - 1 : reel.drops + 1
          }
        : reel
    ));
  };

  const handleSpread = (reelId: string) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isSpread: !reel.isSpread,
            spreads: reel.isSpread ? reel.spreads - 1 : reel.spreads + 1
          }
        : reel
    ));
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
      // Check video duration (2 minutes max)
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

    const newReelData: Reel = {
      id: Date.now().toString(),
      userId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      videoUrl: URL.createObjectURL(newReel.videoFile),
      caption: newReel.caption,
      category: newReel.category,
      claps: 0,
      drops: 0,
      spreads: 0,
      timestamp: new Date(),
      isClapped: false,
      isDropped: false,
      isSpread: false
    };

    setReels(prev => [newReelData, ...prev]);
    setShowCreateModal(false);
    setNewReel({ caption: '', category: 'education', videoFile: null });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'jobs': return 'bg-blue-500';
      case 'education': return 'bg-green-500';
      case 'technology': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Join SkillSwape</h2>
          <p className="text-gray-400">Sign up to watch and create Sparks</p>
        </div>
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
            <video
              ref={videoRef}
              src={currentReel.videoUrl}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              onClick={handleVideoClick}
              onEnded={() => handleSwipeUp()}
            />

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
                  src={currentReel.avatar}
                  alt={currentReel.username}
                  className="w-12 h-12 rounded-full border-2 border-white mr-3"
                />
                <div>
                  <h3 className="font-semibold text-lg">{currentReel.username}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentReel.category)} text-white`}>
                    {currentReel.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{currentReel.caption}</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6">
              {/* Clap */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleClap(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.isClapped 
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

              {/* Drop */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDrop(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.isDropped 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">💬</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentReel.drops}</span>
              </div>

              {/* Spread */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleSpread(currentReel.id)}
                  className={`p-3 rounded-full transition-all ${
                    currentReel.isSpread 
                      ? 'bg-green-500 scale-110' 
                      : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                  }`}
                >
                  <span className="text-2xl">🌍</span>
                </button>
                <span className="text-white text-xs mt-1 font-medium">{currentReel.spreads}</span>
              </div>

              {/* More Options */}
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Spark</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Video Upload */}
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

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={newReel.caption}
                  onChange={(e) => setNewReel(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Share your knowledge..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newReel.category}
                  onChange={(e) => setNewReel(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="education">📚 Education</option>
                  <option value="jobs">💼 Jobs</option>
                  <option value="technology">💻 Technology</option>
                </select>
              </div>

              {/* Publish Button */}
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

      {/* Empty State */}
      {reels.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
          <div>
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
        </div>
      )}
    </div>
  );
};

export default Reels;