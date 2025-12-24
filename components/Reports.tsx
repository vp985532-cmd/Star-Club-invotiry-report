
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

const Reports: React.FC<{ db: any }> = ({ db }) => {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItemId, setSelectedItemId] = useState('all');

  const filteredTransactions = useMemo(() => {
    return db.transactions.filter((t: Transaction) => {
      const dateMatch = t.date === filterDate;
      const itemMatch = selectedItemId === 'all' || t.itemId === selectedItemId;
      return dateMatch && itemMatch;
    });
  }, [db.transactions, filterDate, selectedItemId]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc: any, t: Transaction) => ({
      purchase: acc.purchase + t.purchase,
      sales: acc.sales + t.sales,
      shortage: acc.shortage + (t.shortage < 0 ? Math.abs(t.shortage) : 0),
    }), { purchase: 0, sales: 0, shortage: 0 });
  }, [filteredTransactions]);

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Item', 'Opening', 'Purchase', 'Sales', 'Closing', 'Physical', 'Shortage'];
    const rows = filteredTransactions.map((t: Transaction) => {
      const itemName = db.items.find((i: any) => i.id === t.itemId)?.name || 'Unknown';
      return [t.date, itemName, t.openingStock, t.purchase, t.sales, t.closingStock, t.physicalStock, t.shortage].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Star_Club_Report_${filterDate}.csv`);
    link.click();
  };

  const handleShareWhatsApp = () => {
    let message = `*Star Club Inventory Report - ${filterDate}*\n\n`;
    filteredTransactions.forEach((t: Transaction) => {
      const itemName = db.items.find((i: any) => i.id === t.itemId)?.name || 'Unknown';
      message += `*${itemName}*\n- Op: ${t.openingStock}, Pur: ${t.purchase}, Sal: ${t.sales}\n- Phsy: ${t.physicalStock}, Short: ${t.shortage}\n\n`;
    });
    message += `*Totals*\n- Pur: ${totals.purchase}\n- Sal: ${totals.sales}\n- Short: ${totals.shortage}`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Select Report Date</label>
          <input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Filter by Item</label>
          <select 
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Items</option>
            {db.items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleDownloadCSV}
            className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-file-csv"></i> CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-print"></i> Print
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-green-600 uppercase">Selected Purchase</p>
          <p className="text-2xl font-black text-green-800">{totals.purchase}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-blue-600 uppercase">Selected Sales</p>
          <p className="text-2xl font-black text-blue-800">{totals.sales}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-red-600 uppercase">Selected Shortages</p>
          <p className="text-2xl font-black text-red-800">{totals.shortage}</p>
        </div>
      </div>

      {/* Report Body */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm printable">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <i className="fas fa-star text-yellow-500"></i>
            <h3 className="font-bold text-gray-800">Star Club Details</h3>
          </div>
          <button 
            onClick={handleShareWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md"
          >
            <i className="fab fa-whatsapp"></i> Share on WhatsApp
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4 text-center">Opening</th>
                <th className="px-6 py-4 text-center">Purchase</th>
                <th className="px-6 py-4 text-center">Sales</th>
                <th className="px-6 py-4 text-center">Physical</th>
                <th className="px-6 py-4 text-center">Shortage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((t: Transaction) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {db.items.find((i: any) => i.id === t.itemId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{t.openingStock}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">+{t.purchase}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-bold">-{t.sales}</td>
                  <td className="px-6 py-4 text-center font-bold text-indigo-700">{t.physicalStock}</td>
                  <td className={`px-6 py-4 text-center font-bold ${t.shortage < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {t.shortage}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    No transactions found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .printable { border: none !important; box-shadow: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; }
          header, aside, .mobile-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Reports;
