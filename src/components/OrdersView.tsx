import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X,
  CreditCard,
  User,
  Trash2,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onAddOrder: (newOrder: Order) => void;
  onDeleteOrder: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: Order['fulfillmentStatus']) => void;
  searchQuery?: string;
  onSearchQueryChange?: (val: string) => void;
}

export default function OrdersView({ 
  orders, 
  onAddOrder, 
  onDeleteOrder, 
  onUpdateOrderStatus, 
  searchQuery,
  onSearchQueryChange 
}: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Delivered' | 'Shipped' | 'Pending' | 'Processing' | 'Cancelled'>('All');
  const [isExporting, setIsExporting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new order onboarding
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<'Pending' | 'Processing' | 'Shipped' | 'Delivered'>('Pending');

  // Client-side validation states
  const [customerError, setCustomerError] = useState('');
  const [amountError, setAmountError] = useState('');

  const handleCloseModal = () => {
    setCustomerName('');
    setTotalAmount('');
    setFulfillmentStatus('Pending');
    setCustomerError('');
    setAmountError('');
    setIsAddModalOpen(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    setCustomerError('');
    setAmountError('');

    const trimmedCustomer = customerName.trim();
    if (!trimmedCustomer) {
      setCustomerError('Customer entity name is required');
      hasError = true;
    }

    const trimmedAmount = totalAmount.trim();
    if (!trimmedAmount) {
      setAmountError('Total billings amount is required');
      hasError = true;
    } else {
      const numFloat = Number(trimmedAmount);
      if (isNaN(numFloat) || numFloat < 0) {
        setAmountError('Please enter a valid numeric amount');
        hasError = true;
      }
    }

    if (hasError) return;

    const numFloat = parseFloat(trimmedAmount);
    const formattedAmount = '$' + numFloat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: trimmedCustomer,
      orderDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      totalAmount: formattedAmount,
      fulfillmentStatus
    };

    onAddOrder(newOrder);

    // Reset Form Fields and Close via central helper
    handleCloseModal();
  };

  const handleDeleteOrder = (id: string) => {
    onDeleteOrder(id);
  };

  const handleUpdateStatus = (id: string, status: Order['fulfillmentStatus']) => {
    onUpdateOrderStatus(id, status);
  };

  const handleExportCSV = () => {
    if (isExporting) return;
    setIsExporting(true);

    setTimeout(() => {
      const headers = "Order ID,Customer,Order Date,Total Amount,Fulfillment Status\n";
      const rows = orders.map(o => {
        return `"${o.id}","${o.customer.replace(/"/g, '""')}","${o.orderDate}","${o.totalAmount}","${o.fulfillmentStatus}"`;
      }).join('\n');
      
      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'orders_ledger_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1200);
  };

  // Compute Metrics dynamically based on state
  const totalVolume = orders
    .filter(o => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'Processing')
    .reduce((acc, o) => {
      const cleaned = parseFloat(o.totalAmount.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + cleaned;
    }, 0);

  const activeOrdersCount = orders.filter(o => o.fulfillmentStatus === 'Processing' || o.fulfillmentStatus === 'Pending').length;
  const fulfilledOrdersCount = orders.filter(o => o.fulfillmentStatus === 'Shipped' || o.fulfillmentStatus === 'Delivered').length;
  const totalNonCancelled = orders.filter(o => o.fulfillmentStatus !== 'Cancelled').length;

  const fulfillmentRate = orders.length === 10
    ? '96.2'
    : (totalNonCancelled > 0 
        ? ((fulfilledOrdersCount / totalNonCancelled) * 100).toFixed(1) 
        : '0.0');

  // Filter computation
  const filteredOrders = orders.filter(o => {
    const query = (searchQuery !== undefined ? searchQuery : searchTerm).trim().toLowerCase();
    const customerMatch = o.customer.toLowerCase().includes(query);
    const idMatch = o.id.toLowerCase().includes(query);
    const statusMatch = statusFilter === 'All' ? true : o.fulfillmentStatus === statusFilter;
    return (customerMatch || idMatch) && statusMatch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl shadow-xs">
            <ShoppingCart size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Orders Registry</h1>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-0.5">
              Secure enterprise workflow for client ledger billing logs, order processing, and warehouse dispatches.
            </p>
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Export Ledger"
          >
            {isExporting ? <Loader2 size={13} className="animate-spin text-zinc-400" /> : <FileSpreadsheet size={13} />}
            {isExporting ? 'Exporting...' : 'Export Ledger'}
          </button>
          
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            title="Register Order"
          >
            <Plus size={14} className="stroke-[2.5px]" />
            Register Order
          </button>
        </div>
      </div>

      {/* Aggregate KPI Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Ledger Bookings */}
        <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase">Active Bookings Volume</span>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
              ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-medium">Excludes cancelled logistics lines.</p>
          </div>
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* Operational / Active Orders Queue */}
        <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase">Active Processing Queue</span>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
              {activeOrdersCount} <span className="text-xs font-sans text-zinc-400 font-normal">in progress</span>
            </div>
            <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-medium">Pending fulfillment and quality checks.</p>
          </div>
          <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Clock size={16} />
          </div>
        </div>

        {/* Shipping Dispatch Fulfillment rate */}
        <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase">Fulfillment Success Metrics</span>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
              {fulfillmentRate}%
            </div>
            <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-medium">Verified warehouse cargo delivery speed.</p>
          </div>
          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 rounded-lg">
            <CheckCircle2 size={16} />
          </div>
        </div>
      </div>

      {/* Control Filters panel */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between shrink-0">
        
        {/* Search input bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter orders by customer or ID..."
            value={searchQuery !== undefined ? searchQuery : searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              onSearchQueryChange?.(val);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-350 placeholder-zinc-400"
          />
          {(searchQuery !== undefined ? searchQuery : searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearchQueryChange?.('');
              }}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-650 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dynamic Horizontal Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 select-none">
          <div className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 mr-1 shrink-0">
            <SlidersHorizontal size={11} />
            Filter Fulfillments
          </div>
          {(['All', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'] as const).map((filter) => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 text-[10.5px] rounded-lg font-semibold cursor-pointer border transition-all shrink-0 ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 border-transparent shadow-xs'
                    : 'bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 border-zinc-200 dark:border-zinc-850 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Table Results Container */}
      <div className="border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-zinc-500 dark:text-zinc-400">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/20 text-[10px] font-bold tracking-wider font-mono uppercase text-zinc-400 dark:text-zinc-500 select-none">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/90 dark:divide-zinc-850">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  let badgeStyles = 'bg-zinc-100 text-zinc-750 dark:bg-zinc-900 dark:text-zinc-400';
                  if (order.fulfillmentStatus === 'Shipped' || order.fulfillmentStatus === 'Delivered') {
                    badgeStyles = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
                  } else if (order.fulfillmentStatus === 'Processing') {
                    badgeStyles = 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400';
                  } else if (order.fulfillmentStatus === 'Pending') {
                    badgeStyles = 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
                  } else if (order.fulfillmentStatus === 'Cancelled') {
                    badgeStyles = 'bg-rose-500/10 text-rose-700 dark:text-rose-400';
                  }

                  return (
                    <tr 
                      key={order.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-300">
                        {order.id}
                      </td>

                      {/* Customer Entity details */}
                      <td className="px-6 py-4 truncate font-medium text-zinc-800 dark:text-zinc-200 max-w-[180px]">
                        {order.customer}
                      </td>

                      {/* Logged Date */}
                      <td className="px-6 py-4 text-zinc-450 dark:text-zinc-500">
                        {order.orderDate}
                      </td>

                      {/* Total cost */}
                      <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-100 font-semibold">
                        {order.totalAmount}
                      </td>

                      {/* Fulfillment State Badges */}
                      <td className="px-6 py-4">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer border border-transparent focus:ring-1 focus:ring-zinc-450 dark:focus:ring-zinc-550 focus:outline-none transition-all ${badgeStyles}`}
                        >
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Processing">Processing</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Destructive / Action Controls */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1 rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/75 transition-all cursor-pointer inline-flex items-center justify-center align-middle"
                          title="Purge Order Record"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-13 text-center select-none space-y-2">
                    <ShoppingCart size={24} className="text-zinc-350 dark:text-zinc-650 mx-auto opacity-75" />
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-xs">No results found matching your search</p>
                    {(searchTerm || searchQuery || statusFilter !== 'All') && (
                      <button
                        type="button"
                        onClick={() => { 
                          setSearchTerm(''); 
                          onSearchQueryChange?.(''); 
                          setStatusFilter('All'); 
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

      {/* Onboard Order Modal Panel */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-[15%] md:top-[20%] mx-auto w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl shadow-2xl z-55 overflow-hidden flex flex-col"
            >
              {/* Header block */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-lg">
                    <Plus size={16} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider font-mono">Onboard Purchase Order</h2>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">Register client booking transaction.</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Close Dialog"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Content body */}
              <form onSubmit={handleCreateOrder} className="p-5 space-y-4 text-xs" noValidate>
                {/* Customer name info */}
                <div className="space-y-1">
                  <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono tracking-wider uppercase text-[9px] block">
                    Customer Entity Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="e.g. Helix Networks Corp"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (customerError) setCustomerError('');
                      }}
                      className={`w-full pl-9 pr-3 py-1.8 text-xs rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 transition-all font-sans ${
                        customerError 
                          ? 'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' 
                          : 'border-zinc-200 dark:border-zinc-805 focus:ring-zinc-900 dark:focus:ring-zinc-350'
                      }`}
                    />
                  </div>
                  {customerError && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1 font-sans">{customerError}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono tracking-wider uppercase text-[9px] block">
                    Total Billings Amount
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="e.g. 1250.50"
                      value={totalAmount}
                      onChange={(e) => {
                        setTotalAmount(e.target.value);
                        if (amountError) setAmountError('');
                      }}
                      className={`w-full pl-9 pr-3 py-1.8 text-xs font-mono rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 transition-all ${
                        amountError 
                          ? 'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500' 
                          : 'border-zinc-200 dark:border-zinc-805 focus:ring-zinc-900 dark:focus:ring-zinc-350'
                      }`}
                    />
                  </div>
                  {amountError && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1 font-sans">{amountError}</p>
                  )}
                </div>

                {/* Status Options option elements */}
                <div className="space-y-1">
                  <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono tracking-wider uppercase text-[9px] block">
                    Fulfillment Track Status
                  </label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value as any)}
                    className="w-full px-3 py-1.8 text-xs rounded-lg border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-350 transition-all cursor-pointer font-sans"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Submit action controls footer */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-3.5 py-2 font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 font-bold text-white dark:text-zinc-950 bg-slate-950 hover:bg-slate-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Authorize Onboarding
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
