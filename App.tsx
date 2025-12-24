
import React, { useState, useEffect } from 'react';
import { getDB, saveDB } from './db';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import TransactionForm from './components/TransactionForm';
import ItemsMaster from './components/ItemsMaster';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PWAInstaller from './components/PWAInstaller';

type TabType = 'dashboard' | 'inventory' | 'transactions' | 'items' | 'reports';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [db, setDb] = useState(getDB());
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if we are running as an installed app
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!checkStandalone);

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['dashboard', 'inventory', 'transactions', 'items', 'reports'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const refreshDB = () => {
    setDb(getDB());
  };

  return (
    <div className="flex h-full w-full bg-gray-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header activeTab={activeTab} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {!isStandalone && (
               <div className="md:hidden">
                  <PWAInstaller />
               </div>
            )}

            {activeTab === 'dashboard' && <Dashboard db={db} />}
            {activeTab === 'inventory' && <InventoryList db={db} />}
            {activeTab === 'transactions' && (
              <TransactionForm db={db} onUpdate={() => { refreshDB(); setActiveTab('inventory'); }} />
            )}
            {activeTab === 'items' && (
              <ItemsMaster db={db} onUpdate={refreshDB} />
            )}
            {activeTab === 'reports' && (
              <Reports db={db} />
            )}
          </div>
        </main>

        {/* Mobile Navigation - Persistent Bottom Bar like iOS/Android Apps */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 flex justify-around py-3 z-[60] safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {[
            { id: 'dashboard', icon: 'fa-house', label: 'Home' },
            { id: 'inventory', icon: 'fa-boxes-stacked', label: 'Stock' },
            { id: 'transactions', icon: 'fa-circle-plus', label: 'Add' },
            { id: 'reports', icon: 'fa-chart-column', label: 'Reports' },
            { id: 'items', icon: 'fa-gears', label: 'Setup' }
          ].map((nav) => (
            <button 
              key={nav.id}
              onClick={() => setActiveTab(nav.id as TabType)} 
              className={`flex flex-col items-center w-1/5 transition-all ${activeTab === nav.id ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${activeTab === nav.id ? 'bg-indigo-50' : ''}`}>
                <i className={`fas ${nav.icon} text-xl`}></i>
              </div>
              <span className="text-[9px] mt-1 font-black uppercase tracking-widest">{nav.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
