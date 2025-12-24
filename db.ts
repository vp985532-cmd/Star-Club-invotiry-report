
import { Item, Category, Transaction } from './types';

const STORAGE_KEY = 'cloud_inventory_data_v1';

interface DBState {
  items: Item[];
  categories: Category[];
  transactions: Transaction[];
}

const initialState: DBState = {
  items: [
    { id: '1', name: 'Milk 1L', categoryId: '1', minStock: 20, unit: 'pkts' },
    { id: '2', name: 'Wheat Flour 5kg', categoryId: '1', minStock: 10, unit: 'bags' },
    { id: '3', name: 'Lays Chips', categoryId: '2', minStock: 50, unit: 'pkts' }
  ],
  categories: [
    { id: '1', name: 'Grocery' },
    { id: '2', name: 'Snacks' }
  ],
  transactions: []
};

export const getDB = (): DBState => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialState;
};

export const saveDB = (state: DBState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getLatestClosingStock = (itemId: string): number => {
  const db = getDB();
  const itemTransactions = db.transactions
    .filter(t => t.itemId === itemId)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  return itemTransactions.length > 0 ? itemTransactions[0].physicalStock : 0;
};
