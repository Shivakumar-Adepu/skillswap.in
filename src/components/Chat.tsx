import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Calendar, Video, Paperclip, Smile, MessageCircle, Users } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'other',
    content: 'Hey! Thanks for connecting. I\'m excited to start swapping skills with you!',
    time: '10:30 AM',
    type: 'text'
  },
  {
    id: '2',
    sender: 'me',
    content: 'Awesome! I\'m looking forward to learning from you too. What time works best for our first session?',
    time: '10:32 AM',
    type: 'text'
  },
  {
    id: '3',
    sender: 'other',
    content: 'How about tomorrow at 3 PM? We can start with the basics and see how it goes.',
    time: '10:35 AM',
    type: 'text'
  },
  {
    id: '4',
    sender: 'me',
    content: 'Perfect! I\'ll send you a calendar invite.',
    time: '10:36 AM',
    type: 'text'
  }
];

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const { chatUsers, getUserById } = useUser();
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(chatId || '1');

  const currentChat = chatUsers.find(chat => chat.id === selectedChat);
  const currentUser = currentChat ? getUserById(currentChat.id) : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-[calc(100vh-200px)] flex overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col bg-gray-50">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="w-6 h-6 text-purple-600 mr-2" />
              Messages
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {chatUsers.length > 0 ? chatUsers.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 text-left hover:bg-white transition-all duration-200 rounded-2xl m-1 ${
                  selectedChat === chat.id ? 'bg-white shadow-lg border-2 border-purple-200' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500 font-medium">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-sm truncate font-medium">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 text-sm mb-4">Start connecting with skill partners to begin chatting</p>
                <Link 
                  to="/search"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                >
                  <Users className="w-4 h-4" />
                  <span>Find Partners</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChat && currentUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                  <img
                      src={currentChat.avatar}
                      alt={currentChat.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 shadow-md"
                    />
                    {currentChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{currentChat.name}</h3>
                    <p className={`text-sm font-medium ${currentChat.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                      {currentChat.isOnline ? '🟢 Online now' : 'Last seen 1h ago'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-purple-50 rounded-xl transition-all">
                    <Calendar className="w-6 h-6" />
                  </button>
                  <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-purple-50 rounded-xl transition-all">
                    <Video className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
                {MOCK_MESSAGES.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl shadow-md ${
                      msg.sender === 'me'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <p className="font-medium">{msg.content}</p>
                      <p className={`text-xs mt-2 ${
                        msg.sender === 'me' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-3 text-gray-600 hover:text-gray-800 hover:bg-purple-50 rounded-xl transition-all"
                  >
                    <Paperclip className="w-6 h-6" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all pr-14 text-lg placeholder-gray-400"
                      placeholder="Type your message... 💬"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-lg"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center bg-gradient-to-br from-gray-50 to-purple-50">
              <div>
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Start a conversation</h3>
                <p className="text-gray-600 text-lg mb-6">Connect with skill partners to begin chatting</p>
                <Link 
                  to="/search"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  <span>Find Partners</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;