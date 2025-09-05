import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { ChevronLeft, ChevronRight, Star, MessageCircle, Video } from 'lucide-react';

const SuggestedConnections: React.FC = () => {
  const { profile, allUsers, toggleSwap } = useUser();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (profile && allUsers.length > 0) {
      // Smart matching algorithm
      const suggestions = allUsers
        .filter(user => !profile.isSwappingWith.includes(user.id))
        .map(user => {
          let matchScore = 0;
          
          // Check if user teaches what current user wants to learn
          const teachingMatches = user.teachSkills.filter(teachSkill =>
            profile.learnSkills.some(learnSkill =>
              learnSkill.name.toLowerCase().includes(teachSkill.name.toLowerCase()) ||
              teachSkill.name.toLowerCase().includes(learnSkill.name.toLowerCase())
            )
          );
          
          // Check if user wants to learn what current user teaches
          const learningMatches = user.learnSkills.filter(learnSkill =>
            profile.teachSkills.some(teachSkill =>
              teachSkill.name.toLowerCase().includes(learnSkill.name.toLowerCase()) ||
              learnSkill.name.toLowerCase().includes(teachSkill.name.toLowerCase())
            )
          );
          
          matchScore += teachingMatches.length * 3; // Higher weight for teaching matches
          matchScore += learningMatches.length * 2;
          
          // Bonus for similar skill categories
          const commonCategories = user.teachSkills.filter(skill =>
            profile.teachSkills.some(pSkill => pSkill.category === skill.category)
          );
          matchScore += commonCategories.length;
          
          return { ...user, matchScore, teachingMatches, learningMatches };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);
      
      setSuggestedUsers(suggestions);
    }
  }, [profile, allUsers]);

  const nextSuggestion = () => {
    setCurrentIndex((prev) => 
      prev >= suggestedUsers.length - 1 ? 0 : prev + 1
    );
  };

  const prevSuggestion = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? suggestedUsers.length - 1 : prev - 1
    );
  };

  const handleSwap = (userId: string) => {
    toggleSwap(userId);
  };

  if (suggestedUsers.length === 0) return null;

  const currentUser = suggestedUsers[currentIndex];

  return (
    <div className="mx-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Perfect Matches for You</h3>
        <span className="text-sm text-purple-600 font-medium">
          {currentIndex + 1} of {suggestedUsers.length}
        </span>
      </div>
      
      <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 shadow-sm">
        {suggestedUsers.length > 1 && (
          <>
            <button
              onClick={prevSuggestion}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center z-10 hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextSuggestion}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center z-10 hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
        
        <div className="px-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200"
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{currentUser.name}</h4>
              <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>4.8</span>
                <span>•</span>
                <span>{Math.floor(Math.random() * 50) + 10} swaps</span>
              </div>
              <p className="text-sm text-gray-600">{currentUser.bio || 'Passionate about learning and teaching'}</p>
            </div>
          </div>
          
          {/* Match Reasons */}
          <div className="space-y-2 mb-4">
            {currentUser.teachingMatches?.length > 0 && (
              <div className="bg-green-100 border border-green-200 rounded-lg p-2">
                <p className="text-xs text-green-800">
                  <span className="font-semibold">Can teach you:</span> {currentUser.teachingMatches.slice(0, 2).map(s => s.name).join(', ')}
                </p>
              </div>
            )}
            {currentUser.learningMatches?.length > 0 && (
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-2">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Wants to learn:</span> {currentUser.learningMatches.slice(0, 2).map(s => s.name).join(', ')}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleSwap(currentUser.id)}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Swap
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Video className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedConnections;