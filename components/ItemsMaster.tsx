
import React, { useState } from 'react';
import { saveDB } from '../db';
import { Item } from '../types';

const ItemsMaster: React.FC<{ db: any, onUpdate: () => void }> = ({ db, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    categoryId: db.categories[0]?.id || '',
    minStock: 10,
    unit: 'pkts'
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Item = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedDB = {
      ...db,
      items: [...db.items, item]
    };
    saveDB(updatedDB);
    onUpdate();
    setShowAdd(false);
    setNewItem({ name: '', categoryId: db.categories[0]?.id || '', minStock: 10, unit: 'pkts' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">Manage your product catalog and thresholds.</p>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md"
        >
          <i className={`fas ${showAdd ? 'fa-times' : 'fa-plus'}`}></i>
          {showAdd ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddItem} className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
            <input 
              required
              type="text" 
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Sugar 1kg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <select 
              value={newItem.categoryId}
              onChange={(e) => setNewItem({...newItem, categoryId: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {db.categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Min. Level</label>
            <input 
              type="number" 
              value={newItem.minStock}
              onChange={(e) => setNewItem({...newItem, minStock: Number(e.target.value)})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">Save Item</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.items.map((item: any) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                {item.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-400">{db.categories.find((c: any) => c.id === item.categoryId)?.name} • Min: {item.minStock} {item.unit}</p>
              </div>
            </div>
            <button className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsMaster;
