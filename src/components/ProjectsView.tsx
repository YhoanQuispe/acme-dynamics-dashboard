import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  FolderGit2, 
  ExternalLink, 
  MoreVertical, 
  Search, 
  Sparkles,
  Filter,
  X,
  Loader2,
  CheckCircle2,
  Trash2,
  Layers
} from 'lucide-react';
import { Project, Blueprint } from '../types';

interface ProjectsViewProps {
  blueprints: Blueprint[];
  onCreateBlueprint: (bp: Omit<Blueprint, 'id' | 'createdAt'>) => void;
  onDeleteBlueprint: (id: string) => void;
}

export default function ProjectsView({ blueprints, onCreateBlueprint, onDeleteBlueprint }: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Blueprint Dialog state managers
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form input elements
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintType, setBlueprintType] = useState('Logistics');
  const [blueprintEnv, setBlueprintEnv] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Side Drawer detail view state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Single unified table data state
  const [projects, setProjects] = useState<Project[]>(() => {
    const defaultProjects: Project[] = [
      { id: '1', name: 'Phoenix ERP Upgrade', status: 'In Progress', progress: 68, manager: 'Sarah Jenkins', budget: '$120,400', dueDate: 'Jul 24, 2026', blueprintClassType: 'Corporate IT', targetDeploymentTier: 'High' },
      { id: '2', name: 'RFID Inventory Automation', status: 'Completed', progress: 100, manager: 'Alex Rivera', budget: '$45,000', dueDate: 'Completed', blueprintClassType: 'Supply Chain', targetDeploymentTier: 'High' },
      { id: '3', name: 'Warehouse Automation Module', status: 'In Progress', progress: 42, manager: 'Douglas Vance', budget: '$98,150', dueDate: 'Sep 12, 2026', blueprintClassType: 'Logistics', targetDeploymentTier: 'Medium' },
      { id: '4', name: 'Fleet Dispatch Integration', status: 'On Hold', progress: 15, manager: 'Erika Patel', budget: '$180,000', dueDate: 'Nov 05, 2026', blueprintClassType: 'Logistics', targetDeploymentTier: 'Low' },
      { id: '5', name: 'Customs Regulatory Compliance Audit', status: 'In Progress', progress: 85, manager: 'Marcus Vance', budget: '$24,500', dueDate: 'Jun 19, 2026', blueprintClassType: 'Compliance', targetDeploymentTier: 'High' },
    ];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_blueprints');
      if (saved) {
        try {
          const parsed: Blueprint[] = JSON.parse(saved);
          const bpProjects: Project[] = parsed.map(bp => {
            const classType = bp.blueprintClassType || (bp as any).type || 'Legacy Blueprint';
            const tier = bp.targetDeploymentTier || (bp as any).environment || 'Medium';
            return {
              id: bp.id,
              name: bp.name,
              blueprintClassType: classType,
              targetDeploymentTier: tier,
              status: tier === 'High' ? 'In Progress' : 'Completed',
              progress: tier === 'High' ? 35 : 100,
              manager: 'Yhoan Quispe',
              budget: tier === 'High' ? '$185,000' : '$35,005',
              dueDate: bp.createdAt,
              isBlueprint: true
            };
          });
          return [...bpProjects, ...defaultProjects];
        } catch (e) {
          console.error('Error initializing blueprints in ProjectsView state:', e);
        }
      }
    }
    return defaultProjects;
  });

  // Keep Projects list in sync with parent blueprints state
  React.useEffect(() => {
    setProjects(prev => {
      const mockOnly = prev.filter(p => !p.isBlueprint);
      const bpProjects: Project[] = blueprints.map(bp => {
        const classType = bp.blueprintClassType || 'Legacy Blueprint';
        const tier = bp.targetDeploymentTier || 'Medium';
        return {
          id: bp.id,
          name: bp.name,
          blueprintClassType: classType,
          targetDeploymentTier: tier,
          status: tier === 'High' ? 'In Progress' : 'Completed',
          progress: tier === 'High' ? 35 : 100,
          manager: 'Yhoan Quispe',
          budget: tier === 'High' ? '$185,000' : '$35,005',
          dueDate: bp.createdAt,
          isBlueprint: true
        };
      });
      return [...bpProjects, ...mockOnly];
    });
  }, [blueprints]);

  const handleCreateBlueprintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blueprintName.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    // Call persistent parent context state updater
    onCreateBlueprint({
      name: blueprintName,
      blueprintClassType: blueprintType,
      targetDeploymentTier: blueprintEnv
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Clean closing transitions
      setTimeout(() => {
        setIsBlueprintModalOpen(false);
        setSubmitSuccess(false);
        setBlueprintName('');
        setBlueprintType('Logistics');
        setBlueprintEnv('Medium');
      }, 1200);
    }, 1000);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    onDeleteBlueprint(id);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' ? true : project.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Projects Registry
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Enterprise work scheduling and active budget control allocations.
          </p>
        </div>
        <div>
          <button 
            type="button"
            onClick={() => setIsBlueprintModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={15} />
            Create Project
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects or managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          {['All', 'In Progress', 'Completed', 'On Hold'].map((status) => (
            <button
               key={status}
               type="button"
               onClick={() => setStatusFilter(status)}
               className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                 statusFilter === status
                   ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50'
                   : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-805'
               }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Operational Manager</th>
                <th className="px-6 py-4">Budget Alloc</th>
                <th className="px-6 py-4">Completion Progress</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 text-sm">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-all">
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                      <div className="flex items-center gap-2.5">
                        <FolderGit2 size={16} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                        <div>
                          <div className="truncate max-w-xs sm:max-w-md" title={project.name}>{project.name}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className="inline-flex items-center rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-650 dark:text-zinc-400">
                              {project.blueprintClassType || "Standard Build"}
                            </span>
                            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              project.targetDeploymentTier === 'High'
                                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-450'
                                : project.targetDeploymentTier === 'Medium'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-405'
                                : 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400'
                            }`}>
                              {project.targetDeploymentTier || "Medium"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        project.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : project.status === 'In Progress'
                          ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300 font-sans">{project.manager}</td>
                    <td className="px-6 py-4 font-mono font-medium text-xs text-zinc-900 dark:text-zinc-200">{project.budget}</td>
                    <td className="px-6 py-4 w-60">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.progress === 100 
                                ? 'bg-emerald-500' 
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">{project.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer animate-pulse-subtle"
                          title="View Audit Details"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          type="button" 
                          className="p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-450 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                    No active projects match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Blueprint Creation Modal Overlay */}
      {isBlueprintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <div 
            onClick={() => { if (!isSubmitting) setIsBlueprintModalOpen(false); }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
          />
          
          {/* Modal Container Card */}
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl z-10 transform scale-100 opacity-100 transition-all duration-300 animate-fade-in">
            {/* Header / Dismiss */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-zinc-900 dark:text-zinc-50" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  Create New Project
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsBlueprintModalOpen(false)}
                disabled={isSubmitting}
                className="p-1 rounded bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateBlueprintSubmit} className="mt-4 space-y-4 text-xs">
              {submitSuccess ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">Project Initiated!</h4>
                    <p className="text-zinc-400 dark:text-zinc-500 mt-1 font-sans">
                      New project entry instantiated successfully. Ledger sync complete.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono uppercase tracking-wider text-[9px] block">
                      Project Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fleet Telematics Deployment"
                      value={blueprintName}
                      onChange={(e) => setBlueprintName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 focus:outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono uppercase tracking-wider text-[9px] block">
                      Project Category
                    </label>
                    <select
                      value={blueprintType}
                      onChange={(e) => setBlueprintType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="Logistics">Logistics</option>
                      <option value="Corporate IT">Corporate IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Supply Chain">Supply Chain</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 dark:text-zinc-500 font-bold font-mono uppercase tracking-wider text-[9px] block">
                      Project Priority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Low', 'Medium', 'High'] as const).map((env) => (
                        <button
                          key={env}
                          type="button"
                          onClick={() => setBlueprintEnv(env)}
                          className={`py-1.5 rounded-lg border transition-all cursor-pointer font-bold text-center text-xs ${
                            blueprintEnv === env
                              ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 shadow-xs'
                              : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-805 border-zinc-100 dark:border-zinc-805 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {env}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-850">
                    <button
                      type="button"
                      onClick={() => setIsBlueprintModalOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1 py-1.5 text-center font-semibold rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 border border-zinc-200/50 dark:border-zinc-800/80 cursor-pointer transition-colors disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !blueprintName.trim()}
                      className="flex-1 py-1.5 flex items-center justify-center gap-1.5 font-bold rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Project'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Side Detail Drawer */}
      <AnimatePresence>
        {isDetailDrawerOpen && selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md md:max-w-xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-850 shadow-2xl z-50 flex flex-col font-sans overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <FolderGit2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-400 dark:text-zinc-500 uppercase animate-pulse">Project Record Detail</span>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[240px] md:max-w-md" title={selectedProject.name}>
                      {selectedProject.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all cursor-pointer shadow-xs"
                  title="Close Drawer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Project Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Operational State</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      selectedProject.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : selectedProject.status === 'In Progress'
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    }`}>
                      {selectedProject.status}
                    </span>
                  </div>

                  {/* Operational Manager */}
                  <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Operational Manager</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{selectedProject.manager}</span>
                  </div>

                  {/* Budget Allocation */}
                  <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Budget Allocation</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-mono">{selectedProject.budget}</span>
                  </div>

                  {/* Completion Progress */}
                  <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-905 bg-zinc-50/20 dark:bg-zinc-900/10">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-505 uppercase tracking-wider block mb-1">Completion Progress</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">{selectedProject.progress}%</span>
                      <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            selectedProject.progress === 100 
                              ? 'bg-emerald-500' 
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Block */}
                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-450 space-y-2 bg-zinc-50/10 dark:bg-zinc-900/20">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Project Department:</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedProject.blueprintClassType || "Standard Build"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Project Priority:</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedProject.targetDeploymentTier || "Medium"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Target / End Date:</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedProject.dueDate}</span>
                  </div>
                </div>

                {/* Detailed Audit Progress Log Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                    <span className="text-xs font-bold tracking-wider text-zinc-800 dark:text-zinc-200 uppercase">Detailed Audit Progress Log</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500">Live Stream</span>
                  </div>

                  <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-6 pt-2">
                    {getAuditLogsForProject(selectedProject).map((log) => (
                      <div key={log.id} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border border-white dark:border-zinc-950 bg-indigo-500 ring-4 ring-indigo-500/15 animate-pulse" />
                        
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                              {log.action}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                              {log.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                            {log.details}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="inline-flex rounded bg-zinc-105 dark:bg-zinc-900 px-1.5 py-px text-[9px] font-mono text-zinc-500">
                              {log.tag}
                            </span>
                            <span className="text-[9px] text-zinc-450">
                              Logged by <strong className="font-semibold text-zinc-600 dark:text-zinc-400">{log.operator}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer / Confirmation */}
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="w-full py-2.5 text-center font-bold rounded-lg text-zinc-850 dark:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent shadow-xs"
                >
                  Close Detail Audit
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Detailed Audit Logs generator helper for selected items
function getAuditLogsForProject(project: Project) {
  const baseLogs = [
    {
      id: 'log-1',
      timestamp: '2026-06-05 09:00:15',
      tag: 'Initialization',
      action: 'Project Charter Approved',
      details: 'Registered under compliance classification with defined project scope.',
      operator: 'System Administrator'
    },
    {
      id: 'log-2',
      timestamp: '2026-06-05 14:30:15',
      tag: 'Finances',
      action: 'Budget Allocations Finalized',
      details: `Project financial ledger assigned to ${project.budget} threshold. Authorized for active audits.`,
      operator: 'ERP Audit Core'
    },
    {
      id: 'log-3',
      timestamp: '2026-06-06 10:15:22',
      tag: 'Personnel',
      action: 'Operational Manager Assigned',
      details: `Full project governance delegated to ${project.manager || 'Marcus Vance'} with master sign-off authority.`,
      operator: 'HR Integration Sync'
    },
    {
      id: 'log-4',
      timestamp: '2026-06-06 13:45:10',
      tag: 'Progress Update',
      action: `Completion Level Recorded at ${project.progress}%`,
      details: `Milestone checkpoint audit successfully calculated. Project milestone status: Completed.`,
      operator: project.manager || 'Marcus Vance'
    }
  ];

  if (project.id === '1') {
    return [
      ...baseLogs,
      {
        id: 'log-opt-1',
        timestamp: '2026-06-06 15:20:01',
        tag: 'Security & Access',
        action: 'Compliance & Safety Audit Cleared',
        details: 'All operational risk parameters verified and approved by corporate audit.',
        operator: 'Sarah Jenkins'
      }
    ];
  } else if (project.id === '2') {
    return [
      ...baseLogs,
      {
        id: 'log-opt-2',
        timestamp: '2026-06-06 16:05:00',
        tag: 'Hardware',
        action: 'RFID Scanning Matrix Certified',
        details: 'Successfully deployed tracking endpoints at secondary loading bays.',
        operator: 'Alex Rivera'
      }
    ];
  } else if (project.id === '3') {
    return [
      ...baseLogs,
      {
        id: 'log-opt-3',
        timestamp: '2026-06-06 16:15:30',
        tag: 'Automation',
        action: 'Bento Grid Floor Integration',
        details: 'Calibration tests complete with 0.05% error Margin mapped to warehouse layout.',
        operator: 'Douglas Vance'
      }
    ];
  }

  return baseLogs;
}
