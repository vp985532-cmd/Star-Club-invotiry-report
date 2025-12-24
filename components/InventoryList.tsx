
import React from 'react';

const InventoryList: React.FC<{ db: any }> = ({ db }) => {
  const getLatestStockInfo = (itemId: string) => {
    const relevant = db.transactions
      .filter((t: any) => t.itemId === itemId)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)[0];
    
    return relevant ? {
      stock: relevant.physicalStock,
      lastUpdated: new Date(relevant.timestamp).toLocaleDateString(),
      shortage: relevant.shortage
    } : { stock: 0, lastUpdated: 'Never', shortage: 0 };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="font-bold text-gray-800">Live Inventory Registry</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
            <i className="fas fa-download mr-1"></i> Export PDF
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Min. Level</th>
              <th className="px-6 py-4 text-center">Current Stock</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Last Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {db.items.map((item: any) => {
              const info = getLatestStockInfo(item.id);
              const isLow = info.stock < item.minStock;
              const hasShortage = info.shortage < 0;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">Unit: {item.unit}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full">
                      {db.categories.find((c: any) => c.id === item.categoryId)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-600">{item.minStock}</td>
                  <td className={`px-6 py-4 text-center font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                    {info.stock}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      {isLow && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase">Low Stock</span>
                      )}
                      {hasShortage && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Shortage Detected</span>
                      )}
                      {!isLow && !hasShortage && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Healthy</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-500">{info.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {db.items.length === 0 && (
        <div className="p-12 text-center text-gray-400">
          <i className="fas fa-inbox text-4xl mb-3"></i>
          <p>No items found. Add products in Item Master.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
