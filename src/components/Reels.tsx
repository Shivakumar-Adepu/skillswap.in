import React, { useState } from 'react';
import { usePost } from '../contexts/PostContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  MoreVertical,
  Plus,
  Camera,
  Briefcase,
  GraduationCap,
  Cpu
} from 'lucide-react';

const Reels: React.FC = () => {
  const { reels, toggleClap, toggleDrop, toggleSpread } = usePost();
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

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
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl">
            Create First Spark
          </button>
        </div>
      </div>
    );
  }

  const reel = reels[currentReel];

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden">
      {/* Reel Video/Content Area */}
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

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-20">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={reel.userAvatar}
            alt={reel.userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
          />
          <div>
            <h3 className="text-white font-bold">{reel.userName}</h3>
            <p className="text-white/80 text-sm">Teaching {reel.category}</p>
          </div>
        </div>
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
    </div>
  );
};

export default Reels;