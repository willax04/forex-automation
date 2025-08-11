import React, { useState, useEffect } from 'react';
import { 
  Send, 
  TrendingUp, 
  MessageCircle, 
  Target, 
  Bell,
  Zap,
  Users,
  Award
} from 'lucide-react';
import api from '../services/api';
import { DashboardStats } from '../types';

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    posts_this_week: 0,
    replies_this_week: 0,
    sales_this_week: 0,
    active_leads: 0,
    unread_messages: 0
  });
  const [isPosting, setIsPosting] = useState(false);
  const [postingComplete, setPostingComplete] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handlePostAll = async () => {
    setIsPosting(true);
    try {
      await api.post('/schedule/post-all');
      setPostingComplete(true);
      setTimeout(() => setPostingComplete(false), 3000);
      fetchStats();
    } catch (error) {
      console.error('Error posting content:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const motivationalMessages = [
    "You're crushing it today! 🚀",
    "Every reply brings you closer to a sale! 💪",
    "Your consistency is paying off! ⭐",
    "Keep building those connections! 🤝",
    "Success is just around the corner! 🎯"
  ];

  const todayMotivation = motivationalMessages[new Date().getDay() % motivationalMessages.length];

  const StatCard = ({ icon: Icon, label, value, color, trend }: {
    icon: any;
    label: string;
    value: number;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {label}
      </p>
    </div>
  );

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Motivational Header */}
      <div className="bg-gradient-to-r from-brand-teal to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Award size={28} />
          <h2 className="text-xl font-bold">Daily Motivation</h2>
        </div>
        <p className="text-lg opacity-90">{todayMotivation}</p>
      </div>

      {/* One Button Blast */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap size={24} className="mr-2 text-brand-teal" />
          One Button Blast
        </h2>
        
        {postingComplete ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Posts Sent Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your content is now live across all platforms
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Post all your scheduled content to social platforms with one tap
            </p>
            <button
              onClick={handlePostAll}
              disabled={isPosting}
              className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                isPosting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isPosting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Post All Now</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Send}
          label="Posts This Week"
          value={stats.posts_this_week}
          color="bg-blue-500"
          trend="+12%"
        />
        <StatCard
          icon={MessageCircle}
          label="Replies Sent"
          value={stats.replies_this_week}
          color="bg-green-500"
          trend="+8%"
        />
        <StatCard
          icon={Target}
          label="Sales Closed"
          value={stats.sales_this_week}
          color="bg-purple-500"
          trend="+15%"
        />
        <StatCard
          icon={Users}
          label="Active Leads"
          value={stats.active_leads}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Summary
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-brand-teal" />
              <span className="font-medium text-gray-900 dark:text-white">
                Unread Messages
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              stats.unread_messages > 0 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
            }`}>
              {stats.unread_messages}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <TrendingUp size={20} className="text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                Next Follow-up
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tomorrow, 2 PM
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Weekly Goals
        </h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Posts</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {stats.posts_this_week}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.posts_this_week / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Replies</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {stats.replies_this_week}/25
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.replies_this_week / 25) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Sales</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {stats.sales_this_week}/5
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.sales_this_week / 5) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
