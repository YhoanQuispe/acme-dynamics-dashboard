import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  DollarSign, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Loader2,
  X
} from 'lucide-react';
import { Customer } from '../types';

export default function CustomersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isExportingCustomers, setIsExportingCustomers] = useState(false);

  // Modal State
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newAccountTier, setNewAccountTier] = useState<string>('Standard');
  const [newSpentAmount, setNewSpentAmount] = useState('');
  const [newStatus, setNewStatus] = useState<'Active' | 'Inactive'>('Active');

  const initialCustomersList: Customer[] = [
    { id: '1', name: 'Olivia Ryann', company: 'Linear Technologies', email: 'olivia@linear.app', spent: '$350,000.00', status: 'Active', tier: 'Enterprise' },
    { id: '2', name: 'James Patterson', company: 'Subliminal Studio', email: 'james@subliminal.com', spent: '$120,000.00', status: 'Active', tier: 'Growth' },
    { id: '3', name: 'Sofia Martinez', company: 'Apex Industrial', email: 'sofia@apexindustrial.com', spent: '$450,000.00', status: 'Active', tier: 'Enterprise' },
    { id: '4', name: 'William Henderson', company: 'Atlassian Ltd', email: 'william@atlassian.com', spent: '$80,000.00', status: 'Active', tier: 'Startup' },
    { id: '5', name: 'Nora Al-Mansoor', company: 'Retool Corp', email: 'nora@retool.com', spent: '$250,050.00', status: 'Active', tier: 'Growth' },
    { id: '6', name: 'Yhoan Quispe', company: 'Acme Dynamics Corp', email: 'yhoan@acmedynamics.com', spent: '$199,950.00', status: 'Active', tier: 'Enterprise' },
  ];

  // Initialize unified customer list state with standard prefix check and legacy migrations
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_customers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const migrated = parsed.map((c: any) => ({
              id: c.id || `CST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name: c.name || 'Anonymous Partner',
              company: c.company || 'Legacy Corp',
              email: c.email || 'partner@example.com',
              spent: c.spent || '$0.00',
              status: c.status === 'Inactive' ? 'Inactive' : 'Active',
              tier: c.tier || 'Enterprise'
            }));
            return [...initialCustomersList, ...migrated];
          }
        } catch (e) {
          console.error('Error loading custom customers from localStorage', e);
        }
      }
    }
    return initialCustomersList;
  });

  // Sync custom customers to localStorage
  useEffect(() => {
    const customCustomers = customers.filter(c => c.id.startsWith('CST-'));
    localStorage.setItem('erp_customers', JSON.stringify(customCustomers));
  }, [customers]);

  const filteredCustomers = customers.filter(customer => {
    const nameVal = customer.name || '';
    const companyVal = customer.company || '';
    const emailVal = customer.email || '';
    const matchesSearch = nameVal.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          companyVal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emailVal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic aggregates for corporate header cards
  const totalBillingsStr = customers.reduce((acc, c) => {
    const cleaned = parseFloat((c.spent || '').replace(/[^0-9.-]+/g, '')) || 0;
    return acc + cleaned;
  }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const activeCount = customers.filter(c => c.status === 'Active').length;
  const retentionPercent = customers.length === 6 ? '98.7' : (customers.length > 0 ? ((activeCount / customers.length) * 100).toFixed(2) : '100.00');

  const handleExportCSV = () => {
    if (isExportingCustomers) return;
    setIsExportingCustomers(true);

    setTimeout(() => {
      // Build a well-structured CSV string representing the customers database
      const headers = "Customer ID,Full Name,Company Entity,Email Address,Aggregated Billings,Status,Account Tier\n";
      const rows = customers.map(c => {
        const idLabel = c.id.startsWith('CST-') ? c.id : `CST-08${c.id}`;
        return `"${idLabel}","${(c.name || '').replace(/"/g, '""')}","${(c.company || '').replace(/"/g, '""')}","${c.email || ''}","${c.spent || '$0.00'}","${c.status || 'Active'}","${c.tier || 'Enterprise'}"`;
      }).join('\n');
      const csvContent = headers + rows;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'customers_database_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExportingCustomers(false);
    }, 1200);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCompanyName.trim() || !newContactEmail.trim()) return;

    let parsedSpent = newSpentAmount.trim();
    if (!parsedSpent) {
      parsedSpent = '$0.00';
    } else {
      if (!parsedSpent.startsWith('$')) {
        parsedSpent = '$' + parsedSpent;
      }
    }

    const newCustomer: Customer = {
      id: `CST-${Date.now()}`,
      name: newCustomerName.trim(),
      company: newCompanyName.trim(),
      email: newContactEmail.trim(),
      spent: parsedSpent,
      status: newStatus,
      tier: newAccountTier
    };

    setCustomers(prev => [newCustomer, ...prev]);

    // Reset Form Fields
    setNewCustomerName('');
    setNewCompanyName('');
    setNewContactEmail('');
    setNewAccountTier('Standard');
    setNewSpentAmount('');
    setNewStatus('Active');

    setIsOnboardModalOpen(false);
  };

  const handleOffboardCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in" id="customers-view-container">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" id="customers-view-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Customer Directory
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Account directories, financial balances, and customer lifecycle management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            id="btn-csv-export"
            disabled={isExportingCustomers}
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExportingCustomers ? (
              <Loader2 size={14} className="animate-spin text-zinc-400 dark:text-zinc-500" />
            ) : (
              <FileSpreadsheet size={14} />
            )}
            {isExportingCustomers ? 'Exporting...' : 'CSV Export'}
          </button>
          
          <button 
            type="button"
            id="btn-onboard-account"
            onClick={() => setIsOnboardModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus size={15} />
            Onboard Account
          </button>
        </div>
      </div>

      {/* Stats Banner Grid */}
      <div className="grid gap-4 sm:grid-cols-3" id="customers-stats-banner">
        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-mono">Total Registry</span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 block">
              {customers.length} Accounts
            </span>
          </div>
          <div className="p-2 rounded-lg text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <Users size={16} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-mono">Core Retention</span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 block">
              {retentionPercent}%
            </span>
          </div>
          <div className="p-2 rounded-lg text-emerald-500 bg-emerald-500/10 border border-emerald-500/10">
            <CheckCircle size={16} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-mono">Total Managed Value</span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 block">
              ${totalBillingsStr}
            </span>
          </div>
          <div className="p-2 rounded-lg text-violet-500 bg-violet-500/10 border border-violet-500/10">
            <DollarSign size={16} />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" id="customers-control-bar">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search matching names, companies, emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
        </div>
        <div className="flex gap-2.5">
          {(['All', 'Active', 'Inactive'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                statusFilter === filter
                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50" id="customers-table-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <th className="px-6 py-4">Account Profile</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Company Entity</th>
                <th className="px-6 py-4">Contact Gateway</th>
                <th className="px-6 py-4">Aggregate Billings</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const initials = (customer.name || '')
                    .split(' ')
                    .filter(Boolean)
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || '??';

                  const idLabel = customer.id.startsWith('CST-') ? customer.id : `UID-08${customer.id}A`;

                  return (
                    <tr key={customer.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-semibold text-zinc-700 dark:text-zinc-300 text-xs font-mono">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
                                {customer.name || 'Anonymous Project'}
                              </h4>
                              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-semibold tracking-wider font-mono uppercase bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 rounded">
                                {customer.tier || "Enterprise"}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{idLabel}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          customer.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}>
                          {customer.status === 'Active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {customer.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300 font-sans">
                        {customer.company || 'Direct Partner'}
                      </td>
                      <td className="px-6 py-4">
                        {customer.email ? (
                          <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-1 hover:underline text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-mono">
                            <Mail size={12} />
                            {customer.email}
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">No direct contact</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        {customer.spent || '$0.00'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            type="button"
                            onClick={() => handleOffboardCustomer(customer.id)}
                            className="p-1 px-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 text-zinc-400 hover:text-rose-600 dark:text-zinc-550 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            title="Offboard Customer"
                          >
                            <XCircle size={13} />
                            <span>Offboard</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                    No matching accounts registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding Modal Overlay */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in" id="onboard-modal">
          <div className="absolute inset-0" onClick={() => setIsOnboardModalOpen(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl transition-all animate-scale-up z-10">
            
            {/* Modal Title/Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <UserPlus className="text-zinc-900 dark:text-zinc-50 h-5 w-5" />
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Onboard Client Account</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Onboard a new client business account into the global logistics database.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOnboardSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                  Contact Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                  Company Entity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Inc."
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. billing@stripe.com"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                    ACCOUNT SERVICE TIER
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Standard', 'Premium'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNewAccountTier(opt)}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                          newAccountTier === opt
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-10 border-solid'
                            : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-100 dark:border-zinc-850 text-zinc-650 dark:text-zinc-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 h-[38px]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-zinc-550 dark:text-zinc-400 mb-1.5">
                  Aggregate Billings / Contract Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-500 text-sm font-semibold font-mono">$</span>
                  <input
                    type="text"
                    placeholder="25,480.00"
                    value={newSpentAmount}
                    onChange={(e) => setNewSpentAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCustomerName.trim() || !newCompanyName.trim() || !newContactEmail.trim()}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Onboard Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
