import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Database, 
  Calendar, 
  BarChart3, 
  MessageCircle, 
  GitBranch,
  Settings 
} from 'lucide-react';

const navigationItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/content', icon: Database, label: 'Content' },
  { path: '/scheduler', icon: Calendar, label: 'Schedule' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/conversations', icon: MessageCircle, label: 'Messages' },
  { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-brand-teal dark:text-brand-teal'
                  : 'text-gray-500 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-light-blue'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
