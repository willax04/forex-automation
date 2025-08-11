import React from 'react';
import { BarChart3, TrendingUp, Users, Heart } from 'lucide-react';

function Analytics() {
  const stats = [
    { icon: Heart, label: 'Total Likes', value: '2.4K', trend: '+12%', color: 'bg-red-500' },
    { icon: BarChart3, label: 'Total Reach', value: '18.7K', trend: '+8%', color: 'bg-blue-500' },
    { icon: Users, label: 'New Followers', value: '347', trend: '+15%', color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Engagement Rate', value: '4.2%', trend: '+3%', color: 'bg-purple-500' },
  ];

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className={`p-2 rounded-lg ${stat.color} w-fit mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.trend}</span>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Engagement Over Time</h2>
        <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Chart visualization coming soon!</p>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Performing Posts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">Sample Post #{i}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.2K likes • 89 comments</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
