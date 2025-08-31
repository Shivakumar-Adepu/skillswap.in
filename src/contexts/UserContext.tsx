import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  skillCoins: number;
  level: number;
  badges: string[];
  teachSkills: Skill[];
  learnSkills: Skill[];
  swappers: number;
  swapping: number;
  joinedAt: string;
  lastActive: string;
  isOnline: boolean;
}

interface PublicUser {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  teachSkills: Skill[];
  learnSkills: Skill[];
  rating: number;
  swaps: number;
  skillCoins: number;
  level: number;
  badges: string[];
  isOnline: boolean;
  lastActive: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

interface UserContextType {
  profile: UserProfile | null;
  allUsers: PublicUser[];
  chatUsers: ChatUser[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  addSkillCoins: (amount: number) => void;
  spendSkillCoins: (amount: number) => boolean;
  getUserById: (id: string) => PublicUser | null;
  addChatUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<PublicUser[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    if (user) {
      // Load or create user profile
      const savedProfile = localStorage.getItem(`skillswape_profile_${user.id}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          id: user.id,
          name: user.name,
          bio: '',
          avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150`,
          skillCoins: 100,
          level: 1,
          badges: ['Newcomer'],
          teachSkills: [],
          learnSkills: [],
          swappers: 0,
          swapping: 0,
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          isOnline: true
        };
        setProfile(newProfile);
      }
      
      // Load all users and chat users
      loadAllUsers();
      loadChatUsers();
    } else {
      setProfile(null);
      setAllUsers([]);
      setChatUsers([]);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(`skillswape_profile_${profile.id}`, JSON.stringify(profile));
      // Update user in all users list
      updateUserInAllUsers(profile);
    }
  }, [profile]);

  const loadAllUsers = () => {
    const savedUsers = localStorage.getItem('skillswape_all_users');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    }
  };

  const loadChatUsers = () => {
    const savedChatUsers = localStorage.getItem(`skillswape_chat_users_${user?.id}`);
    if (savedChatUsers) {
      setChatUsers(JSON.parse(savedChatUsers));
    }
  };

  const updateUserInAllUsers = (userProfile: UserProfile) => {
    const publicUser: PublicUser = {
      id: userProfile.id,
      name: userProfile.name,
      bio: userProfile.bio,
      avatar: userProfile.avatar,
      teachSkills: userProfile.teachSkills,
      learnSkills: userProfile.learnSkills,
      rating: 4.8 + Math.random() * 0.2, // Random rating between 4.8-5.0
      swaps: Math.floor(Math.random() * 200) + 50,
      skillCoins: userProfile.skillCoins,
      level: userProfile.level,
      badges: userProfile.badges,
      isOnline: userProfile.isOnline,
      lastActive: userProfile.lastActive
    };

    setAllUsers(prev => {
      const filtered = prev.filter(u => u.id !== userProfile.id);
      const updated = [...filtered, publicUser];
      localStorage.setItem('skillswape_all_users', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { 
        ...profile, 
        ...updates, 
        lastActive: new Date().toISOString() 
      };
      setProfile(updatedProfile);
    }
  };

  const addSkillCoins = (amount: number) => {
    if (profile) {
      setProfile({ ...profile, skillCoins: profile.skillCoins + amount });
    }
  };

  const spendSkillCoins = (amount: number) => {
    if (profile && profile.skillCoins >= amount) {
      setProfile({ ...profile, skillCoins: profile.skillCoins - amount });
      return true;
    }
    return false;
  };

  const getUserById = (id: string): PublicUser | null => {
    return allUsers.find(user => user.id === id) || null;
  };

  const addChatUser = (userId: string) => {
    const targetUser = getUserById(userId);
    if (targetUser && !chatUsers.find(chat => chat.id === userId)) {
      const newChatUser: ChatUser = {
        id: targetUser.id,
        name: targetUser.name,
        avatar: targetUser.avatar,
        lastMessage: 'Connected! Start your conversation...',
        time: 'now',
        unread: 0,
        isOnline: targetUser.isOnline
      };
      
      const updatedChatUsers = [...chatUsers, newChatUser];
      setChatUsers(updatedChatUsers);
      localStorage.setItem(`skillswape_chat_users_${user?.id}`, JSON.stringify(updatedChatUsers));
    }
  };

  return (
    <UserContext.Provider value={{ 
      profile, 
      allUsers, 
      chatUsers, 
      updateProfile, 
      addSkillCoins, 
      spendSkillCoins, 
      getUserById, 
      addChatUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};