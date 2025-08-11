import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Security: React.FC = () => {
  const { login } = useAuth();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNumberClick = (number: string) => {
    if (pin.length < 6) {
      setPin(pin + number);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
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

  const renderPinDots = () => {
    return (
      <div className="flex justify-center space-x-3 mb-8">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-colors duration-200 ${
              index < pin.length
                ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end'
                : 'bg-gray-300 dark:bg-white/20'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container-mobile">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-light-blue/80">
            Enter your PIN to continue
          </p>
        </div>

        <div className="card max-w-sm mx-auto">
          {renderPinDots()}

          {error && (
            <div className="text-red-500 text-center mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumberClick(number.toString())}
                className="numeric-button"
                disabled={isLoading}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={handleBackspace}
              className="numeric-button bg-gray-400 dark:bg-gray-600"
              disabled={isLoading || pin.length === 0}
            >
              ←
            </button>
            
            <button
              onClick={() => handleNumberClick('0')}
              className="numeric-button"
              disabled={isLoading}
            >
              0
            </button>
            
            <button
              onClick={handleSubmit}
              className="numeric-button bg-green-500"
              disabled={isLoading || pin.length < 4}
            >
              ✓
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-light-blue/60">
            Enter 4-6 digit PIN to access your account
          </p>
        </div>

        {isLoading && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gradient-start mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;
