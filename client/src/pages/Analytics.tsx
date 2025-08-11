import React, { useState, useEffect } from 'react';
import { Analytics as AnalyticsType } from '../types';
import { analyticsAPI } from '../services/api';
import { TrendingUp, Heart, MessageCircle, Share, Eye, Trophy, Target } from 'lucide-react';

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsAPI.getAll();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMetrics = analytics.reduce(
    (totals, item) => ({
      likes: totals.likes + item.total_likes,
      comments: totals.comments + item.total_comments,
      shares: totals.shares + item.total_shares,
      saves: totals.saves + item.total_saves,
      reach: totals.reach + item.total_reach,
    }),
    { likes: 0, comments: 0, shares: 0, saves: 0, reach: 0 }
  );

  const getTopPerformers = () => {
    return analytics
      .sort((a, b) => 
        (b.total_likes + b.total_comments + b.total_shares) - 
        (a.total_likes + a.total_comments + a.total_shares)
      )
      .slice(0, 3);
  };

  const getEngagementRate = (item: AnalyticsType) => {
    if (item.total_reach === 0) return 0;
    return ((item.total_likes + item.total_comments + item.total_shares) / item.total_reach * 100).toFixed(1);
  };

  const motivationalInsights = [
    "Your engagement is growing! 📈",
    "People love your content! ❤️",
    "Keep up the amazing work! 🌟",
    "You're building a strong community! 👥",
    "Your consistency is paying off! 🎯"
  ];

  const getRandomInsight = () => {
    return motivationalInsights[Math.floor(Math.random() * motivationalInsights.length)];
  };

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
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <TrendingUp className="w-6 h-6" />
            <span>Analytics</span>
          </h1>
        </div>

        {/* Motivational Card */}
        <div className="card mb-6 text-center bg-gradient-to-r from-brand-gradient-start/10 to-brand-gradient-end/10">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
          </div>
          <p className="text-lg font-semibold gradient-text">
            {getRandomInsight()}
          </p>
          {analytics.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-light-blue/80 mt-2">
              You've posted {analytics.length} pieces of content with great engagement!
            </p>
          )}
        </div>

        {analytics.length === 0 ? (
          <div className="card text-center py-8">
            <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-light-blue/80 mb-4">
              No analytics data yet. Start posting content to see your performance metrics!
            </p>
            <button className="btn-primary">
              View Content Bank
            </button>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-red-500 mr-1" />
                </div>
                <p className="text-2xl font-bold gradient-text">{totalMetrics.likes}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">Total Likes</p>
              </div>

              <div className="card text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-500 mr-1" />
                </div>
                <p className="text-2xl font-bold gradient-text">{totalMetrics.comments}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">Comments</p>
              </div>

              <div className="card text-center">
                <div className="flex items-center justify-center mb-2">
                  <Share className="w-5 h-5 text-green-500 mr-1" />
                </div>
                <p className="text-2xl font-bold gradient-text">{totalMetrics.shares}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">Shares</p>
              </div>

              <div className="card text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="w-5 h-5 text-purple-500 mr-1" />
                </div>
                <p className="text-2xl font-bold gradient-text">{totalMetrics.reach}</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">Total Reach</p>
              </div>
            </div>

            {/* Top Performers */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Top Performers</span>
              </h3>

              <div className="space-y-3">
                {getTopPerformers().map((item, index) => (
                  <div key={item.content_id} className="bg-white/50 dark:bg-white/10 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                        <h4 className="font-medium truncate">{item.original_name}</h4>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <p className="font-semibold text-red-500">{item.total_likes}</p>
                        <p className="text-gray-500">Likes</p>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-500">{item.total_comments}</p>
                        <p className="text-gray-500">Comments</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-500">{item.total_shares}</p>
                        <p className="text-gray-500">Shares</p>
                      </div>
                      <div>
                        <p className="font-semibold text-purple-500">{getEngagementRate(item)}%</p>
                        <p className="text-gray-500">Engagement</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
              
              {Array.from(new Set(analytics.map(item => item.category))).map(category => {
                const categoryPosts = analytics.filter(item => item.category === category);
                const categoryTotals = categoryPosts.reduce(
                  (totals, item) => ({
                    likes: totals.likes + item.total_likes,
                    comments: totals.comments + item.total_comments,
                    shares: totals.shares + item.total_shares,
                    count: totals.count + 1,
                  }),
                  { likes: 0, comments: 0, shares: 0, count: 0 }
                );
                
                const avgEngagement = Math.round(
                  (categoryTotals.likes + categoryTotals.comments + categoryTotals.shares) / categoryTotals.count
                );

                return (
                  <div key={category} className="bg-white/50 dark:bg-white/10 p-3 rounded-lg mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{category}</h4>
                      <span className="text-sm text-gray-500 dark:text-light-blue/60">
                        {categoryTotals.count} posts
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Avg. Engagement: <strong>{avgEngagement}</strong></span>
                      <div className="flex items-center space-x-3 text-xs">
                        <span>{categoryTotals.likes} likes</span>
                        <span>{categoryTotals.comments} comments</span>
                        <span>{categoryTotals.shares} shares</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insights & Recommendations */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">📊 Insights & Recommendations</h3>
              
              <div className="space-y-3 text-sm">
                {analytics.length >= 5 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                    <p className="text-blue-700 dark:text-blue-300">
                      <strong>Great job!</strong> You've built momentum with {analytics.length} posts. 
                      Keep your posting schedule consistent for best results.
                    </p>
                  </div>
                )}
                
                {totalMetrics.comments > totalMetrics.likes && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">
                    <p className="text-green-700 dark:text-green-300">
                      <strong>High engagement!</strong> Your content is sparking conversations. 
                      This type of content performs really well.
                    </p>
                  </div>
                )}
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                  <p className="text-yellow-700 dark:text-yellow-300">
                    💡 <strong>Tip:</strong> Try posting more content in your best-performing category 
                    to maximize engagement and reach.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
