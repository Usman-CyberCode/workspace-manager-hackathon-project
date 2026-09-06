'use client';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setSearchQuery, setFilterPriority, 
  setFilterStatus, setFilterAssignee, setSortBy, setGroupBy, 
  setActiveModal, clearNotifications, markAsRead, markAllAsRead, 
  toggleOffline, toggleTheme, bulkUpdateStatus, bulkDeleteTasks, 
  clearSelectedTasks, importTasks, addToast, undo, redo, NotificationItem, logout 
} from '@/store';
import UserProfileModal from '@/components/UserProfileModal';
import { Workspace, Project, TaskItem, MockUser } from '@/lib/mockdata';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const { activeView, searchQuery, filterPriority, filterStatus, sortBy, groupBy, selectedTaskIds = [], pastHistory, futureHistory } = state.tasks;
  const { currentUser, users = [] } = state.auth;
  const { workspaces = [], activeWorkspaceId, projects = [], activeProjectId } = state.workspace;
  const { items: notifications = [] } = state.notifications;
  const { isOffline, theme } = state.ui;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeWorkspace = workspaces.find((w: Workspace) => w.id === activeWorkspaceId);
  const activeProject = projects.find((p: Project) => p.id === activeProjectId);
  const unreadCount = notifications.filter((n: NotificationItem) => !n.read).length;

  const isViewer = currentUser?.role === 'viewer';

  // Handle PDF Export
  const handleExportPDF = () => {
    setIsExportMenuOpen(false);
    window.print();
  };

  // Handle JSON Backup Export
  const handleExportJSON = () => {
    setIsExportMenuOpen(false);
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
    dispatch(addToast({ message: 'Synchronizing local changes with cloud replica...', type: 'info' }));
    setTimeout(() => {
      dispatch(addToast({ message: 'All workspace changes synced & validated.', type: 'success' }));
    }, 900);
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200/90 dark:border-slate-800 px-3 sm:px-5 py-2 font-sans shadow-2xs transition-colors">
        
        {/* Single Row: Everything Aligned in One Line */}
        <div className="flex items-center justify-between gap-3 w-full">
          
          {/* Left Group: Mobile Toggle, Breadcrumbs, and Notion Views */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              ☰
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold truncate max-w-[200px] xl:max-w-[260px]">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 truncate">
                <span>{activeWorkspace?.icon || '⚡'}</span>
                <span className="truncate">{activeWorkspace?.name || 'Dev on Core'}</span>
              </span>
              <span>/</span>
              <span className="font-bold text-slate-900 dark:text-white truncate">
                {activeProject?.name || 'Sprint Launch'}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

            {/* Notion View Switcher Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => dispatch(setActiveView('kanban'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'kanban' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <span>📋</span>
                <span>Kanban</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('table'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'table' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <span>📑</span>
                <span>Table</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('calendar'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'calendar' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <span>📅</span>
                <span>Calendar</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('list'))}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'list' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <span>📄</span>
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Right Group: Search, Filter, PDF, New Task, Undo/Redo, Notifications, Theme, Profile, Sign Out */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Search Input with ⌘K */}
            <div className="relative hidden xl:block">
              <input 
                type="text" 
                placeholder="Search (⌘K)"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-36 2xl:w-48 pl-7 pr-3 py-1.5 bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
              <span className="absolute left-2 top-2 text-xs text-slate-400">🔍</span>
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => dispatch(setFilterPriority(e.target.value))}
              className="hidden lg:block px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">Priority: All</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🟢 Medium</option>
              <option value="low">⚪ Low</option>
            </select>

            {/* Dedicated Standalone Export PDF Button */}
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Export 3-column Kanban workspace report as clean PDF"
            >
              <span>📄</span>
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Primary Gradient + New Task Button */}
            <button
              disabled={isViewer}
              onClick={() => {
                if (isViewer) {
                  dispatch(addToast({ message: 'Access Denied: Viewers cannot create tasks.', type: 'error' }));
                  return;
                }
                dispatch(setActiveModal('newTask'));
              }}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                isViewer 
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <span>+</span>
              <span>New Task</span>
            </button>

            {/* Export & Backup Dropdown Menu */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Export & Backup options"
              >
                <span>💾</span>
                <span className="hidden md:inline">Backup</span>
                <span>▾</span>
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                    Document & Data Export
                  </div>
                  
                  {/* PDF Export Action */}
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>📄</span>
                    <div>
                      <span className="block">Export PDF Report</span>
                      <span className="text-[10px] text-slate-400 font-normal">Clean 3-column printable layout</span>
                    </div>
                  </button>

                  {/* JSON Backup Action */}
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>💾</span>
                    <div>
                      <span className="block">Backup JSON</span>
                      <span className="text-[10px] text-slate-400 font-normal">Download full workspace state</span>
                    </div>
                  </button>

                  {/* JSON Import Action */}
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1"
                  >
                    <span>📂</span>
                    <div>
                      <span className="block">Restore JSON Backup</span>
                      <span className="text-[10px] text-slate-400 font-normal">Upload valid workspace JSON</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Offline Status & Sync Button */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => dispatch(toggleOffline())}
                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer border ${
                  isOffline 
                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
                title="Toggle client-side offline mode"
              >
                {isOffline ? '⚡ Offline' : '🟢 Online'}
              </button>
              
              <button
                onClick={handleManualSync}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                title="Manual Sync state reconciliation"
              >
                🔄
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="hidden 2xl:flex items-center gap-1">
              <button
                onClick={() => dispatch(undo())}
                disabled={pastHistory.length === 0}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                  pastHistory.length > 0 
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer' 
                    : 'border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                }`}
                title="Undo task action (Ctrl+Z)"
              >
                ↩️
              </button>
              <button
                onClick={() => dispatch(redo())}
                disabled={futureHistory.length === 0}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                  futureHistory.length > 0 
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer' 
                    : 'border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                }`}
                title="Redo task action (Ctrl+Y)"
              >
                ↪️
              </button>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 relative transition-all cursor-pointer"
                title="Notifications"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fadeIn text-xs">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-extrabold text-slate-900 dark:text-white">Notifications ({unreadCount})</h4>
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
                            n.read ? 'bg-slate-50/70 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-500' : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900 text-slate-800 dark:text-slate-200'
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

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Profile Trigger */}
            {currentUser && (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer group"
                title="User Profile & Settings"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full bg-slate-200 object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 pr-1 hidden sm:inline group-hover:text-blue-600">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            )}

            {/* Prominent Sign Out Button */}
            <button
              onClick={() => {
                dispatch(logout());
                dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-xs font-extrabold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95"
              title="Sign out and return to landing page"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out</span>
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
          <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center justify-between gap-3 text-xs animate-scaleUp">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">{selectedTaskIds.length} tasks selected</span>
              <button 
                onClick={() => dispatch(clearSelectedTasks())}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                onChange={(e: any) => {
                  if (e.target.value) dispatch(bulkUpdateStatus(e.target.value));
                }}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Move Status...</option>
                <option value="todo">🟡 To Do</option>
                <option value="in-progress">🟢 In Progress</option>
                <option value="done">🔴 Completed</option>
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
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all cursor-pointer"
              >
                Delete Selected 🗑️
              </button>
            </div>
          </div>
        )}

      </header>

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}