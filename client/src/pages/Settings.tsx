import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Lock, 
  Bell, 
  Smartphone, 
  LogOut,
  User,
  Palette,
  Shield
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const { theme, setTheme, isDark } = useTheme();
  const { logout } = useAuth();
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handlePinChange = async () => {
    // Implementation would go here
    setShowPinChange(false);
    setNewPin('');
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </div>
  );

  const SettingsItem = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    children: React.ReactNode 
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3">
        <Icon size={20} className="text-gray-500 dark:text-gray-400" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Appearance */}
      <SettingsSection title="Appearance">
        <SettingsItem
          icon={Palette}
          title="Theme"
          description="Choose your preferred theme"
          children={
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      theme === option.value
                        ? 'bg-white dark:bg-gray-600 text-brand-blue dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          }
        />
      </SettingsSection>

      {/* Security */}
      <SettingsSection title="Security">
        <SettingsItem
          icon={Lock}
          title="Change PIN"
          description="Update your security PIN"
          children={
            <button
              onClick={() => setShowPinChange(true)}
              className="px-4 py-2 bg-brand-teal text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              Change PIN
            </button>
          }
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <SettingsItem
          icon={Bell}
          title="Push Notifications"
          description="Receive notifications for new messages and reminders"
          children={
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/25 dark:peer-focus:ring-brand-teal/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-teal"></div>
            </label>
          }
        />
        
        <SettingsItem
          icon={Smartphone}
          title="Daily Reminders"
          description="Get reminded to check and reply to messages"
          children={
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/25 dark:peer-focus:ring-brand-teal/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-teal"></div>
            </label>
          }
        />
      </SettingsSection>

      {/* Account */}
      <SettingsSection title="Account">
        <SettingsItem
          icon={User}
          title="Profile Information"
          description="Manage your profile and brand details"
          children={
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Edit Profile
            </button>
          }
        />
        
        <SettingsItem
          icon={Shield}
          title="Privacy & Data"
          description="Control your data and privacy settings"
          children={
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Manage
            </button>
          }
        />
        
        <SettingsItem
          icon={LogOut}
          title="Sign Out"
          description="Sign out of your account"
          children={
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              Sign Out
            </button>
          }
        />
      </SettingsSection>

      {/* PIN Change Modal */}
      {showPinChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change PIN</h3>
            <input
              type="password"
              placeholder="Enter new PIN (4-6 digits)"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              maxLength={6}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPinChange(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePinChange}
                disabled={newPin.length < 4}
                className="flex-1 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Info */}
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        <p>Social Media Manager v1.0.0</p>
        <p>Built with ❤️ for your success</p>
      </div>
    </div>
  );
}

export default Settings;
