import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  type: 'post' | 'reel';
  category: 'job' | 'education' | 'technology';
  claps: number;
  drops: number;
  spreads: number;
  hasClapped: boolean;
  hasDropped: boolean;
  hasSpread: boolean;
  createdAt: string;
  tags: string[];
}

interface PostContextType {
  posts: Post[];
  reels: Post[];
  addPost: (content: string, image?: string, type?: 'post' | 'reel', category?: 'job' | 'education' | 'technology') => void;
  toggleClap: (postId: string) => void;
  toggleDrop: (postId: string) => void;
  toggleSpread: (postId: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('skillswap_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with some sample posts for demonstration
      const samplePosts: Post[] = [];
      setPosts(samplePosts);
      localStorage.setItem('skillswap_posts', JSON.stringify(samplePosts));
    }
  };

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('skillswap_posts', JSON.stringify(updatedPosts));
  };

  const addPost = (content: string, image?: string, type: 'post' | 'reel' = 'post', category: 'job' | 'education' | 'technology' = 'education') => {
    if (!user) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150`,
      content,
      image,
      type,
      category,
      claps: 0,
      drops: 0,
      spreads: 0,
      hasClapped: false,
      hasDropped: false,
      hasSpread: false,
      createdAt: new Date().toISOString(),
      tags: []
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
  };

  const toggleClap = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasClapped: !post.hasClapped,
          claps: post.hasClapped ? post.claps - 1 : post.claps + 1
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const toggleDrop = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasDropped: !post.hasDropped,
          drops: post.hasDropped ? post.drops - 1 : post.drops + 1
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const toggleSpread = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasSpread: !post.hasSpread,
          spreads: post.hasSpread ? post.spreads - 1 : post.spreads + 1
        };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const reels = posts.filter(post => post.type === 'reel');
  const feedPosts = posts.filter(post => post.type === 'post');

  return (
    <PostContext.Provider value={{ 
      posts: feedPosts, 
      reels, 
      addPost, 
      toggleClap, 
      toggleDrop, 
      toggleSpread 
    }}>
      {children}
    </PostContext.Provider>
  );
};