import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Folder, Users, MessageCircle, TrendingUp, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/content', icon: Folder, label: 'Content' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/conversations', icon: MessageCircle, label: 'Messages' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-dark-blue-start/90 backdrop-blur-sm border-t border-gray-200 dark:border-white/20 z-40">
      <div className="container-mobile">
        <div className="grid grid-cols-6 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  active
                    ? 'text-brand-gradient-start'
                    : 'text-gray-500 dark:text-light-blue/60 hover:text-gray-700 dark:hover:text-light-blue'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${active ? 'text-brand-gradient-start' : ''}`} />
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
