import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Video, Paperclip, Smile, MessageCircle, Users, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const { chatUsers, getUserById, profile } = useUser();
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(chatId || (chatUsers.length > 0 ? chatUsers[0].id : ''));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const currentChat = chatUsers.find(chat => chat.id === selectedChat);
  const currentUser = currentChat ? getUserById(currentChat.id) : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: profile?.id || '',
        content: message.trim(),
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Mobile view - show chat list or conversation
  const [showChatList, setShowChatList] = useState(!chatId);

  if (chatUsers.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No conversations yet</h3>
          <p className="text-gray-600 mb-6">Start connecting with skill partners to begin chatting</p>
          <Link 
            to="/search"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            <Users className="w-5 h-5" />
            <span>Find Partners</span>
          </Link>
        </div>
      </div>
    );
  }

  // Mobile: Show chat list
  if (showChatList || !selectedChat) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {chatUsers.map(chat => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat.id);
                setShowChatList(false);
              }}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Mobile: Show conversation
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-white">
        <button
          onClick={() => setShowChatList(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {currentUser && (
          <>
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {currentUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
              <p className={`text-xs ${currentUser.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {currentUser.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
            
            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-600">Start your conversation!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === profile?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.senderId === profile?.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                <p>{msg.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${
                    msg.senderId === profile?.id ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                  {msg.senderId === profile?.id && (
                    <span className={`text-xs ${
                      msg.status === 'read' ? 'text-blue-300' :
                      msg.status === 'delivered' ? 'text-purple-200' : 'text-purple-300'
                    }`}>
                      {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              placeholder="Message..."
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;