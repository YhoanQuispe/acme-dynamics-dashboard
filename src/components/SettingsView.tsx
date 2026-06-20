import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Lock, 
  CloudLightning,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';
import { OperatorProfile, AlertSettings } from '../types';

interface SettingsViewProps {
  operatorProfile: OperatorProfile;
  onSaveProfile: (profile: OperatorProfile) => void;
  alertSettings: AlertSettings;
  onUpdateAlertSettings: (settings: AlertSettings) => void;
}

export default function SettingsView({ 
  operatorProfile, 
  onSaveProfile, 
  alertSettings, 
  onUpdateAlertSettings 
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'pipeline'>('profile');
  const [profileName, setProfileName] = useState(operatorProfile.name);
  const [profileEmail, setProfileEmail] = useState(operatorProfile.email);
  const [profileRole, setProfileRole] = useState<'Global Operations Administrator' | 'Logistics Director'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_operator_role');
      if (saved === 'Global Operations Administrator' || saved === 'Logistics Director') {
        return saved;
      }
    }
    return 'Global Operations Administrator';
  });
  const [profileDescription, setProfileDescription] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_operator_description');
      if (typeof saved === 'string') {
        return saved;
      }
    }
    return 'Responsible for global inventory control, warehouse synchronization, and corporate supply chain management.';
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [syncFrequency, setSyncFrequency] = useState<'15m' | '1h' | '12h' | '24h'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_pipeline_settings');
      if (saved === '15m' || saved === '1h' || saved === '12h' || saved === '24h') {
        return saved;
      }
    }
    return '1h';
  });
  const [isUpdatingPipeline, setIsUpdatingPipeline] = useState(false);
  const [pipelineSaved, setPipelineSaved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as '15m' | '1h' | '12h' | '24h';
    setSyncFrequency(value);
    setIsUpdatingPipeline(true);
    setPipelineSaved(false);
    
    setTimeout(() => {
      setIsUpdatingPipeline(false);
      localStorage.setItem('erp_pipeline_settings', value);
      setPipelineSaved(true);
      
      setTimeout(() => {
        setPipelineSaved(false);
      }, 1000);
    }, 800);
  };

  useEffect(() => {
    setProfileName(operatorProfile.name);
    setProfileEmail(operatorProfile.email);
  }, [operatorProfile]);

  // Hook to instantly save any changes to alertSettings to localStorage
  useEffect(() => {
    localStorage.setItem('erp_alert_settings', JSON.stringify(alertSettings));
  }, [alertSettings]);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'profile') {
      setIsSavingProfile(true);
      setTimeout(() => {
        const updated = { name: profileName, email: profileEmail };
        localStorage.setItem('erp_operator_profile', JSON.stringify(updated));
        localStorage.setItem('erp_operator_role', profileRole);
        localStorage.setItem('erp_operator_description', profileDescription);
        onSaveProfile(updated);
        setIsSavingProfile(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }, 1000);
    } else {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Control Center Settings
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Configure security credentials, notifications, and data synchronization parameters.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Settings Links */}
        <div className="md:col-span-1 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <ShieldCheck size={15} />
            Operations Profile
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <Bell size={15} />
            Alert Systems
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <Cpu size={15} />
            Workflow Automation
          </button>
        </div>

        {/* Form Area */}
        <div className="md:col-span-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6">
          <form onSubmit={saveSettings} className="space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Corporate Operations Identity</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Configure workspace personnel information and security profiles.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-2">Operations Director Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-2">Corporate Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-2">Access Role</label>
                    <select
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                    >
                      <option value="Global Operations Administrator">Global Operations Administrator</option>
                      <option value="Logistics Director">Logistics Director</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-2">Profile Description</label>
                    <textarea
                      rows={3}
                      value={profileDescription}
                      onChange={(e) => setProfileDescription(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 resize-none font-sans"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">ERP Integration Credentials</h4>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Active connections and verification signatures for localized logistics hubs.</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/85 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                    <Lock size={16} className="text-zinc-500 dark:text-zinc-400 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-200">Security Authorization Console</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">This physical enterprise terminal is authorized for secure management dashboard and records modifications. Security token active.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Notification Alert Handlers</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Configure warning threshold notifications.</p>
                </div>

                <div className="space-y-4">
                  {/* Critical Access Alerts Toggle */}
                  <div
                    onClick={() => onUpdateAlertSettings({ ...alertSettings, systemAlerts: !alertSettings.systemAlerts })}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/30 cursor-pointer select-none"
                  >
                    <div>
                      <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Critical Access Alerts</span>
                      <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Push notifications immediately on critical system errors or unexpected logins.</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Toggle Critical Access Alerts"
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        alertSettings.systemAlerts ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-250 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 shadow-xs ring-0 transition duration-200 ease-in-out ${
                          alertSettings.systemAlerts ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Operational Workflows Toggle */}
                  <div
                    onClick={() => onUpdateAlertSettings({ ...alertSettings, securityAlerts: !alertSettings.securityAlerts })}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/30 cursor-pointer select-none"
                  >
                    <div>
                      <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Operational Workflows</span>
                      <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Hourly stats on background task executions and platform syncs.</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Toggle Operational Workflows Alerts"
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        alertSettings.securityAlerts ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-250 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 shadow-xs ring-0 transition duration-200 ease-in-out ${
                          alertSettings.securityAlerts ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Billing Safety Limit Indicators Toggle */}
                  <div
                    onClick={() => onUpdateAlertSettings({ ...alertSettings, billingAlerts: !alertSettings.billingAlerts })}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/30 cursor-pointer select-none"
                  >
                    <div>
                      <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Billing Safety Limit Indicators</span>
                      <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Notify when billing spikes occur on integrated enterprise APIs.</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Toggle Billing Safety Limit Alerts"
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        alertSettings.billingAlerts ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-250 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 shadow-xs ring-0 transition duration-200 ease-in-out ${
                          alertSettings.billingAlerts ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Data Integration Syncer</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Configure active ledger refresh parameters.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono mb-2">Sync Frequency</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <select 
                      value={syncFrequency}
                      onChange={handleFrequencyChange}
                      disabled={isUpdatingPipeline}
                      className="w-full max-w-sm px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="15m">15 minutes (Real-time Stream Integration)</option>
                      <option value="1h">1 hour (Recommended Sweep)</option>
                      <option value="12h">12 hours (High-volume Sweep Interval)</option>
                      <option value="24h">24 hours (Daily Cron Summary)</option>
                    </select>

                    <div className="h-6 flex items-center min-w-[160px]">
                      {isUpdatingPipeline && (
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-mono text-[11px] animate-fade-in" id="pipeline-updating">
                          <Loader2 size={13} className="animate-spin text-amber-500" />
                          <span>Applying to hubs...</span>
                        </div>
                      )}
                      {!isUpdatingPipeline && pipelineSaved && (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] animate-fade-in font-semibold" id="pipeline-configured">
                          <Check size={13} className="text-emerald-500" />
                          <span>Configured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/85 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                  <Database size={16} className="text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-200">Core Ledger Sync: Connected</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">The central enterprise database is online. Secure data synchronization is fully active.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">Last saved just now.</span>
              <button 
                type="submit"
                disabled={activeTab === 'profile' && isSavingProfile}
                className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-2 px-5 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeTab === 'profile' ? (
                  isSavingProfile ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-zinc-300 dark:text-zinc-650" />
                      Saving Changes...
                    </>
                  ) : isSaved ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      Saved
                    </>
                  ) : (
                    'Save Settings'
                  )
                ) : isSaved ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    Saved
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
