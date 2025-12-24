
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const titles: Record<string, string> = {
    dashboard: 'Business Overview',
    inventory: 'Live Stock Levels',
    transactions: 'New Daily Entry',
    items: 'Product Catalog',
    reports: 'Audit Reports & History',
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">{titles[activeTab]}</h2>
        
        {isOnline ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
            <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Online Mode
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 shadow-sm">
            <span className="w-2 h-2 mr-1.5 rounded-full bg-orange-500"></span>
            Offline Mode
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          title="Sync Data"
          className={`p-2 rounded-full transition-all ${isOnline ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}
          onClick={() => isOnline && window.location.reload()}
        >
          <i className={`fas fa-arrows-rotate ${isOnline ? 'animate-spin-slow' : ''}`}></i>
        </button>
        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
