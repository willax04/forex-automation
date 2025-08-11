import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SecurityScreen from './pages/SecurityScreen';
import Dashboard from './pages/Dashboard';
import ContentBank from './pages/ContentBank';
import ContentScheduler from './pages/ContentScheduler';
import Analytics from './pages/Analytics';
import Conversations from './pages/Conversations';
import LeadsPipeline from './pages/LeadsPipeline';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<SecurityScreen />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/content" element={<ContentBank />} />
                      <Route path="/scheduler" element={<ContentScheduler />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/conversations" element={<Conversations />} />
                      <Route path="/pipeline" element={<LeadsPipeline />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
