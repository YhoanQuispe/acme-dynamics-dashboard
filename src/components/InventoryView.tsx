import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  RotateCcw, 
  MoreVertical,
  CheckCircle2,
  TrendingDown,
  Warehouse,
  X,
  Trash2
} from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryViewProps {
  items: InventoryItem[];
  onAddItem: (newItem: InventoryItem) => void;
  onIncrementStock: (id: string) => void;
  onDeleteItem: (id: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (val: string) => void;
}

export default function InventoryView({ 
  items, 
  onAddItem, 
  onIncrementStock, 
  onDeleteItem, 
  searchQuery,
  onSearchQueryChange 
}: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low Stock' | 'In Stock'>('All');

  // Modal State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  // Form State
  const [newitemName, setNewItemName] = useState('');
  const [newSKU, setNewSKU] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newSupplier, setNewSupplier] = useState('Global Logistics');
  const [newStatus, setNewStatus] = useState<'In Stock' | 'Low Stock' | 'Out of Stock' | 'In Transit'>('In Stock');

  const incrementStock = (id: string) => {
    onIncrementStock(id);
  };

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newitemName.trim()) return;

    const finalSKU = newSKU.trim() || `SKU-${newitemName.trim().slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const parsedQuantity = parseInt(newQuantity) || 0;

    let parsedPrice = newPrice.trim();
    if (!parsedPrice) {
      parsedPrice = '$0.00';
    } else {
      if (!parsedPrice.startsWith('$')) {
        parsedPrice = '$' + parsedPrice;
      }
    }

    const newItem: InventoryItem = {
      id: `SKU-${Date.now()}`,
      name: newitemName.trim(),
      sku: finalSKU,
      stock: parsedQuantity,
      price: parsedPrice,
      status: newStatus,
      supplier: newSupplier
    };

    onAddItem(newItem);

    // Reset Form Fields
    setNewItemName('');
    setNewSKU('');
    setNewQuantity('');
    setNewPrice('');
    setNewSupplier('Global Logistics');
    setNewStatus('In Stock');

    setIsReceiveModalOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    onDeleteItem(id);
  };

  const filteredItems = items.filter(item => {
    const query = (searchQuery !== undefined ? searchQuery : searchTerm).trim().toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(query) || 
                          item.sku.toLowerCase().includes(query);
    
    if (stockFilter === 'All') return matchesSearch;
    if (stockFilter === 'Low Stock') return matchesSearch && (item.status === 'Low Stock' || item.status === 'Out of Stock');
    if (stockFilter === 'In Stock') return matchesSearch && item.status === 'In Stock';
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="inventory-view-container">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" id="inventory-view-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Inventory Catalog
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Real-time warehouse SKU allocation, supply chains, and reorder dispatch control bounds.
          </p>
        </div>
        <div>
          <button 
            type="button"
            id="btn-receive-shipment"
            onClick={() => setIsReceiveModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={15} />
            Receive Shipment
          </button>
        </div>
      </div>

      {/* Control Banner Warning */}
      {items.some(i => i.stock <= 5) && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-400" id="replenishment-alert">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
          <div className="text-xs">
            <h4 className="font-semibold">Replenishment Dispatch Required</h4>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Our automated ledger detects active items at or below safety stock limits. Trigger reorder workflows to maintain fulfillment velocity.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" id="inventory-control-bar">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-400" />
          <input
            type="text"
            placeholder="Search SKUs or description..."
            value={searchQuery !== undefined ? searchQuery : searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              onSearchQueryChange?.(val);
            }}
            className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          {(searchQuery !== undefined ? searchQuery : searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearchQueryChange?.('');
              }}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-650 cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          {(['All', 'Low Stock', 'In Stock'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStockFilter(mode)}
              className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                stockFilter === mode
                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/95 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm" id="inventory-table-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <th className="px-6 py-4">Item Catalog Specification</th>
                <th className="px-6 py-4">SKU Code</th>
                <th className="px-6 py-4">Unit Pricing</th>
                <th className="px-6 py-4">Stock Ledger</th>
                <th className="px-6 py-4">STOCK STATUS</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 text-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-all">
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                      <div className="flex items-center gap-2.5">
                        <Warehouse size={16} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                        <div>
                          <div>{item.name}</div>
                          {item.supplier && (
                            <span className="inline-block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                              Supplier: {item.supplier}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">{item.sku}</td>
                    <td className="px-6 py-4 font-mono font-medium text-xs text-zinc-900 dark:text-zinc-200">{item.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold w-16 text-zinc-900 dark:text-zinc-100">{item.stock} units</span>
                        <button 
                          type="button"
                          onClick={() => incrementStock(item.id)}
                          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200/50 dark:border-zinc-700/50 cursor-pointer transition-colors"
                        >
                          +1 Add
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          : item.status === 'In Transit'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 px-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 size={13} />
                          <span>Delete Item</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-13 text-center select-none font-sans space-y-2">
                    <Package size={24} className="text-zinc-350 dark:text-zinc-650 mx-auto opacity-75 animate-pulse" />
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-xs">No results found matching your search</p>
                    {(searchTerm || searchQuery || stockFilter !== 'All') && (
                      <button
                        type="button"
                        onClick={() => { 
                          setSearchTerm(''); 
                          onSearchQueryChange?.('');
                          setStockFilter('All'); 
                        }}
                        className="text-[11px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline font-semibold transition-all mt-1 cursor-pointer"
                      >
                        Reset Filter Parameters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Shipment Modal Overlay */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in" id="receive-modal">
          <div className="absolute inset-0" onClick={() => setIsReceiveModalOpen(false)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl transition-all animate-scale-up z-10">
            
            {/* Modal Title/Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <Warehouse className="text-zinc-900 dark:text-zinc-50 h-5 w-5" />
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Receive Supply Shipment</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Register incoming warehouse SKU assets and update stock levels.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsReceiveModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReceiveSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Pallet Rack System"
                  value={newitemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                  SKU Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SKU-CCR-RAL (Auto if left empty)"
                  value={newSKU}
                  onChange={(e) => setNewSKU(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                    Estimated Price/Unit
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-500 text-sm font-semibold font-mono">$</span>
                    <input
                      type="text"
                      placeholder="120.00"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                    Supplier Entity
                  </label>
                  <select
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  >
                    <option value="Global Logistics">Global Logistics</option>
                    <option value="Apex Parts">Apex Parts</option>
                    <option value="Nexus Telecom Supply">Nexus Telecom Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                    Stock Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="In Transit">In Transit</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6 font-semibold text-xs">
                <button
                  type="button"
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newitemName.trim() || !newQuantity.trim()}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Receive Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
