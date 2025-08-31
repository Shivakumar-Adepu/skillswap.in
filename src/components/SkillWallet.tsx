import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Zap, TrendingUp, Gift, Award, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TRANSACTIONS = [
  {
    id: '1',
    type: 'earn',
    amount: 25,
    description: 'Teaching React to Sarah Chen',
    date: '2 hours ago',
    skill: 'React Development'
  },
  {
    id: '2',
    type: 'spend',
    amount: 20,
    description: 'Learning Spanish from Marcus Rodriguez',
    date: '1 day ago',
    skill: 'Spanish Language'
  },
  {
    id: '3',
    type: 'earn',
    amount: 30,
    description: 'Teaching UI/UX Design to Alex Kim',
    date: '2 days ago',
    skill: 'UI/UX Design'
  },
  {
    id: '4',
    type: 'bonus',
    amount: 50,
    description: 'Welcome bonus for completing profile',
    date: '1 week ago',
    skill: 'Bonus'
  }
];

const REDEMPTION_OPTIONS = [
  {
    id: '1',
    title: 'Verified Certificate',
    description: 'Get a verified certificate for your skill',
    cost: 100,
    icon: Award,
    color: 'purple'
  },
  {
    id: '2',
    title: 'Premium Badge',
    description: 'Unlock exclusive profile badge',
    cost: 75,
    icon: Gift,
    color: 'blue'
  },
  {
    id: '3',
    title: 'Skill Boost',
    description: 'Highlight your profile in search',
    cost: 50,
    icon: TrendingUp,
    color: 'green'
  }
];

const SkillWallet: React.FC = () => {
  const { profile, addSkillCoins, spendSkillCoins } = useUser();
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'redeem'>('transactions');

  if (!profile) return null;

  const handleRedeem = (cost: number, item: string) => {
    if (spendSkillCoins(cost)) {
      // Show success message
      alert(`Successfully redeemed ${item}!`);
    } else {
      alert('Insufficient SkillCoins!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 flex items-center">
              <Zap className="w-10 h-10 mr-3" />
              Skill Wallet
            </h1>
            <p className="text-white/90 text-xl font-medium">Manage your SkillCoins and rewards</p>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-5xl font-bold mb-2">{profile.skillCoins}</div>
            <p className="text-white/90 font-semibold">SkillCoins</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold">{profile.level}</div>
            <div className="text-white/80 font-medium">Level</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold">89</div>
            <div className="text-white/80 font-medium">Earned</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold">34</div>
            <div className="text-white/80 font-medium">Spent</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold">5</div>
            <div className="text-white/80 font-medium">Redeemed</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('transactions')}
            className={`flex-1 px-8 py-6 font-bold transition-all text-lg ${
              selectedTab === 'transactions'
                ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Transaction History
          </button>
          <button
            onClick={() => setSelectedTab('redeem')}
            className={`flex-1 px-8 py-6 font-bold transition-all text-lg ${
              selectedTab === 'redeem'
                ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Redeem Coins
          </button>
        </div>

        <div className="p-8">
          {selectedTab === 'transactions' ? (
            <div className="space-y-6">
              {TRANSACTIONS.map(transaction => (
                <div key={transaction.id} className="flex items-center space-x-6 p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:shadow-lg">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'earn'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg'
                      : transaction.type === 'spend'
                      ? 'bg-gradient-to-r from-red-400 to-pink-500 shadow-lg'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg'
                  }`}>
                    {transaction.type === 'earn' ? (
                      <ArrowDownLeft className="w-6 h-6 text-white" />
                    ) : transaction.type === 'spend' ? (
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    ) : (
                      <Gift className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{transaction.description}</h3>
                      <div className={`font-bold text-xl ${
                        transaction.type === 'earn' || transaction.type === 'bonus'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'earn' || transaction.type === 'bonus' ? '+' : '-'}{transaction.amount}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 font-bold">{transaction.skill}</span>
                      <span className="text-gray-500 font-medium">{transaction.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8">
              {REDEMPTION_OPTIONS.map(option => {
                const IconComponent = option.icon;
                const canAfford = profile.skillCoins >= option.cost;
                
                return (
                  <div
                    key={option.id}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                      canAfford
                        ? 'border-gray-200 hover:border-purple-300 hover:shadow-xl transform hover:scale-[1.02]'
                        : 'border-gray-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                          option.color === 'purple' ? 'bg-purple-100' :
                          option.color === 'blue' ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                          <IconComponent className={`w-8 h-8 ${
                            option.color === 'purple' ? 'text-purple-600' :
                            option.color === 'blue' ? 'text-blue-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl mb-1">{option.title}</h3>
                          <p className="text-gray-600 text-lg">{option.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-2 mb-4">
                          <Zap className="w-6 h-6 text-yellow-600" />
                          <span className="font-bold text-2xl text-gray-900">{option.cost}</span>
                        </div>
                        <button
                          onClick={() => handleRedeem(option.cost, option.title)}
                          disabled={!canAfford}
                          className={`px-8 py-3 rounded-2xl font-bold transition-all transform ${
                            canAfford
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Earning Tips */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          How to Earn More SkillCoins
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Teach Skills</h3>
            <p className="text-gray-600 font-medium">Earn 20-30 coins per session</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Get Reviewed</h3>
            <p className="text-gray-600 font-medium">Bonus coins for 5-star ratings</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Complete Challenges</h3>
            <p className="text-gray-600 font-medium">Daily and weekly rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillWallet;