import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import { dashboardAPI, contentAPI } from '../services/api';
import { Zap, MessageCircle, Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postingSuccess, setPostingSuccess] = useState<number | null>(null);

  const motivationalMessages = [
    "You're crushing it today! 🚀",
    "Keep building that empire! 💪",
    "Your consistency is paying off! ✨",
    "Another day, another opportunity! 🌟",
    "You've got this, champion! 🏆"
  ];

  const [todaysMessage] = useState(() => {
    const today = new Date().getDate();
    return motivationalMessages[today % motivationalMessages.length];
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleOneButtonBlast = async () => {
    setIsPosting(true);
    try {
      const result = await contentAPI.postAll();
      setPostingSuccess(result.count);
      setTimeout(() => setPostingSuccess(null), 3000);
      await loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error posting content:', error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!stats) {
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <div className="card">
            <p className="text-lg gradient-text font-semibold">
              {todaysMessage}
            </p>
          </div>
        </div>

        {/* One Button Blast */}
        <div className="mb-8">
          <button
            onClick={handleOneButtonBlast}
            disabled={isPosting || stats.scheduledPosts === 0}
            className={`w-full py-6 text-xl font-bold rounded-xl shadow-xl transition-all duration-200 ${
              isPosting
                ? 'bg-gray-400 cursor-not-allowed'
                : stats.scheduledPosts > 0
                ? 'btn-primary hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isPosting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Posting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-6 h-6" />
                <span>
                  {stats.scheduledPosts > 0
                    ? `One Button Blast (${stats.scheduledPosts} posts)`
                    : 'No Content Scheduled'
                  }
                </span>
              </div>
            )}
          </button>

          {postingSuccess !== null && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-300 font-semibold">
                🎉 Successfully posted {postingSuccess} piece{postingSuccess !== 1 ? 's' : ''} of content!
              </p>
            </div>
          )}
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.postsThisWeek}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">Posts This Week</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">New Messages</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.newLeadsThisMonth}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">New Leads</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.scheduledPosts}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">Scheduled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors">
              <div className="flex items-center justify-between">
                <span>Check Messages</span>
                {stats.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.unreadMessages}
                  </span>
                )}
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors">
              Upload New Content
            </button>
            
            <button className="w-full text-left p-3 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
