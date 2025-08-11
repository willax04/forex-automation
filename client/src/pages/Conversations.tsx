import React from 'react';
import { MessageCircle, Search, Phone, Mail } from 'lucide-react';

function Conversations() {
  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      platform: 'Instagram',
      lastMessage: 'Interested in the iPhone deal!',
      time: '2 min ago',
      unread: true,
      status: 'Hot Lead'
    },
    {
      id: 2,
      name: 'Mike Chen',
      platform: 'Facebook',
      lastMessage: 'When will it be available?',
      time: '15 min ago',
      unread: true,
      status: 'Warm Lead'
    },
    {
      id: 3,
      name: 'Emma Davis',
      platform: 'Twitter',
      lastMessage: 'Thanks for the quick response!',
      time: '1 hour ago',
      unread: false,
      status: 'Follow-up'
    },
  ];

  return (
    <div className="container-mobile py-6">
      {/* Search */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
        />
      </div>

      {/* Conversation List */}
      <div className="space-y-3">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center text-white font-semibold">
                {conversation.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.time}
                  </span>
                </div>
                
                <p className={`text-sm mb-2 ${
                  conversation.unread 
                    ? 'text-gray-900 dark:text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {conversation.lastMessage}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.platform}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      conversation.status === 'Hot Lead' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : conversation.status === 'Warm Lead'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {conversation.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-500 hover:text-brand-teal dark:text-gray-400 dark:hover:text-brand-teal">
                      <Phone size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-brand-teal dark:text-gray-400 dark:hover:text-brand-teal">
                      <Mail size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {conversation.unread && (
                <div className="w-3 h-3 bg-brand-teal rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for no conversations */}
      <div className="text-center py-12 mt-8">
        <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Stay Connected
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          All your social media conversations will appear here
        </p>
      </div>
    </div>
  );
}

export default Conversations;
