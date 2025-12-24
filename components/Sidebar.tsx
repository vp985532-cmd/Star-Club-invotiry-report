
import React from 'react';
import PWAInstaller from './PWAInstaller';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'inventory', label: 'Current Stock', icon: 'fa-boxes-stacked' },
    { id: 'transactions', label: 'Daily Entry', icon: 'fa-file-invoice' },
    { id: 'reports', label: 'Reports & History', icon: 'fa-file-lines' },
    { id: 'items', label: 'Item Master', icon: 'fa-tags' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-star text-yellow-400"></i>
          <span>Star Club</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
              ? 'bg-indigo-700 text-white' 
              : 'text-indigo-100 hover:bg-indigo-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-indigo-800 mt-auto">
        <PWAInstaller />
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              SC
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Star Admin</p>
              <p className="text-xs text-indigo-300">Cloud Sync Active</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
