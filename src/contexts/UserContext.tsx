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
  location?: string;
  email?: string;
  website?: string;
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
  isSwappingWith: string[];
}

interface PublicUser {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  location?: string;
  teachSkills: Skill[];
  learnSkills: Skill[];
  rating: number;
  swaps: number;
  skillCoins: number;
  level: number;
  badges: string[];
  isOnline: boolean;
  lastActive: string;
  isSwappingWith: string[];
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  isTyping: boolean;
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
  toggleSwap: (userId: string) => void;
  searchUsers: (query: string) => PublicUser[];
  updateUserPresence: (isOnline: boolean) => void;
  refreshUsers: () => void;
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
      loadOrCreateProfile();
      loadAllUsers();
      loadChatUsers();
      updateUserPresence(true);
    } else {
      setProfile(null);
      setAllUsers([]);
      setChatUsers([]);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(`skillswape_profile_${profile.id}`, JSON.stringify(profile));
      updateUserInAllUsers(profile);
    }
  }, [profile]);

  // Real-time presence simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        updateUserPresence(true);
        refreshUsers();
      }
    }, 5000); // Update every 5 seconds for real-time feel

    return () => clearInterval(interval);
  }, [user]);

  const loadOrCreateProfile = () => {
    if (!user) return;
    
    const savedProfile = localStorage.getItem(`skillswape_profile_${user.id}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
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
        isOnline: true,
        isSwappingWith: []
      };
      setProfile(newProfile);
    }
  };

  const loadAllUsers = () => {
    const savedUsers = localStorage.getItem('skillswape_all_users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      // Filter out current user and update online status
      const filteredUsers = users.filter((u: PublicUser) => u.id !== user?.id);
      setAllUsers(filteredUsers);
    }
  };

  const refreshUsers = () => {
    loadAllUsers();
  };

  const loadChatUsers = () => {
    if (!user) return;
    const savedChatUsers = localStorage.getItem(`skillswape_chat_users_${user.id}`);
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
      rating: 4.8 + Math.random() * 0.2,
      swaps: Math.floor(Math.random() * 50) + 10,
      skillCoins: userProfile.skillCoins,
      level: userProfile.level,
      badges: userProfile.badges,
      isOnline: userProfile.isOnline,
      lastActive: userProfile.lastActive,
      isSwappingWith: userProfile.isSwappingWith
    };

    // Get existing users and update/add current user
    const savedUsers = localStorage.getItem('skillswape_all_users');
    const existingUsers = savedUsers ? JSON.parse(savedUsers) : [];
    const filteredUsers = existingUsers.filter((u: PublicUser) => u.id !== userProfile.id);
    const updatedUsers = [...filteredUsers, publicUser];
    
    localStorage.setItem('skillswape_all_users', JSON.stringify(updatedUsers));
    
    // Update state with users excluding current user
    setAllUsers(updatedUsers.filter(u => u.id !== userProfile.id));
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
    if (!user) return;
    
    const targetUser = getUserById(userId);
    if (targetUser && !chatUsers.find(chat => chat.id === userId)) {
      const newChatUser: ChatUser = {
        id: targetUser.id,
        name: targetUser.name,
        avatar: targetUser.avatar,
        lastMessage: 'Connected! Start your conversation...',
        time: 'now',
        unread: 0,
        isOnline: targetUser.isOnline,
        isTyping: false
      };
      
      const updatedChatUsers = [...chatUsers, newChatUser];
      setChatUsers(updatedChatUsers);
      localStorage.setItem(`skillswape_chat_users_${user.id}`, JSON.stringify(updatedChatUsers));
    }
  };

  const toggleSwap = (userId: string) => {
    if (!profile) return;

    const isCurrentlySwapping = profile.isSwappingWith.includes(userId);
    const updatedSwappingWith = isCurrentlySwapping
      ? profile.isSwappingWith.filter(id => id !== userId)
      : [...profile.isSwappingWith, userId];

    const updatedProfile = {
      ...profile,
      isSwappingWith: updatedSwappingWith,
      swapping: updatedSwappingWith.length
    };

    setProfile(updatedProfile);

    // Update the target user's swappers count in localStorage
    const savedUsers = localStorage.getItem('skillswape_all_users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const updatedUsers = users.map((u: PublicUser) => {
        if (u.id === userId) {
          return {
            ...u,
            swappers: isCurrentlySwapping ? u.swappers - 1 : u.swappers + 1
          };
        }
        return u;
      });
      localStorage.setItem('skillswape_all_users', JSON.stringify(updatedUsers));
      setAllUsers(updatedUsers.filter(u => u.id !== profile.id));
    }
  };

  const searchUsers = (query: string): PublicUser[] => {
    if (!query.trim()) return allUsers;
    
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase()) ||
      user.teachSkills.some(skill => skill.name.toLowerCase().includes(query.toLowerCase())) ||
      user.learnSkills.some(skill => skill.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const updateUserPresence = (isOnline: boolean) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        isOnline,
        lastActive: new Date().toISOString()
      };
      setProfile(updatedProfile);
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
      addChatUser,
      toggleSwap,
      searchUsers,
      updateUserPresence,
      refreshUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};