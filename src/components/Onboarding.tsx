import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Plus, X, ArrowRight } from 'lucide-react';

const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Marketing',
  'Languages',
  'Music',
  'Photography',
  'Writing',
  'Business',
  'Fitness',
  'Cooking'
];

const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'UI/UX Design', 'Photography',
  'Spanish', 'Guitar', 'Digital Marketing', 'Content Writing', 'Yoga'
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    teachSkills: [] as string[],
    learnSkills: [] as string[],
    customTeachSkill: '',
    customLearnSkill: ''
  });

  const handleAddSkill = (skill: string, type: 'teach' | 'learn') => {
    if (type === 'teach' && !formData.teachSkills.includes(skill)) {
      setFormData(prev => ({ ...prev, teachSkills: [...prev.teachSkills, skill] }));
    } else if (type === 'learn' && !formData.learnSkills.includes(skill)) {
      setFormData(prev => ({ ...prev, learnSkills: [...prev.learnSkills, skill] }));
    }
  };

  const handleRemoveSkill = (skill: string, type: 'teach' | 'learn') => {
    if (type === 'teach') {
      setFormData(prev => ({ 
        ...prev, 
        teachSkills: prev.teachSkills.filter(s => s !== skill) 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        learnSkills: prev.learnSkills.filter(s => s !== skill) 
      }));
    }
  };

  const handleAddCustomSkill = (type: 'teach' | 'learn') => {
    const skillName = type === 'teach' ? formData.customTeachSkill : formData.customLearnSkill;
    if (skillName.trim()) {
      handleAddSkill(skillName.trim(), type);
      setFormData(prev => ({ 
        ...prev, 
        [type === 'teach' ? 'customTeachSkill' : 'customLearnSkill']: '' 
      }));
    }
  };

  const handleFinish = () => {
    if (profile) {
      const teachSkills = formData.teachSkills.map((name, index) => ({
        id: `teach-${index}`,
        name,
        level: 3,
        category: 'General'
      }));

      const learnSkills = formData.learnSkills.map((name, index) => ({
        id: `learn-${index}`,
        name,
        level: 1,
        category: 'General'
      }));

      updateProfile({
        bio: formData.bio,
        teachSkills,
        learnSkills,
        skillCoins: profile.skillCoins + 50 // Welcome bonus
      });
    }
    navigate('/home');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to SkillSwape!</h2>
              <p className="text-gray-600 text-lg">Let's set up your profile so you can start swapping skills</p>
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="I'm passionate about learning and sharing knowledge..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What can you teach?</h2>
              <p className="text-gray-600">Share your knowledge with others</p>
            </div>

            <div className="space-y-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.customTeachSkill}
                  onChange={(e) => setFormData({ ...formData, customTeachSkill: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add a skill you can teach"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill('teach')}
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomSkill('teach')}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {POPULAR_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill, 'teach')}
                    disabled={formData.teachSkills.includes(skill)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Your teaching skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.teachSkills.map(skill => (
                    <div
                      key={skill}
                      className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill, 'teach')}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What do you want to learn?</h2>
              <p className="text-gray-600">Discover new skills and grow</p>
            </div>

            <div className="space-y-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.customLearnSkill}
                  onChange={(e) => setFormData({ ...formData, customLearnSkill: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add a skill you want to learn"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill('learn')}
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomSkill('learn')}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {POPULAR_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill, 'learn')}
                    disabled={formData.learnSkills.includes(skill)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Skills you want to learn:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.learnSkills.map(skill => (
                    <div
                      key={skill}
                      className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill, 'learn')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between text-white/90 text-lg font-semibold mb-4">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 shadow-inner">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-700 shadow-lg"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20">
          {renderStep()}
          
          <div className="flex justify-between mt-12">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 text-gray-600 hover:text-gray-800 font-bold transition-all hover:bg-gray-50 rounded-2xl"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !formData.bio.trim()) ||
                  (step === 2 && formData.teachSkills.length === 0)
                }
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.05] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-lg"
              >
                <span>Continue</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={formData.learnSkills.length === 0}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-[1.05] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-lg"
              >
                <span>Start Swapping!</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;