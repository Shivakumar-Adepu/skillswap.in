import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, Users, MessageCircle, Phone, Settings, Hand } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
}

const LiveSession: React.FC = () => {
  const { profile } = useUser();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      isHost: true,
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false
    },
    {
      id: '2',
      name: profile?.name || 'You',
      avatar: profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      isHost: false,
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false
    }
  ]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'Sarah Chen',
      message: 'Welcome to the React Fundamentals session!',
      timestamp: '10:30 AM'
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log('Camera access denied:', err));
    }
  }, []);

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    setParticipants(prev => prev.map(p => 
      p.id === '2' ? { ...p, isVideoOn: !isVideoOn } : p
    ));
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev => prev.map(p => 
      p.id === '2' ? { ...p, isMuted: !isMuted } : p
    ));
  };

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        // Handle screen share stream
      } else {
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.log('Screen share failed:', err);
    }
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    setParticipants(prev => prev.map(p => 
      p.id === '2' ? { ...p, isHandRaised: !isHandRaised } : p
    ));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: profile?.name || 'You',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const handleEndCall = () => {
    // End the session
    alert('Session ended');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-white font-semibold">React Fundamentals - Live Session</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">{participants.length} participants</span>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {isScreenSharing ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-center">
                <Monitor className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Screen Sharing Active</h3>
                <p className="text-gray-400">Sarah is sharing her screen</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 relative">
              {/* Main Speaker Video */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative">
                  <img
                    src={participants[0].avatar}
                    alt={participants[0].name}
                    className="w-64 h-64 rounded-full object-cover border-4 border-purple-500"
                  />
                  {!participants[0].isVideoOn && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <VideoOff className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {participants[0].isMuted && (
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Participant Thumbnails */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                {participants.slice(1).map(participant => (
                  <div key={participant.id} className="relative">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white"
                    />
                    {!participant.isVideoOn && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <VideoOff className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {participant.isMuted && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <MicOff className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {participant.isHandRaised && (
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Hand className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Session Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-gray-900">{msg.sender}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleToggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          
          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-full transition-colors ${
              !isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
          </button>
          
          <button
            onClick={handleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Monitor className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={handleRaiseHand}
            className={`p-3 rounded-full transition-colors ${
              isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Hand className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={handleEndCall}
            className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
          >
            <Phone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;