import React, { useState } from 'react';
import { Bell, Check, X, Users, MessageCircle, Award, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Notification {
  id: string;
  type: 'swap_request' | 'message' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionable?: boolean;
}

const Notifications: React.FC = () => {
  const { profile } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'swap_request',
      title: 'New Swap Request',
      message: 'Sarah Chen wants to swap React skills with your Python knowledge',
      timestamp: '2 minutes ago',
      isRead: false,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      actionable: true
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Alex Kim: "Thanks for the great JavaScript session!"',
      timestamp: '1 hour ago',
      isRead: false,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      actionable: false
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Helpful Teacher" badge for 10 successful swaps',
      timestamp: '3 hours ago',
      isRead: true,
      actionable: false
    }
  ]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const handleAcceptSwap = (notificationId: string) => {
    // Handle swap request acceptance
    handleMarkAsRead(notificationId);
    alert('Swap request accepted!');
  };

  const handleDeclineSwap = (notificationId: string) => {
    // Handle swap request decline
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request': return <Users className="w-5 h-5 text-purple-600" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'achievement': return <Award className="w-5 h-5 text-yellow-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {notification.avatar ? (
                <img
                  src={notification.avatar}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{notification.title}</h3>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.timestamp}</p>
                
                {notification.actionable && notification.type === 'swap_request' && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleAcceptSwap(notification.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineSwap(notification.id)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;