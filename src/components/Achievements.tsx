import React from 'react';
import { Award, Star, Users, Zap, Target, Trophy, Crown, Shield } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  reward: number;
  category: 'teaching' | 'learning' | 'social' | 'milestone';
}

const Achievements: React.FC = () => {
  const { profile } = useUser();

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Swap',
      description: 'Complete your first skill swap',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      reward: 50,
      category: 'milestone'
    },
    {
      id: '2',
      title: 'Helpful Teacher',
      description: 'Teach 10 different skills',
      icon: Award,
      color: 'from-green-400 to-emerald-500',
      progress: 3,
      maxProgress: 10,
      isUnlocked: false,
      reward: 100,
      category: 'teaching'
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Learn 5 new skills',
      icon: Target,
      color: 'from-blue-400 to-indigo-500',
      progress: 2,
      maxProgress: 5,
      isUnlocked: false,
      reward: 75,
      category: 'learning'
    },
    {
      id: '4',
      title: 'Community Builder',
      description: 'Connect with 50 swappers',
      icon: Users,
      color: 'from-purple-400 to-pink-500',
      progress: 12,
      maxProgress: 50,
      isUnlocked: false,
      reward: 150,
      category: 'social'
    },
    {
      id: '5',
      title: 'Rising Star',
      description: 'Get 100 claps on your posts',
      icon: Star,
      color: 'from-pink-400 to-rose-500',
      progress: 45,
      maxProgress: 100,
      isUnlocked: false,
      reward: 80,
      category: 'social'
    },
    {
      id: '6',
      title: 'Skill Master',
      description: 'Reach level 10',
      icon: Crown,
      color: 'from-yellow-500 to-amber-600',
      progress: profile?.level || 1,
      maxProgress: 10,
      isUnlocked: false,
      reward: 500,
      category: 'milestone'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'teaching': return '🎓';
      case 'learning': return '📚';
      case 'social': return '👥';
      case 'milestone': return '🏆';
      default: return '⭐';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Achievements</h1>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
            <div className="text-sm opacity-90">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm opacity-90">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{unlockedAchievements.reduce((sum, a) => sum + a.reward, 0)}</div>
            <div className="text-sm opacity-90">Coins Earned</div>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span>🏆</span>
            <span>Unlocked</span>
          </h2>
          
          <div className="space-y-3">
            {unlockedAchievements.map(achievement => {
              const IconComponent = achievement.icon;
              return (
                <div key={achievement.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                          <Zap className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-bold text-green-600">+{achievement.reward}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                        <span className="text-xs text-gray-500">{getCategoryIcon(achievement.category)} {achievement.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <span>🎯</span>
          <span>In Progress</span>
        </h2>
        
        <div className="space-y-3">
          {lockedAchievements.map(achievement => {
            const IconComponent = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <div key={achievement.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center opacity-60`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                      <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-bold text-gray-600">{achievement.reward}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{getCategoryIcon(achievement.category)} {achievement.category}</span>
                        <span className="text-xs font-medium text-gray-700">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${achievement.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;