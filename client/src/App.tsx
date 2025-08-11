import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Security from './pages/Security';
import Dashboard from './pages/Dashboard';
import ContentBank from './pages/ContentBank';
import LeadPipeline from './pages/LeadPipeline';
import Conversations from './pages/Conversations';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Components
import BottomNavigation from './components/BottomNavigation';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Security />;
  }
  
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={<Security />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/content" element={
              <ProtectedRoute>
                <ContentBank />
              </ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute>
                <LeadPipeline />
              </ProtectedRoute>
            } />
            <Route path="/conversations" element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen transition-colors duration-200">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
