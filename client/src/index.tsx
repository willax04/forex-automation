import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-teal-500 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Social Media Manager</h1>
        <p className="text-xl">Your all-in-one content automation platform</p>
        <div className="mt-8 space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-lg font-semibold">🚀 Features Coming Soon:</p>
            <ul className="mt-2 text-left space-y-1">
              <li>• Content Bank & Upload</li>
              <li>• One-Click Posting</li>
              <li>• Lead Management</li>
              <li>• Analytics Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
