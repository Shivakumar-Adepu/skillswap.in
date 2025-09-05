import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Users, Star, ArrowRight, MessageCircle, Video } from 'lucide-react';

const OnboardingMatching: React.FC = () => {
  const { profile, allUsers, toggleSwap } = useUser();
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (profile && allUsers.length > 0) {
      // Get users with complementary skills
      const suggestions = allUsers
        .filter(user => user.id !== profile.id)
        .map(user => {
          let matchScore = 0;
          
          // Check skill compatibility
          const teachingMatches = user.teachSkills.filter(teachSkill =>
            profile.learnSkills.some(learnSkill =>
              learnSkill.name.toLowerCase().includes(teachSkill.name.toLowerCase())
            )
          );
          
          const learningMatches = user.learnSkills.filter(learnSkill =>
            profile.teachSkills.some(teachSkill =>
              teachSkill.name.toLowerCase().includes(learnSkill.name.toLowerCase())
            )
          );
          
          matchScore += teachingMatches.length * 3;
          matchScore += learningMatches.length * 2;
          
          return { ...user, matchScore, teachingMatches, learningMatches };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);
      
      setSuggestedUsers(suggestions);
    }
  }, [profile, allUsers]);

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  const handleConnect = () => {
    // Connect with selected users
    selectedUsers.forEach(userId => {
      toggleSwap(userId);
    });
    navigate('/home');
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Find Your Skill Partners</h1>
          <p className="text-lg opacity-90">Connect with people who can help you learn and grow</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {suggestedUsers.map(user => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedUsers.includes(user.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>4.8</span>
                      <span>•</span>
                      <span>{Math.floor(Math.random() * 50) + 10} swaps</span>
                    </div>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {user.bio || 'Passionate about learning and sharing skills'}
                </p>
                
                {/* Match reasons */}
                <div className="space-y-1">
                  {user.teachingMatches?.length > 0 && (
                    <div className="bg-green-100 rounded-lg p-2">
                      <p className="text-xs text-green-800">
                        <span className="font-semibold">Can teach:</span> {user.teachingMatches.slice(0, 2).map(s => s.name).join(', ')}
                      </p>
                    </div>
                  )}
                  {user.learningMatches?.length > 0 && (
                    <div className="bg-blue-100 rounded-lg p-2">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">Wants to learn:</span> {user.learningMatches.slice(0, 2).map(s => s.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip for now
            </button>
            
            <div className="flex space-x-3">
              <span className="text-sm text-gray-600 py-3">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={handleConnect}
                disabled={selectedUsers.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span>Connect & Start</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingMatching;