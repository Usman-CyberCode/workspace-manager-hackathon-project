'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setSearchQuery, setFilterPriority, 
  setActiveModal, clearNotifications, markAsRead, markAllAsRead, 
  toggleOffline, toggleTheme, bulkUpdateStatus, bulkDeleteTasks, 
  clearSelectedTasks, importTasks, addToast, undo, redo, NotificationItem, logout,
  setCommandPaletteOpen
} from '@/store';
import UserProfileModal from '@/components/UserProfileModal';
import { Workspace, Project, TaskItem, MockUser } from '@/lib/mockdata';
import { 
  Menu, 
  Kanban, 
  Table, 
  Calendar, 
  ListTodo, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Download, 
  Upload, 
  Undo2, 
  Redo2, 
  Bell, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  MoreHorizontal, 
  LogOut, 
  FileText, 
  Keyboard, 
  Activity, 
  ChevronDown, 
  User, 
  Check, 
  Trash2,
  X,
  Settings
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const { activeView, searchQuery, filterPriority, selectedTaskIds = [], pastHistory, futureHistory } = state.tasks;
  const { currentUser } = state.auth;
  const { workspaces = [], activeWorkspaceId, projects = [], activeProjectId } = state.workspace;
  const { items: notifications = [] } = state.notifications;
  const { isOffline, theme } = state.ui;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMobileViewMenuOpen, setIsMobileViewMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const mobileViewMenuRef = useRef<HTMLDivElement>(null);

  const activeWorkspace = workspaces.find((w: Workspace) => w.id === activeWorkspaceId);
  const activeProject = projects.find((p: Project) => p.id === activeProjectId);
  const unreadCount = notifications.filter((n: NotificationItem) => !n.read).length;

  const isViewer = currentUser?.role === 'viewer';

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(target)) {
        setIsToolsMenuOpen(false);
      }
      if (mobileViewMenuRef.current && !mobileViewMenuRef.current.contains(target)) {
        setIsMobileViewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle PDF Export
  const handleExportPDF = () => {
    setIsToolsMenuOpen(false);
    dispatch(addToast({ message: 'Generating clean PDF workspace layout...', type: 'info' }));
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Handle JSON Backup Export
  const handleExportJSON = () => {
    setIsToolsMenuOpen(false);
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        workspace: state.workspace,
        tasks: state.tasks.items,
        users: state.auth.users
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", `devon_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      dispatch(addToast({ message: 'JSON backup downloaded successfully!', type: 'success' }));
    } catch (e) {
      dispatch(addToast({ message: 'Failed to export JSON backup.', type: 'error' }));
    }
  };

  // Handle JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported.tasks)) {
          dispatch(importTasks(imported.tasks));
          dispatch(addToast({ message: `Successfully restored ${imported.tasks.length} tasks!`, type: 'success' }));
        } else if (Array.isArray(imported)) {
          dispatch(importTasks(imported));
          dispatch(addToast({ message: `Restored ${imported.length} tasks!`, type: 'success' }));
        } else {
          throw new Error('Invalid schema');
        }
      } catch (err) {
        dispatch(addToast({ message: 'Invalid JSON backup file format.', type: 'error' }));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Manual Offline Sync Simulation
  const handleManualSync = () => {
    setIsSyncing(true);
    dispatch(addToast({ message: 'Synchronizing local changes with cloud replica...', type: 'info' }));
    setTimeout(() => {
      setIsSyncing(false);
      dispatch(addToast({ message: 'All workspace changes synced & validated.', type: 'success' }));
    }, 800);
  };

  const viewLabels: Record<string, { label: string; icon: any }> = {
    kanban: { label: 'Kanban', icon: Kanban },
    table: { label: 'Table', icon: Table },
    calendar: { label: 'Calendar', icon: Calendar },
    list: { label: 'List', icon: ListTodo },
  };

  const CurrentViewIcon = viewLabels[activeView]?.icon || Kanban;

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-2 sm:px-4 lg:px-6 py-2 font-sans shadow-2xs transition-colors select-none">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full max-w-full">
          
          {/* ==================================================== */}
          {/* LEFT SECTION: Hamburger, Breadcrumbs, and View Tabs  */}
          {/* ==================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
            
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
              title="Toggle sidebar menu"
              aria-label="Toggle sidebar menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb: Workspace & Active Project */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold min-w-0 shrink truncate">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[110px] sm:max-w-[160px]">
                <span className="text-sm shrink-0">{activeWorkspace?.icon || '⚡'}</span>
                <span className="truncate">{activeWorkspace?.name || 'Dev on Core'}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>
              <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-200/70 dark:border-slate-800/80">
                {activeProject?.name || 'Sprint Launch'}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block shrink-0 mx-0.5" />

            {/* View Switcher: Desktop Segmented Control (sm+) */}
            <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs shrink-0">
              <button
                onClick={() => dispatch(setActiveView('kanban'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'kanban' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Kanban Board View (Key 1)"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Kanban</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('table'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'table' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Table Grid View (Key 2)"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Table</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('calendar'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'calendar' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Calendar Timeline View (Key 3)"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Calendar</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('list'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'list' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="List View (Key 4)"
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span className="hidden md:inline">List</span>
              </button>
            </div>

            {/* View Switcher: Mobile Dropdown Button (<sm) */}
            <div className="relative sm:hidden shrink-0" ref={mobileViewMenuRef}>
              <button
                onClick={() => setIsMobileViewMenuOpen(!isMobileViewMenuOpen)}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                title="Switch Workspace View"
              >
                <CurrentViewIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px]">{viewLabels[activeView]?.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isMobileViewMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xl z-50 animate-fadeIn text-xs">
                  {(['kanban', 'table', 'calendar', 'list'] as const).map((viewKey) => {
                    const ViewIcon = viewLabels[viewKey].icon;
                    return (
                      <button
                        key={viewKey}
                        onClick={() => {
                          dispatch(setActiveView(viewKey));
                          setIsMobileViewMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                          activeView === viewKey 
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <ViewIcon className="w-3.5 h-3.5" />
                        <span>{viewLabels[viewKey].label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* ==================================================== */}
          {/* RIGHT SECTION: Search, Filters, Tools, Actions, User */}
          {/* ==================================================== */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Desktop Search Input with Command Palette Hint */}
            <div className="relative hidden xl:block">
              <input 
                type="text" 
                placeholder="Search or ⌘K"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-36 2xl:w-44 pl-7 pr-7 py-1.2 bg-slate-100/90 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
              <button 
                onClick={() => dispatch(setCommandPaletteOpen(true))}
                className="absolute right-1.5 top-1.5 text-[9px] font-bold text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1 rounded hover:text-slate-700 dark:hover:text-white cursor-pointer"
                title="Open Command Palette (⌘K)"
              >
                ⌘K
              </button>
            </div>

            {/* Compact Search Trigger for <xl screens */}
            <button
              onClick={() => dispatch(setCommandPaletteOpen(true))}
              className="xl:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Search tasks & jump to commands (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Priority Filter (lg+ screens) */}
            <div className="relative hidden lg:flex items-center">
              <select
                value={filterPriority}
                onChange={(e) => dispatch(setFilterPriority(e.target.value))}
                className="pl-6 pr-2 py-1.2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                title="Filter tasks by priority"
              >
                <option value="all">Priority: All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <SlidersHorizontal className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
            </div>

            {/* Primary Action: + New Task Button */}
            <button
              disabled={isViewer}
              onClick={() => {
                if (isViewer) {
                  dispatch(addToast({ message: 'Access Denied: Viewers cannot create tasks.', type: 'error' }));
                  return;
                }
                dispatch(setActiveModal('newTask'));
              }}
              className={`px-2.5 sm:px-3 py-1.2 rounded-xl font-extrabold text-xs text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                isViewer 
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
              }`}
              title="Create new task (Key C)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">New Task</span>
            </button>

            {/* Undo / Redo (2xl+ screens) */}
            <div className="hidden 2xl:flex items-center gap-0.5">
              <button
                onClick={() => dispatch(undo())}
                disabled={pastHistory.length === 0}
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                  pastHistory.length > 0 
                    ? 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer' 
                    : 'border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
                }`}
                title="Undo task action (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => dispatch(redo())}
                disabled={futureHistory.length === 0}
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                  futureHistory.length > 0 
                    ? 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer' 
                    : 'border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
                }`}
                title="Redo task action (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Secondary Tools & More Actions Menu */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`p-1.5 sm:px-2 sm:py-1.2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isToolsMenuOpen 
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white' 
                    : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="More workspace tools & export options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-xs font-bold">Tools</span>
              </button>

              {/* Tools Flyout Dropdown */}
              {isToolsMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1 tracking-wider">
                    Workspace Actions & Export
                  </div>
                  
                  {/* Export PDF Report */}
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 font-bold transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">Export PDF Report</span>
                      <span className="text-[10px] text-slate-400 font-normal">Clean 3-column printable report</span>
                    </div>
                  </button>

                  {/* Backup JSON */}
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">Download JSON Backup</span>
                      <span className="text-[10px] text-slate-400 font-normal">Full local state backup file</span>
                    </div>
                  </button>

                  {/* Restore JSON */}
                  <button
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400 font-bold transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">Restore JSON Backup</span>
                      <span className="text-[10px] text-slate-400 font-normal">Upload backup JSON</span>
                    </div>
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  {/* Offline / Online Mode Toggle */}
                  <button
                    onClick={() => dispatch(toggleOffline())}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isOffline ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'}`}>
                        {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="block font-bold">Offline Simulation</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {isOffline ? 'Disconnected state' : 'Connected to cloud'}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isOffline ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {isOffline ? 'Offline' : 'Online'}
                    </span>
                  </button>

                  {/* Manual Cloud Sync */}
                  <button
                    onClick={handleManualSync}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                    </div>
                    <div>
                      <span className="block font-bold">Force State Sync</span>
                      <span className="text-[10px] text-slate-400 font-normal">Reconcile local & server state</span>
                    </div>
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  {/* Keyboard Shortcuts Trigger */}
                  <button
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      dispatch(setActiveModal('shortcuts'));
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Keyboard Shortcuts</span>
                  </button>

                  {/* Activity Log Trigger */}
                  <button
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      dispatch(setActiveModal('activityLog'));
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span>Activity Audit Log</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-1.5 rounded-xl border text-slate-700 dark:text-slate-300 relative transition-all cursor-pointer ${
                  isNotifOpen 
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' 
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full font-extrabold flex items-center justify-center animate-pulse shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-32px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fadeIn text-xs">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-blue-600" />
                      <span>Notifications ({unreadCount})</span>
                    </h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => dispatch(markAllAsRead())} 
                        className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                      <button 
                        onClick={() => dispatch(clearNotifications())} 
                        className="text-[10px] text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-6 text-xs">No notifications yet</p>
                    ) : (
                      notifications.map((n: NotificationItem) => (
                        <div 
                          key={n.id} 
                          onClick={() => dispatch(markAsRead(n.id))}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            n.read 
                              ? 'bg-slate-50/70 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-500' 
                              : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</span>
                            <span className="text-[9px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] mt-0.5 leading-snug">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* User Profile Menu */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-0.5 sm:p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer group shrink-0"
                  title="User Profile & Settings"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 object-cover border border-slate-300 dark:border-slate-600" 
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 pr-1 hidden lg:inline group-hover:text-blue-600 truncate max-w-[80px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:inline" />
                </button>

                {/* Profile Flyout Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn text-xs">
                    
                    {/* User Header Details */}
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 mb-2">
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-10 h-10 rounded-xl bg-slate-200 object-cover border border-slate-300 dark:border-slate-700" 
                      />
                      <div className="truncate">
                        <h4 className="font-black text-xs text-slate-900 dark:text-white truncate">{currentUser.name}</h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">{currentUser.email}</span>
                        <span className="inline-block mt-0.5 text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    {/* Modal Triggers */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Profile Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          dispatch(setActiveModal('workspaceSettings'));
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Workspace Settings</span>
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    {/* Sign Out Button */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        dispatch(logout());
                        dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>

                  </div>
                )}
              </div>
            )}

            {/* Standalone Quick Sign Out Icon Button for Large Displays (xl+) */}
            <button
              onClick={() => {
                dispatch(logout());
                dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
              }}
              className="hidden xl:flex p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
              title="Quick Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            {/* Hidden File Input for JSON restore */}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImportJSON} 
            />

          </div>
        </div>

        {/* Bulk Multi-Select Action Bar (Shows when 1 or more tasks selected) */}
        {selectedTaskIds.length > 0 && (
          <div className="mt-2 bg-slate-900 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center justify-between gap-2 text-xs animate-scaleUp shadow-lg border border-slate-800">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="font-extrabold text-blue-400 shrink-0">{selectedTaskIds.length} selected</span>
              <button 
                onClick={() => dispatch(clearSelectedTasks())}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer truncate"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <select
                onChange={(e: any) => {
                  if (e.target.value) dispatch(bulkUpdateStatus(e.target.value));
                }}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Status...</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>

              <button
                disabled={isViewer}
                onClick={() => {
                  if (isViewer) {
                    dispatch(addToast({ message: 'Access Denied: Viewers cannot bulk delete.', type: 'error' }));
                    return;
                  }
                  if (confirm(`Delete ${selectedTaskIds.length} selected tasks?`)) {
                    dispatch(bulkDeleteTasks());
                  }
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        )}

      </header>

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
}