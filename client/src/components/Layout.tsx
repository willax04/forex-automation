import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const getPageTitle = () => {
    switch (currentPath) {
      case '/':
        return 'Dashboard';
      case '/content':
        return 'Content Bank';
      case '/scheduler':
        return 'Scheduler';
      case '/analytics':
        return 'Analytics';
      case '/conversations':
        return 'Conversations';
      case '/pipeline':
        return 'Lead Pipeline';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-brand-soft-white dark:bg-gradient-to-br dark:from-brand-dark-blue dark:to-brand-dark-blue-end">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container-mobile py-4">
          <h1 className="text-2xl font-bold text-brand-blue dark:text-brand-light-blue">
            {getPageTitle()}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}

export default Layout;
