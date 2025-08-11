import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

function SecurityScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleNumberClick = (number: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + number);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setIsLoading(true);
    const success = await login(pin);
    
    if (!success) {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (pin.length >= 4) {
      handleSubmit();
    }
  }, [pin]);

  const renderPinDots = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className={`w-4 h-4 rounded-full border-2 transition-all ${
          index < pin.length
            ? 'bg-brand-teal border-brand-teal'
            : 'bg-transparent border-gray-300 dark:border-gray-600'
        }`}
      />
    ));
  };

  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-teal dark:from-brand-dark-blue dark:to-brand-dark-blue-end flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Lock size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80">Enter your PIN to continue</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center space-x-4 mb-8">
          {renderPinDots()}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center mb-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4">
          {numberButtons.map((button, index) => {
            if (button === '') {
              return <div key={index}></div>;
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (button === '⌫') {
                    handleBackspace();
                  } else {
                    handleNumberClick(button);
                  }
                }}
                disabled={isLoading}
                className={`
                  h-16 rounded-2xl font-semibold text-xl transition-all transform active:scale-95
                  ${button === '⌫' 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  backdrop-blur-sm border border-white/20
                `}
              >
                {button}
              </button>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Default PIN: 1234
          </p>
          <p className="text-white/60 text-xs mt-2">
            You can change this in Settings
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecurityScreen;
