import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Globe, 
  Flame, 
  Percent, 
  Filter,
  RefreshCw,
  Check,
  ChevronDown
} from 'lucide-react';

export default function AnalyticsView() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'conversion' | 'latency'>('revenue');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [status, setStatus] = useState<'all' | 'active' | 'pending'>('all');
  
  const [appliedDateRange, setAppliedDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [appliedStatus, setAppliedStatus] = useState<'all' | 'active' | 'pending'>('all');

  const simulateRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // 1 second refresh overhead as requested
  };

  const handleApplyFilters = () => {
    setAppliedDateRange(dateRange);
    setAppliedStatus(status);
    setIsFilterMenuOpen(false);
    simulateRefresh();
  };

  const handleResetFilters = () => {
    setDateRange('30d');
    setStatus('all');
    setAppliedDateRange('30d');
    setAppliedStatus('all');
    setIsFilterMenuOpen(false);
    simulateRefresh();
  };

  // Switch multiplier for chart points to simulate filtering changes!
  const multiplier = appliedDateRange === '7d' ? 0.75 : appliedDateRange === '90d' ? 1.35 : 1.0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Performance Analytics
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Operational performance metrics and corporate supply chain analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={simulateRefresh}
            disabled={isRefreshing}
            className={`flex items-center justify-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-all duration-200 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh Analytics Source Nodes"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {/* Interactive Filters Button & Menus */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
                isFilterMenuOpen 
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Filter size={14} />
              Filters
              {(appliedDateRange !== '30d' || appliedStatus !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
              )}
              <ChevronDown size={12} className={`opacity-60 transition-transform duration-250 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFilterMenuOpen && (
              <>
                {/* Click-Outside Overlay to dismiss dropdown */}
                <div 
                  onClick={() => setIsFilterMenuOpen(false)}
                  className="fixed inset-0 z-40 bg-transparent"
                />
                
                {/* Floating Dropped Panel */}
                <div className="absolute right-0 mt-2.5 w-72 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-4 shadow-lg shadow-zinc-950/10 dark:shadow-black/50 z-50 animate-fade-in text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">Analytics Filters</span>
                    <button 
                      onClick={handleResetFilters}
                      className="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Date Range Selector Segment */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono uppercase tracking-wider text-[9px] block">
                      Report Timeframe
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['7d', '30d', '90d'] as const).map((dr) => (
                        <button
                          key={dr}
                          type="button"
                          onClick={() => setDateRange(dr)}
                          className={`py-1.5 rounded-md font-semibold font-mono text-center text-[10px] transition-all cursor-pointer ${
                            dateRange === dr
                              ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs'
                              : 'bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800/40'
                          }`}
                        >
                          {dr === '7d' ? '7 Days' : dr === '30d' ? '30 Days' : '90 Days'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Execution Status Filter */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono uppercase tracking-wider text-[9px] block">
                      Order Status
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['all', 'active', 'pending'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`py-1.5 rounded-md font-semibold text-center text-[10px] capitalize transition-all cursor-pointer ${
                            status === st
                              ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs'
                              : 'bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800/40'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Controllers */}
                  <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                    <button
                      onClick={() => setIsFilterMenuOpen(false)}
                      className="flex-1 py-1.5 text-center font-semibold rounded-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 border border-zinc-200/50 dark:border-zinc-800/80 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 py-1.5 text-center font-semibold rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs cursor-pointer"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mini charts switcher layout - with 50% opacity fade during isRefreshing */}
      <div className={`grid gap-6 md:grid-cols-3 transition-all duration-300 ${isRefreshing ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'revenue'
              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium uppercase tracking-wider ${
              activeTab === 'revenue' 
                ? 'text-zinc-300 dark:text-zinc-600' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              QUARTERLY REVENUE
            </span>
            <TrendingUp size={16} className={activeTab === 'revenue' ? '' : 'text-emerald-500'} />
          </div>
          <p className="text-2xl font-bold tracking-tight mt-2">${(1.24 * multiplier).toFixed(2)}M</p>
          <p className={`text-xs mt-1.5 ${
            activeTab === 'revenue' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
          }`}>
            +21% vs last quarter
          </p>
        </button>

        <button
          onClick={() => setActiveTab('conversion')}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'conversion'
              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium uppercase tracking-wider ${
              activeTab === 'conversion' 
                ? 'text-zinc-300 dark:text-zinc-600' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              PERFECT ORDER RATE
            </span>
            <Percent size={16} className={activeTab === 'conversion' ? '' : 'text-violet-500'} />
          </div>
          <p className="text-2xl font-bold tracking-tight mt-2">{(96.82 * (multiplier === 0.75 ? 0.99 : multiplier === 1.35 ? 1.01 : 1.0)).toFixed(2)}%</p>
          <p className={`text-xs mt-1.5 ${
            activeTab === 'conversion' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
          }`}>
            +0.4% efficiency growth
          </p>
        </button>

        <button
          onClick={() => setActiveTab('latency')}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'latency'
              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium uppercase tracking-wider ${
              activeTab === 'latency' 
                ? 'text-zinc-300 dark:text-zinc-600' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              AVG. DISPATCH TIME
            </span>
            <Flame size={16} className={activeTab === 'latency' ? '' : 'text-rose-500'} />
          </div>
          <p className="text-2xl font-bold tracking-tight mt-2">{(2.4 * (multiplier === 0.75 ? 1.2 : multiplier === 1.35 ? 0.8 : 1.0)).toFixed(1)} Days</p>
          <p className={`text-xs mt-1.5 ${
            activeTab === 'latency' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
          }`}>
            -4.5% dispatch delay (optimized)
          </p>
        </button>
      </div>

      {/* Main Stats Graph Card - with 50% opacity fade during isRefreshing */}
      <div className={`rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6 transition-all duration-300 ${isRefreshing ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 capitalize">
              {activeTab === 'revenue' ? 'Revenue Growth' : activeTab === 'conversion' ? 'Perfect Order Rate' : 'Dispatch Time'} Trend Visualization
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Interactive historical performance data tracked across fiscal periods. 
              {appliedDateRange !== '30d' && ` Filtered: ${appliedDateRange === '7d' ? 'Last 7 Days' : 'Last 90 Days'}.`}
              {appliedStatus !== 'all' && ` Status matching: ${appliedStatus}.`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-50"></span>
            Current Period
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-zinc-400 ml-3"></span>
            Previous Baseline
          </div>
        </div>

        {/* Custom SVG Rendered Graph showing a beautiful trend line */}
        <div className="h-64 w-full relative">
          <svg className="w-full h-full text-zinc-600 dark:text-zinc-400" viewBox="0 0 1000 300" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="50" x2="1000" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
            <line x1="0" y1="125" x2="1000" y2="125" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
            <line x1="0" y1="200" x2="1000" y2="200" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
            <line x1="0" y1="275" x2="1000" y2="275" stroke="currentColor" strokeOpacity="0.08" />

            {/* Dotted Baseline Line (Previous Period) */}
            <path 
              d={`M 0 ${250 * multiplier} Q 150 ${200 * multiplier}, 300 ${210 * multiplier} T 600 ${120 * multiplier} T 900 ${80 * multiplier} T 1000 ${90 * multiplier}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeOpacity="0.2"
              strokeDasharray="6 6"
            />

            {/* Main Sparkline (Gradient Filled Line) */}
            {activeTab === 'revenue' && (
              <>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0 ${240 * multiplier} Q 150 ${180 * multiplier}, 280 ${140 * multiplier} T 560 ${90 * multiplier} T 800 ${50 * multiplier} T 1000 ${45 * multiplier}`} 
                  fill="url(#chartGrad)" 
                />
                <path 
                  d={`M 0 ${240 * multiplier} Q 150 ${180 * multiplier}, 280 ${140 * multiplier} T 560 ${90 * multiplier} T 800 ${50 * multiplier} T 1000 ${45 * multiplier}`} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                {/* Visual Anchors */}
                <circle cx="560" cy={90 * multiplier} r="4.5" fill="#10b981" />
                <circle cx="1000" cy={45 * multiplier} r="4.5" fill="#10b981" />
              </>
            )}

            {activeTab === 'conversion' && (
              <>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0 ${260 * multiplier} Q 150 ${230 * multiplier}, 280 ${180 * multiplier} T 560 ${160 * multiplier} T 800 ${110 * multiplier} T 1000 ${60 * multiplier}`} 
                  fill="url(#chartGrad)" 
                />
                <path 
                  d={`M 0 ${260 * multiplier} Q 150 ${230 * multiplier}, 280 ${180 * multiplier} T 560 ${160 * multiplier} T 800 ${110 * multiplier} T 1000 ${60 * multiplier}`} 
                  fill="none" 
                  stroke="#8b5cf6" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                <circle cx="800" cy={110 * multiplier} r="4.5" fill="#8b5cf6" />
                <circle cx="1000" cy={60 * multiplier} r="4.5" fill="#8b5cf6" />
              </>
            )}

            {activeTab === 'latency' && (
              <>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0 ${80 * multiplier} Q 150 ${90 * multiplier}, 280 ${140 * multiplier} T 560 ${180 * multiplier} T 800 ${190 * multiplier} T 1000 ${230 * multiplier}`} 
                  fill="url(#chartGrad)" 
                />
                <path 
                  d={`M 0 ${80 * multiplier} Q 150 ${90 * multiplier}, 280 ${140 * multiplier} T 560 ${180 * multiplier} T 800 ${190 * multiplier} T 1000 ${230 * multiplier}`} 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                <circle cx="560" cy={180 * multiplier} r="4.5" fill="#f43f5e" />
                <circle cx="1000" cy={230 * multiplier} r="4.5" fill="#f43f5e" />
              </>
            )}
          </svg>
        </div>

        {/* Chart X Labels */}
        <div className="flex justify-between px-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/40 text-xs text-zinc-400 font-mono">
          <span>Q1 2026</span>
          <span>Apr 2026</span>
          <span>May 2026</span>
          <span>Jun 2026 - Active</span>
        </div>
      </div>
    </div>
  );
}
