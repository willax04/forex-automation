import React, { useState, useEffect } from 'react';
import { Conversation } from '../types';
import { conversationsAPI } from '../services/api';
import { MessageCircle, Search, Instagram, Facebook, Twitter, Linkedin, Phone, ExternalLink } from 'lucide-react';

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = [
    { value: 'all', label: 'All Platforms', icon: MessageCircle },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await conversationsAPI.getAll();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.value === platform.toLowerCase());
    if (platformData) {
      const Icon = platformData.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <MessageCircle className="w-4 h-4" />;
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      instagram: 'bg-pink-500',
      facebook: 'bg-blue-600',
      twitter: 'bg-blue-400',
      linkedin: 'bg-blue-700',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === 'all' || conv.platform.toLowerCase() === selectedPlatform;
    
    return matchesSearch && matchesPlatform;
  });

  // Group conversations by lead or sender
  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const key = conv.lead_id ? `lead-${conv.lead_id}` : `sender-${conv.sender}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gradient-start"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="container-mobile">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Conversations</h1>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.value}
                  onClick={() => setSelectedPlatform(platform.value)}
                  className={`whitespace-nowrap flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlatform === platform.value
                      ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white'
                      : 'btn-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{platform.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {Object.keys(groupedConversations).length === 0 ? (
            <div className="card text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-light-blue/80 mb-4">
                No conversations found. Connect your social media accounts to start receiving messages.
              </p>
              <button className="btn-primary">
                Connect Accounts
              </button>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([key, convGroup]) => {
              const latestConv = convGroup[0]; // Assuming sorted by latest
              const unreadCount = convGroup.filter(conv => !conv.is_read).length;
              
              return (
                <div key={key} className="card">
                  <div className="flex items-start space-x-4">
                    {/* Avatar/Platform Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getPlatformColor(latestConv.platform)}`}>
                      {getPlatformIcon(latestConv.platform)}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {latestConv.lead_name || latestConv.sender}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-light-blue/60">
                            {new Date(latestConv.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-light-blue/80 mb-2 line-clamp-2">
                        <strong>{latestConv.sender === 'user' ? 'You: ' : ''}</strong>
                        {latestConv.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-light-blue/60">
                          <span className="capitalize">{latestConv.platform}</span>
                          {latestConv.lead_contact && (
                            <>
                              <span>•</span>
                              <span>{latestConv.lead_contact}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="text-xs btn-secondary">
                            Reply
                          </button>
                          
                          {latestConv.lead_contact && (
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Phone className="w-3 h-3" />
                            </button>
                          )}
                          
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Message Count */}
                      {convGroup.length > 1 && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-light-blue/60">
                          {convGroup.length} messages in conversation
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Stats */}
        <div className="card mt-6">
          <h3 className="font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold gradient-text">{conversations.length}</p>
              <p className="text-sm text-gray-600 dark:text-light-blue/80">Total Messages</p>
            </div>
            <div>
              <p className="text-2xl font-bold gradient-text">
                {conversations.filter(conv => !conv.is_read).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-light-blue/80">Unread</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
