import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  Building2, 
  Command, 
  CheckCircle2, 
  Info, 
  AlertCircle,
  X,
  User,
  ExternalLink,
  Terminal,
  ShieldAlert,
  Loader2,
  BellOff
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import OrdersView from './components/OrdersView';
import CustomersView from './components/CustomersView';
import InventoryView from './components/InventoryView';
import SettingsView from './components/SettingsView';
import { NotificationItem, Blueprint, AuditLog, OperatorProfile, AlertSettings, Order, InventoryItem } from './types';

// Sidebar items definition
const navigationItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'orders', name: 'Orders', icon: ShoppingCart },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'inventory', name: 'Inventory', icon: Package },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const DEFAULT_ORDERS: Order[] = [
  { id: 'ORD-2026-001', customer: 'TechFlow Inc', orderDate: '2026-05-12', totalAmount: '$12,400.00', fulfillmentStatus: 'Delivered' },
  { id: 'ORD-2026-002', customer: 'Global Industries', orderDate: '2026-05-15', totalAmount: '$25,000.00', fulfillmentStatus: 'Delivered' },
  { id: 'ORD-2026-003', customer: 'Stark Logistics', orderDate: '2026-05-19', totalAmount: '$23,850.00', fulfillmentStatus: 'Processing' },
  { id: 'ORD-2026-004', customer: 'Nova Dynamics', orderDate: '2026-05-22', totalAmount: '$15,600.05', fulfillmentStatus: 'Delivered' },
  { id: 'ORD-2026-005', customer: 'Apex Manufacturing', orderDate: '2026-05-26', totalAmount: '$22,869.95', fulfillmentStatus: 'Pending' },
  { id: 'ORD-2026-006', customer: 'Nexus Corp', orderDate: '2026-05-30', totalAmount: '$22,100.00', fulfillmentStatus: 'Delivered' },
  { id: 'ORD-2026-007', customer: 'Quantum Services', orderDate: '2026-06-02', totalAmount: '$18,400.00', fulfillmentStatus: 'Processing' },
  { id: 'ORD-2026-008', customer: 'Horizon Holdings', orderDate: '2026-06-04', totalAmount: '$15,150.00', fulfillmentStatus: 'Processing' },
  { id: 'ORD-2026-009', customer: 'Silverline Tech', orderDate: '2026-06-05', totalAmount: '$14,780.00', fulfillmentStatus: 'Pending' },
  { id: 'ORD-2026-010', customer: 'Omega Systems', orderDate: '2026-06-06', totalAmount: '$24,950.00', fulfillmentStatus: 'Pending' }
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Optima Laser Scanner v4', sku: 'SKU-OPT-LS4', stock: 48, price: '$420.00', status: 'In Stock', supplier: 'Apex Parts' },
  { id: '2', name: 'Industrial Pallet Rack System', sku: 'SKU-CCR-RAL', stock: 4, price: '$1,250.00', status: 'Low Stock', supplier: 'Global Logistics' },
  { id: '3', name: 'Fiber Optic Cable Reel', sku: 'SKU-ZPF-CAB', stock: 120, price: '$72.50', status: 'In Stock', supplier: 'Nexus Telecom Supply' },
  { id: '4', name: 'Thermal Pro Sensors (10pk)', sku: 'SKU-TPS-10K', stock: 0, price: '$210.00', status: 'Out of Stock', supplier: 'Apex Parts' },
  { id: '5', name: 'High-Density Relays Suite', sku: 'SKU-HDR-SUI', stock: 12, price: '$350.00', status: 'Low Stock', supplier: 'Global Logistics' },
  { id: 'INV-2026-901', name: 'Premium Ceramic Sublimation Mugs', sku: 'MUG-SUB-001', stock: 0, price: '$15.00', status: 'Out of Stock', supplier: 'Global Logistics' },
  { id: 'INV-2026-902', name: 'Blank Cotton Screen Printing T-Shirts', sku: 'TSH-SCR-002', stock: 0, price: '$9.99', status: 'Out of Stock', supplier: 'Global Logistics' }
];

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Synchronized global states for Orders and Inventory
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_orders_global_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error('Error loading orders from localStoragev2', e);
        }
      }
    }
    return DEFAULT_ORDERS;
  });

  const [items, setItems] = useState<InventoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_inventory_global_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error('Error loading inventory from localStoragev2', e);
        }
      }
    }
    return DEFAULT_INVENTORY;
  });

  // Persists to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem('erp_orders_global_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('erp_inventory_global_v2', JSON.stringify(items));
  }, [items]);

  // Global state operators
  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleUpdateOrderStatus = (id: string, status: Order['fulfillmentStatus']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, fulfillmentStatus: status } : o));
  };

  const handleAddItem = (newItem: InventoryItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleIncrementStock = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStock = item.stock + 1;
        let nextStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'In Transit' = 'In Stock';
        if (nextStock === 0) nextStatus = 'Out of Stock';
        else if (nextStock <= 15) nextStatus = 'Low Stock';
        const statusToApply = item.status === 'In Transit' ? 'In Transit' : nextStatus;
        return { ...item, stock: nextStock, status: statusToApply };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Read initial theme preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut to focus search input (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persistent Alert Settings state
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_alert_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed &&
            typeof parsed.systemAlerts === 'boolean' &&
            typeof parsed.securityAlerts === 'boolean' &&
            typeof parsed.billingAlerts === 'boolean'
          ) {
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing erp_alert_settings from localStorage', e);
        }
      }
    }
    return { systemAlerts: true, securityAlerts: true, billingAlerts: true };
  });

  useEffect(() => {
    localStorage.setItem('erp_alert_settings', JSON.stringify(alertSettings));
    if (!alertSettings.systemAlerts) {
      setNotifications([]);
    }
  }, [alertSettings]);

  // Synchronized operator profile state from localStorage with fallback
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_operator_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.name === 'string' && typeof parsed.email === 'string') {
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing erp_operator_profile from localStorage', e);
        }
      }
    }
    return { name: 'Operations Director', email: 'director@enterprise.com' };
  });

  // Manual reactive session & login states
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // System Audit Log Drawer & Filters States
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [auditFilter, setAuditFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', timestamp: '17:52:12', eventId: 'AUD-902', severity: 'Critical', description: 'Unauthorized database access attempt blocked from unrecognized IP range.' },
    { id: '2', timestamp: '17:48:33', eventId: 'AUD-442', severity: 'Info', description: 'Logistics database automated backup successfully synchronized with server.' },
    { id: '3', timestamp: '17:41:05', eventId: 'AUD-718', severity: 'Warning', description: 'High storage capacity (89%) detected on Warehouse WH-02.' },
    { id: '4', timestamp: '17:30:19', eventId: 'AUD-205', severity: 'Info', description: 'API Access Token rotated for manager_04.' },
    { id: '5', timestamp: '17:15:00', eventId: 'AUD-883', severity: 'Critical', description: 'Fulfillment transaction validation check failed on external ledger.' },
    { id: '6', timestamp: '16:58:45', eventId: 'AUD-310', severity: 'Info', description: 'Regional route freight dispatch list updated in region Chicago, IL.' },
    { id: '7', timestamp: '16:12:02', eventId: 'AUD-559', severity: 'Warning', description: 'Fulfillment rate delay alert triggered for client_ID_ae8f.' },
    { id: '8', timestamp: '15:24:16', eventId: 'AUD-119', severity: 'Info', description: 'Corporate directory team user sync updated: 42 personnel mappings.' },
    { id: '9', timestamp: '14:05:51', eventId: 'AUD-672', severity: 'Critical', description: 'Internal pricing ledger partition mismatch automated resolve completed.' },
    { id: '10', timestamp: '13:50:28', eventId: 'AUD-104', severity: 'Info', description: 'General Ledger key rotation daemon executed: regenerated master encryption seed.' }
  ]);

  // Persistent Blueprints state
  const [blueprints, setBlueprints] = useState<Blueprint[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_blueprints');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.map((bp: any) => ({
              ...bp,
              blueprintClassType: bp.blueprintClassType || bp.type || 'Legacy Blueprint',
              targetDeploymentTier: bp.targetDeploymentTier || bp.environment || 'Production'
            }));
          }
        } catch (e) {
          console.error('Error parsing blueprints from localStorage', e);
        }
      }
    }
    return [
      {
        id: 'bp-default-1',
        name: 'Fleet Expansion Initiative',
        blueprintClassType: 'Operations',
        targetDeploymentTier: 'Phase 2',
        createdAt: 'May 28, 2026'
      },
      {
        id: 'bp-default-2',
        name: 'Route Optimization Initiative',
        blueprintClassType: 'Logistics',
        targetDeploymentTier: 'Phase 1',
        createdAt: 'May 29, 2026'
      }
    ];
  });

  const handleCreateBlueprint = (newBlueprint: Omit<Blueprint, 'id' | 'createdAt'>) => {
    const bp: Blueprint = {
      ...newBlueprint,
      id: `bp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    };
    setBlueprints(prev => [bp, ...prev]);
  };

  const handleDeleteBlueprint = (id: string) => {
    setBlueprints(prev => prev.filter(bp => bp.id !== id));
  };

  // Sync blueprints with localStorage
  useEffect(() => {
    localStorage.setItem('erp_blueprints', JSON.stringify(blueprints));
  }, [blueprints]);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'notif-1', title: 'Compile Success', description: 'Production bundle successfully built at 12ms', timestamp: 'Just now', unread: true, type: 'success' },
    { id: 'notif-2', title: 'Inventory Warning', description: 'Core Controller SKU is running extremely low', timestamp: '1 hour ago', unread: true, type: 'warning' },
    { id: 'notif-3', title: 'Active Audit Session', description: 'Physical workspace authenticated from location US-East', timestamp: '3 hours ago', unread: false, type: 'info' }
  ]);


  // Sync theme with DOM document Element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getInitials = (nameString: string) => {
    if (!nameString) return 'OP';
    const parts = nameString.trim().split(/\s+/);
    if (parts.length === 0) return 'OP';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().substring(0, 2);
  };

  const countUnread = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSignOutNode = () => {
    setShowProfileMenu(false);
    setIsLoggedIn(false);
  };

  const handleReconnectNode = () => {
    setIsLoggedIn(true);
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    // 1. Mark clicked notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notif.id ? { ...n, unread: false } : n)
    );
    
    // 2. Shut notifications dropdown panel so changes are instantly visible
    setShowNotifications(false);

    // 3. Extract keywords to route to appropriate view components
    const title = notif.title.toLowerCase();
    const desc = notif.description.toLowerCase();

    if (title.includes('stock') || title.includes('inventory') || title.includes('sku') || desc.includes('stock') || desc.includes('inventory') || desc.includes('sku') || desc.includes('shipment')) {
      setCurrentView('inventory');
    } else if (title.includes('blueprint') || title.includes('deployment') || title.includes('compile') || desc.includes('blueprint') || desc.includes('deployment') || desc.includes('compile') || desc.includes('production bundle')) {
      setCurrentView('dashboard');
    } else if (title.includes('contract') || title.includes('account') || title.includes('customer') || title.includes('tier') || desc.includes('contract') || desc.includes('account') || desc.includes('customer') || desc.includes('tier')) {
      setCurrentView('customers');
    } else if (title.includes('audit') || title.includes('security') || desc.includes('workspace') || desc.includes('audit') || desc.includes('security')) {
      setCurrentView('dashboard');
      setIsAuditDrawerOpen(true);
    } else if (title.includes('node') || title.includes('infrastructure') || desc.includes('node') || desc.includes('infrastructure')) {
      setCurrentView('dashboard');
    } else {
      // Default fallback context
      setCurrentView('dashboard');
    }
  };

  // Switch content based on current view ID
  const renderContentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            blueprints={blueprints} 
            onDeleteBlueprint={handleDeleteBlueprint} 
            operatorName={operatorProfile.name} 
            orders={orders} 
            items={items} 
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'orders':
        return (
          <OrdersView 
            orders={orders} 
            onAddOrder={handleAddOrder} 
            onDeleteOrder={handleDeleteOrder} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        );
      case 'customers':
        return <CustomersView />;
      case 'inventory':
        return (
          <InventoryView 
            items={items} 
            onAddItem={handleAddItem} 
            onIncrementStock={handleIncrementStock} 
            onDeleteItem={handleDeleteItem} 
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            operatorProfile={operatorProfile} 
            onSaveProfile={setOperatorProfile} 
            alertSettings={alertSettings}
            onUpdateAlertSettings={setAlertSettings}
          />
        );
      default:
        return (
          <DashboardView 
            blueprints={blueprints} 
            onDeleteBlueprint={handleDeleteBlueprint} 
            operatorName={operatorProfile.name} 
            orders={orders} 
            items={items} 
          />
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased flex items-center justify-center p-4 transition-colors duration-200" id="clean-login-screen">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden" id="login-card">
          {/* Top Security Stripe ambient banner */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-950/40 via-zinc-950 to-zinc-950/40 dark:from-zinc-50/40 dark:via-zinc-100 dark:to-zinc-50/40" />
          
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center shadow-md mb-4">
              <Building2 size={24} className="text-white dark:text-zinc-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase font-sans">
              Acme Dynamics
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enterprise Operations Management System
            </p>
          </div>

          <div className="border-t border-b border-zinc-105 dark:border-zinc-800/80 py-5 space-y-4">
            <div className="flex items-center gap-3 bg-zinc-50/55 dark:bg-zinc-950/45 p-3 rounded-xl border border-zinc-150 dark:border-zinc-850">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-900 dark:bg-zinc-200 flex items-center justify-center font-bold text-white dark:text-zinc-950 text-xs">
                {getInitials(operatorProfile.name)}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                  {operatorProfile.name}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 truncate">
                  {operatorProfile.email}
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 dark:text-zinc-500 uppercase block">
                  Security Token Authorization
                </label>
                <input
                  type="password"
                  disabled
                  value="••••••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 text-zinc-450 dark:text-zinc-650 cursor-not-allowed select-none font-sans focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleReconnectNode}
            className="w-full py-2.5 px-4 text-xs font-bold bg-slate-950 hover:bg-slate-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-lg transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Sign In to Workplace
          </button>

          <p className="text-center text-[9px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
            SECURE ACCESS GATEWAY • EST. 2026
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased selection:bg-zinc-900/10 dark:selection:bg-zinc-100/10 flex transition-colors duration-200">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}
      
      {/* LEFT SIDEBAR (Sticky, handles collapsing behavior smoothly) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-200/80 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-64'
        } w-64`}
      >
        {/* Company Logo / Branding Top Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-100 dark:border-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-white dark:text-zinc-900" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50 uppercase whitespace-nowrap animate-fade-in">
                Acme Dynamics
              </span>
            )}
          </div>
          
          {/* Collapse toggler shown on desktop only */}
          {!sidebarCollapsed && (
            <button 
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hidden md:block cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Brand Trigger Toggle on Sidebar Collapsed */}
        {sidebarCollapsed && (
          <div className="flex justify-center py-4 border-b border-zinc-100 dark:border-zinc-900/40 shrink-0">
            <button 
              onClick={() => setSidebarCollapsed(false)}
              className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer hover:shadow-xs transition-transform"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Navigation List items of 6 objects */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setMobileOpen(false); }}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-50 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50/70 dark:hover:bg-zinc-900/30'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <IconComponent 
                  size={16} 
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                  }`} 
                />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Snippet Section Bottom */}
        <div className="border-t border-zinc-100 dark:border-zinc-900/60 p-3 shrink-0">
          <div 
            onClick={() => { if(!sidebarCollapsed) setShowProfileMenu(!showProfileMenu); }}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
              sidebarCollapsed ? 'justify-center hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer'
            }`}
          >
            <div className="relative shrink-0">
              {/* Custom High-contrast Initials Avatar */}
              <div className="h-9 w-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center font-bold text-white dark:text-zinc-950 text-xs">
                {getInitials(operatorProfile.name)}
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
            </div>
            
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                  {operatorProfile.name}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate font-mono mt-0.5">
                  {operatorProfile.email}
                </p>
              </div>
            )}
          </div>

          {/* Quick Profile Dropdown Controls */}
          {!sidebarCollapsed && showProfileMenu && (
            <div className="mt-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 space-y-1 animate-fade-in">
              <button 
                onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <User size={13} />
                Profile Settings
              </button>
              <button 
                onClick={handleSignOutNode}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-red-500/10 text-red-650 dark:text-red-400 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT/CENTER CONTENT AREA (Adjust padding dynamically based on sidebar collapse) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
      }`}>
        
        {/* TOP NAVBAR (Sticky, backdrop-blur-md) */}
        <header className="sticky top-0 z-30 h-16 border-b border-zinc-200/80 dark:border-zinc-900/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md flex items-center justify-between px-6 transition-all">
          
          {/* Search Bar Input Container */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            {/* Collapse / Uncollapse Sidebar for Mobile Viewports */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 block md:hidden cursor-pointer"
            >
              <Menu size={18} />
            </button>

            <div 
              onClick={() => searchInputRef.current?.focus()}
              className="relative w-full max-w-sm hidden sm:block cursor-text"
            >
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500 cursor-text" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ERP Enterprise Command Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(e.currentTarget.value);
                  }
                }}
                className="w-full pl-9 pr-20 py-1.5 text-xs rounded-lg border border-zinc-200/80 dark:border-zinc-800/85 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300 placeholder-zinc-400 font-sans cursor-text"
              />
              <button 
                type="button"
                id="topbar-search-submit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  const val = searchInputRef.current?.value || '';
                  setSearchQuery(val);
                }}
                className="absolute right-1 top-[3px] px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-sans text-[10px] font-semibold hover:bg-zinc-800 dark:hover:bg-white active:scale-95 transition-all select-none cursor-pointer shadow-sm"
                title="Trigger Search (Enter)"
              >
                Search
              </button>
            </div>
          </div>

          {/* Action Tools: theme, notification, active node indicator */}
          <div className="flex items-center gap-3">
            
            {/* Active System Status Label */}
            <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest font-mono">
              Enterprise Hub: <span className="text-zinc-900 dark:text-zinc-100">Dublin</span>
            </span>

            {/* Theme Toggle (Sun/Moon) */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer border border-zinc-100/50 dark:border-zinc-800 transition-all shadow-xs"
              title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {/* Notification Bell Button with Red Indicator Dot */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer border border-zinc-100/50 dark:border-zinc-800 transition-all shadow-xs"
              >
                <Bell size={15} />
                {countUnread > 0 && alertSettings.systemAlerts && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 shadow-lg shadow-zinc-900/10 dark:shadow-black/40 overflow-hidden text-xs animate-fade-in z-50">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">Alert Center Log</span>
                    {countUnread > 0 && alertSettings.systemAlerts && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-64 overflow-y-auto">
                    {!alertSettings.systemAlerts ? (
                      <div className="p-8 text-center space-y-2.5">
                        <div className="mx-auto w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                          <BellOff size={14} className="animate-pulse" />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-[11px] leading-relaxed max-w-[200px] mx-auto text-balance">
                          System alerts are currently muted by notification settings threshold.
                        </p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 relative group flex items-start gap-2.5 transition-colors cursor-pointer select-none hover:bg-zinc-100/55 dark:hover:bg-zinc-800/40 ${
                            notif.unread ? 'bg-zinc-50/80 dark:bg-zinc-850/40 font-medium' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'success' && <CheckCircle2 size={13} className="text-emerald-500" />}
                            {notif.type === 'warning' && <AlertCircle size={13} className="text-amber-500" />}
                            {notif.type === 'info' && <Info size={13} className="text-zinc-400" />}
                          </div>
                          
                          <div className="flex-1 pr-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">{notif.title}</span>
                              <span className="text-zinc-400 dark:text-zinc-400 text-[11px] leading-snug">{notif.description}</span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-400 inline-block mt-1">{notif.timestamp}</span>
                          </div>

                          {/* Quick Clear Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                            className="absolute top-3 right-3 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-0.5 rounded cursor-pointer transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-zinc-400 dark:text-zinc-500">
                        No active log instances in queue.
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 text-center bg-zinc-50/50 dark:bg-zinc-900/30">
                    <button 
                      onClick={() => { setShowNotifications(false); setIsAuditDrawerOpen(true); }}
                      className="w-full text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:underline py-1 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Audit Operational Systems Log
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA (Generous spacing and breathable padding) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderContentView()}
        </main>
        
      </div>

      {/* AUDIT LOG SLIDE-OVER DRAWER */}
      {isAuditDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden" id="audit-log-drawer-container">
          {/* Backdrop with real blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsAuditDrawerOpen(false)}
          />
          
          {/* Slide-over Panel */}
          <div className="relative w-full max-w-lg bg-zinc-950 text-zinc-100 shadow-2xl p-6 border-l border-zinc-800 flex flex-col h-full animate-slide-in-right z-10" id="audit-log-drawer">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-rose-400">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight font-mono text-zinc-50 flex items-center gap-2">
                    SYSTEM SECURITY AUDITOR
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-wider animate-pulse">
                      SECURE Logs
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-zinc-400 font-sans mt-0.5">Real-time connection verification and infrastructure event ledger.</p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setIsAuditDrawerOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors cursor-pointer animate-fade-in"
                aria-label="Close auditor drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sub-Header: Search & Filters Panel */}
            <div className="py-4 space-y-3 shrink-0">
              {/* Monospace Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter events by keyword (S3, IP, Node...)"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs font-mono rounded-lg border border-zinc-850 bg-zinc-900/50 text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500/50 placeholder-zinc-500 transition-all font-sans"
                />
                {auditSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setAuditSearchQuery('')}
                    className="absolute right-2.5 top-2.5 p-0.5 rounded text-zinc-500 hover:text-zinc-250 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Filters row with buttons for All, Critical, Warning, Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 font-mono">
                  Log severity class
                </span>
                
                <div className="inline-flex rounded-lg border border-zinc-800 p-0.5 bg-zinc-950">
                  {(['All', 'Critical', 'Warning', 'Info'] as const).map((filterVal) => {
                    const isActive = auditFilter === filterVal;
                    return (
                      <button
                        key={filterVal}
                        type="button"
                        onClick={() => setAuditFilter(filterVal)}
                        className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded-md transition-all duration-150 cursor-pointer ${
                          isActive
                            ? filterVal === 'Critical'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : filterVal === 'Warning'
                              ? 'bg-amber-500 text-zinc-950 shadow-xs'
                              : filterVal === 'Info'
                              ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                              : 'bg-zinc-800 text-zinc-50 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {filterVal}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Audit Logs list space-y */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 font-mono text-xs scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
              {(() => {
                const filtered = auditLogs.filter(log => {
                  // Severity matching
                  if (auditFilter !== 'All' && log.severity !== auditFilter) {
                    return false;
                  }
                  // Search query matching
                  if (auditSearchQuery.trim()) {
                    const normQuery = auditSearchQuery.toLowerCase();
                    return (
                      log.description.toLowerCase().includes(normQuery) ||
                      log.eventId.toLowerCase().includes(normQuery) ||
                      log.severity.toLowerCase().includes(normQuery)
                    );
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center border border-dashed border-zinc-800/80 rounded-xl space-y-2 select-none">
                      <Terminal size={24} className="text-zinc-700 mx-auto animate-pulse" />
                      <p className="text-zinc-500 text-[11px]">No operational logs match query filters</p>
                      <button 
                        type="button" 
                        onClick={() => { setAuditFilter('All'); setAuditSearchQuery(''); }}
                        className="text-[10px] text-rose-450 hover:underline cursor-pointer"
                      >
                        Reset log filter criteria
                      </button>
                    </div>
                  );
                }

                return filtered.map((log) => {
                  let badgeColors = 'bg-zinc-800 text-zinc-300 border-zinc-700';
                  if (log.severity === 'Critical') {
                    badgeColors = 'bg-rose-950/40 text-rose-400 border-rose-900/40';
                  } else if (log.severity === 'Warning') {
                    badgeColors = 'bg-amber-950/30 text-amber-400 border-amber-900/30';
                  } else if (log.severity === 'Info') {
                    badgeColors = 'bg-emerald-950/20 text-emerald-450 border-emerald-900/20';
                  }

                  return (
                    <div 
                      key={log.id}
                      className="p-3.5 bg-zinc-900/35 hover:bg-zinc-900/60 border border-zinc-900 rounded-lg transition-all duration-150 flex flex-col gap-2 relative group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 font-bold text-[10px] tracking-wider">[{log.eventId}]</span>
                          <span className={`inline-flex items-center px-1.5 py-0.2 rounded border font-mono text-[9px] font-bold uppercase tracking-wide ${badgeColors}`}>
                            {log.severity}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-medium">{log.timestamp}</span>
                      </div>
                      
                      <p className="text-[11.5px] text-zinc-350 leading-snug break-all font-mono">
                        {log.description}
                      </p>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer System Status details */}
            <div className="pt-4 border-t border-zinc-800/80 mt-auto flex items-center justify-between text-[10px] font-medium text-zinc-500 font-mono shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SYNCED: ALL CHANNELS ACTIVE
              </span>
              <span>v1.0.8p</span>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
