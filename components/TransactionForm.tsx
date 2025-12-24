
import React, { useState, useEffect } from 'react';
import { getLatestClosingStock, saveDB } from '../db';
import { Transaction } from '../types';

const TransactionForm: React.FC<{ db: any, onUpdate: () => void }> = ({ db, onUpdate }) => {
  const [formData, setFormData] = useState({
    itemId: '',
    date: new Date().toISOString().split('T')[0],
    openingStock: 0,
    purchase: 0,
    sales: 0,
    physicalStock: 0,
  });

  // Calculate live closing stock based on formula: Opening + Purchase - Sales
  const systemClosing = Number(formData.openingStock) + Number(formData.purchase) - Number(formData.sales);
  const shortage = Number(formData.physicalStock) - systemClosing;

  // When Item is selected, automatically fetch the opening stock
  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = e.target.value;
    if (!itemId) {
      setFormData({ ...formData, itemId: '', openingStock: 0, physicalStock: 0, purchase: 0, sales: 0 });
      return;
    }
    const latest = getLatestClosingStock(itemId);
    setFormData({
      ...formData,
      itemId,
      openingStock: latest,
      physicalStock: latest, // Initially assume physical matches opening for new entry
      purchase: 0,
      sales: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemId) {
      alert("Please select an item first.");
      return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: formData.itemId,
      date: formData.date,
      openingStock: Number(formData.openingStock),
      purchase: Number(formData.purchase),
      sales: Number(formData.sales),
      physicalStock: Number(formData.physicalStock),
      closingStock: systemClosing,
      shortage,
      timestamp: Date.now(),
    };

    const updatedDB = {
      ...db,
      transactions: [newTransaction, ...db.transactions]
    };

    saveDB(updatedDB);
    onUpdate();
    alert('Entry Saved Successfully!');
    
    // Reset form for next entry
    setFormData({
      itemId: '',
      date: new Date().toISOString().split('T')[0],
      openingStock: 0,
      purchase: 0,
      sales: 0,
      physicalStock: 0,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Daily Stock Audit</h3>
          <p className="text-indigo-100 text-sm mt-1">Automatic calculation of Opening + Purchase - Sales</p>
        </div>
        <i className="fas fa-calculator text-3xl opacity-30"></i>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* Step 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-tag text-indigo-500"></i>
              1. Select Item
            </label>
            <select 
              required
              value={formData.itemId}
              onChange={handleItemChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 transition-all outline-none bg-white"
            >
              <option value="">Choose an item...</option>
              {db.items.map((item: any) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-calendar-day text-indigo-500"></i>
              2. Date
            </label>
            <input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Step 2: Calculation Matrix */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fas fa-microchip"></i> Real-time Stock Math
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Opening Stock</label>
              <input 
                type="number"
                value={formData.openingStock}
                onChange={(e) => setFormData({...formData, openingStock: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 outline-none font-bold text-lg text-indigo-700"
              />
              <p className="text-[10px] text-gray-400">Previous day's balance</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Purchase (+)</label>
              <input 
                type="number"
                value={formData.purchase}
                onChange={(e) => setFormData({...formData, purchase: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 outline-none font-bold text-lg text-green-600"
                placeholder="0"
              />
              <p className="text-[10px] text-gray-400">New arrivals today</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Sales / Used (-)</label>
              <input 
                type="number"
                value={formData.sales}
                onChange={(e) => setFormData({...formData, sales: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-red-500 outline-none font-bold text-lg text-red-600"
                placeholder="0"
              />
              <p className="text-[10px] text-gray-400">Stock sold or used</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-gray-400 uppercase">System Calculated Balance</p>
              <p className="text-3xl font-black text-gray-800">{systemClosing}</p>
            </div>
            <div className="text-gray-400 text-2xl hidden md:block"><i className="fas fa-equals"></i></div>
            <div className="w-full md:w-1/2 space-y-2">
              <label className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                <i className="fas fa-hand-pointer animate-bounce"></i>
                Actual Physical Count (Manual)
              </label>
              <input 
                type="number"
                required
                value={formData.physicalStock}
                onChange={(e) => setFormData({...formData, physicalStock: Number(e.target.value)})}
                className="w-full px-5 py-4 rounded-xl border-4 border-indigo-100 bg-indigo-50 focus:border-indigo-500 outline-none font-black text-2xl text-indigo-900 shadow-inner"
                placeholder="Count unit on shelf..."
              />
            </div>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className={`p-4 rounded-xl flex items-center gap-4 transition-all ${shortage === 0 ? 'bg-green-50 border border-green-200' : shortage < 0 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${shortage === 0 ? 'bg-green-500' : shortage < 0 ? 'bg-red-500' : 'bg-blue-500'}`}>
            <i className={`fas ${shortage === 0 ? 'fa-check' : shortage < 0 ? 'fa-triangle-exclamation' : 'fa-plus'}`}></i>
          </div>
          <div>
            <p className="font-bold text-gray-800">
              {shortage === 0 ? 'Stock Balanced Perfectly' : shortage < 0 ? `Shortage: ${Math.abs(shortage)} units missing!` : `Excess: ${shortage} extra units found!`}
            </p>
            <p className="text-xs text-gray-500">
              {shortage === 0 ? 'The physical count matches your records.' : 'The count does not match the system records.'}
            </p>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 text-xl uppercase tracking-widest"
        >
          <i className="fas fa-cloud-upload-alt"></i>
          Submit Daily Audit
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
