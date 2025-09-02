import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Reels from './components/Reels';
import Groups from './components/Groups';
import Profile from './components/Profile';
import Search from './components/Search';
import SkillWallet from './components/SkillWallet';
import Chat from './components/Chat';
import Onboarding from './components/Onboarding';
import Navigation from './components/Navigation';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route 
                path="/home" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Feed />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/sparks" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Reels />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/chat/:chatId?" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Chat />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/hubs" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Groups />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/profile/:userId?"
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Profile />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Profile />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <SkillWallet />
                    <Navigation />
                  </div>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <div className="pb-20 pt-16">
                    <Header />
                    <Search />
                    <Chat />
                    <Navigation />
                  </div>
                } 
              />
            </Routes>
          </div>
        </Router>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;