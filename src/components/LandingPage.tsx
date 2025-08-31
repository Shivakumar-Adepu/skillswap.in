import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Users, Zap, Award, Mail, Eye, EyeOff } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/home');
      } else {
        await register(formData.email, formData.password, formData.name);
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">SkillSwape</span>
          </div>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/80 hover:text-white transition-colors font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20"
          >
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </button>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Section */}
          <div className="text-white">
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Swap Skills.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Grow Together.
              </span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-12 leading-relaxed font-medium">
              Learn anything, teach everything. Join a global community where knowledge 
              flows freely and skills are the currency of growth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Connect</h3>
                  <p className="text-white/80">Find skill partners worldwide</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Swap</h3>
                  <p className="text-white/80">Exchange knowledge & time</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Grow</h3>
                  <p className="text-white/80">Earn certificates & badges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isLogin ? 'Welcome Back' : 'Join SkillSwape'}
              </h2>
              <p className="text-gray-600 text-lg">
                {isLogin ? 'Continue your learning journey' : 'Start swapping skills today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all pr-14 text-lg"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl text-lg"
              >
                {isLoading ? (
                  <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-bold transition-colors text-lg hover:bg-purple-50 px-4 py-2 rounded-xl"
              >
                {isLogin ? 'Create new account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-3">10k+</div>
            <div className="text-white/80 text-lg font-medium">Active Swappers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-3">500+</div>
            <div className="text-white/80 text-lg font-medium">Skills Available</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-3">50k+</div>
            <div className="text-white/80 text-lg font-medium">Successful Swaps</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-3">95%</div>
            <div className="text-white/80 text-lg font-medium">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;