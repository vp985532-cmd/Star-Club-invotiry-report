
export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  minStock: number;
  unit: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  date: string; // ISO String
  openingStock: number;
  purchase: number;
  sales: number;
  physicalStock: number;
  closingStock: number; // Calculated: Opening + Purchase - Sales
  shortage: number; // Calculated: Physical - Closing
  timestamp: number;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalShortages: number;
  recentActivity: Transaction[];
}
