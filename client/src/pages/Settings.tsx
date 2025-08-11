import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI, authAPI } from '../services/api';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Shield, Bell, Download, LogOut, Smartphone } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsAPI.getAll();
      setNotifications(settings.notifications === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    try {
      await settingsAPI.update('theme', newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleNotificationToggle = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    try {
      await settingsAPI.update('notifications', newValue.toString());
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="container-mobile">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Theme</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value as any)}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                        theme === option.value
                          ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white'
                          : 'btn-secondary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-light-blue/80">
                Current: {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowPinModal(true)}
                className="w-full text-left p-3 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Change PIN</p>
                    <p className="text-sm text-gray-600 dark:text-light-blue/80">
                      Update your security PIN
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-light-blue/80">
                  Get notified about new messages and reminders
                </p>
              </div>
              <button
                onClick={handleNotificationToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Social Media Connections */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Connected Accounts</span>
            </h3>
            
            <div className="space-y-3 text-center py-4">
              <p className="text-gray-600 dark:text-light-blue/80 mb-4">
                Connect your social media accounts to enable posting and message management.
              </p>
              
              <div className="space-y-2">
                <button className="w-full btn-secondary">
                  Connect Instagram
                </button>
                <button className="w-full btn-secondary">
                  Connect Facebook
                </button>
                <button className="w-full btn-secondary">
                  Connect Twitter
                </button>
                <button className="w-full btn-secondary">
                  Connect LinkedIn
                </button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-light-blue/60 mt-4">
                Coming soon! Social media integrations will be available in the next update.
              </p>
            </div>
          </div>

          {/* Data Management */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Data Management</span>
            </h3>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-gray-600 dark:text-light-blue/80">
                      Download your content and leads data
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Settings</p>
                    <p className="text-sm text-gray-600 dark:text-light-blue/80">
                      Save your app configuration
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </div>
            </button>
          </div>
        </div>

        {/* PIN Change Modal */}
        {showPinModal && (
          <ChangePinModal onClose={() => setShowPinModal(false)} />
        )}
      </div>
    </div>
  );
};

// Change PIN Modal Component
const ChangePinModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin.length < 4) {
      setError('New PIN must be at least 4 digits');
      return;
    }
    
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authAPI.changePin(currentPin, newPin);
      alert('PIN changed successfully!');
      onClose();
    } catch (error) {
      setError('Failed to change PIN. Please check your current PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Change PIN</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current PIN</label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              required
              className="input-field"
              placeholder="Enter current PIN"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New PIN</label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              required
              minLength={4}
              maxLength={6}
              className="input-field"
              placeholder="Enter new PIN (4-6 digits)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New PIN</label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              required
              minLength={4}
              maxLength={6}
              className="input-field"
              placeholder="Confirm new PIN"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
