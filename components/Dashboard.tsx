
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAIInventoryAnalysis } from '../geminiService';

const Dashboard: React.FC<{ db: any }> = ({ db }) => {
  const [aiInsight, setAiInsight] = useState<string>("Analyzing your data...");
  const [loadingAI, setLoadingAI] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const getStats = () => {
    const stockMap = new Map();
    db.items.forEach((item: any) => {
      const latest = db.transactions
        .filter((t: any) => t.itemId === item.id)
        .sort((a: any, b: any) => b.timestamp - a.timestamp)[0];
      
      const current = latest ? latest.physicalStock : 0;
      stockMap.set(item.id, {
        name: item.name,
        current,
        min: item.minStock,
        isLow: current < item.minStock
      });
    });

    return Array.from(stockMap.values());
  };

  const stats = getStats();
  const lowStockCount = stats.filter(s => s.isLow).length;
  const totalShortages = db.transactions.reduce((acc: number, t: any) => acc + Math.abs(t.shortage < 0 ? t.shortage : 0), 0);

  useEffect(() => {
    const fetchAI = async () => {
      if (isOffline) {
        setAiInsight("AI Insights are disabled in Offline Mode. Connect to the internet for smart analysis.");
        setLoadingAI(false);
        return;
      }

      setLoadingAI(true);
      const summary = await getAIInventoryAnalysis({
        items: db.items.length,
        lowStock: lowStockCount,
        totalTransactions: db.transactions.length,
        shortageTotal: totalShortages
      });
      setAiInsight(summary || "No insights available.");
      setLoadingAI(false);
    };
    fetchAI();
  }, [db, isOffline]);

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={db.items.length} icon="fa-box" color="blue" />
        <StatCard title="Low Stock Alerts" value={lowStockCount} icon="fa-triangle-exclamation" color="amber" />
        <StatCard title="Total Shortages" value={totalShortages} icon="fa-arrow-trend-down" color="red" />
        <StatCard title="Entries Today" value={db.transactions.filter((t: any) => t.date === new Date().toISOString().split('T')[0]).length} icon="fa-calendar-check" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Stock Level Distribution</h3>
            {!isOffline && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Live Updates</span>}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6B7280' }} />
                <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isLow ? '#EF4444' : '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className={`p-6 rounded-xl border flex flex-col transition-colors ${isOffline ? 'bg-gray-100 border-gray-200' : 'bg-indigo-50 border-indigo-100'}`}>
          <div className={`flex items-center gap-2 mb-4 ${isOffline ? 'text-gray-500' : 'text-indigo-800'}`}>
            <i className={`fas ${isOffline ? 'fa-plane-slash' : 'fa-wand-magic-sparkles'} ${!isOffline && 'text-indigo-600'}`}></i>
            <h3 className="font-bold">{isOffline ? 'Offline Analysis' : 'AI Smart Insights'}</h3>
          </div>
          <div className={`flex-1 text-sm leading-relaxed whitespace-pre-line ${isOffline ? 'text-gray-500 italic' : 'text-indigo-900'}`}>
            {loadingAI ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                <div className="h-4 bg-indigo-200 rounded"></div>
                <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
              </div>
            ) : (
              aiInsight
            )}
          </div>
          {!isOffline && (
            <button className="mt-6 text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 uppercase tracking-wider">
              Detailed Analysis <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
