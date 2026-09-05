'use client';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setSearchQuery, setFilterPriority, 
  setFilterStatus, setFilterAssignee, setSortBy, setGroupBy, 
  setActiveModal, clearNotifications, markAsRead, markAllAsRead, 
  toggleOffline, toggleTheme, bulkUpdateStatus, bulkDeleteTasks, 
  clearSelectedTasks, importTasks, addToast, undo, redo, NotificationItem 
} from '@/store';
import UserProfileModal from '@/components/UserProfileModal';
import { Workspace, Project, TaskItem, MockUser } from '@/lib/mockdata';

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
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 flex flex-col gap-2 font-sans shadow-2xs">
        
        {/* Top Row: Breadcrumbs, Search, Quick Tools, Profile */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Mobile Toggle & Notion Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              ☰
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold truncate">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <span>{activeWorkspace?.icon || '⚡'}</span>
                <span className="truncate">{activeWorkspace?.name || 'Dev on Core'}</span>
              </span>
              <span>/</span>
              <span className="font-bold text-slate-900 truncate">
                {activeProject?.name || 'Sprint Launch'}
              </span>
            </div>
          </div>

          {/* Center/Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input with ⌘K */}
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search tasks, tags... (⌘K)"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-48 lg:w-60 pl-8 pr-3 py-1.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
              <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
            </div>

            {/* Offline Status & Sync Button */}
            <div className="flex items-center gap-1">
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
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
                title="Manual Sync state reconciliation"
              >
                🔄
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="hidden lg:flex items-center gap-1">
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
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 relative transition-all cursor-pointer"
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn text-xs">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <h4 className="font-extrabold text-slate-900">Notifications ({unreadCount})</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => dispatch(markAllAsRead())} 
                        className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
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
                            n.read ? 'bg-slate-50/70 border-slate-100 text-slate-500' : 'bg-blue-50/50 border-blue-100 text-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-slate-900">{n.title}</span>
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

            {/* Profile Trigger */}
            {currentUser && (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all border border-slate-200 shadow-2xs cursor-pointer group"
                title="User Profile & Settings"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full bg-slate-200 object-cover border border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 pr-1.5 hidden sm:inline group-hover:text-blue-600">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            )}

          </div>
        </div>

        {/* Bottom Row: Notion Views Switcher, Filters, Export & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          
          {/* Left: Notion View Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => dispatch(setActiveView('kanban'))}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'kanban' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📋</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => dispatch(setActiveView('table'))}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'table' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📑</span>
              <span>Table</span>
            </button>
            <button
              onClick={() => dispatch(setActiveView('calendar'))}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'calendar' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📅</span>
              <span>Calendar</span>
            </button>
            <button
              onClick={() => dispatch(setActiveView('list'))}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'list' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📄</span>
              <span>List</span>
            </button>
          </div>

          {/* Right: Filters, Primary + New Task, and Export Dropdown */}
          <div className="flex items-center gap-2">
            
            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => dispatch(setFilterPriority(e.target.value))}
              className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Priority: All</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🟢 Medium</option>
              <option value="low">⚪ Low</option>
            </select>

            {/* Sort & Group Selectors */}
            <select
              value={sortBy}
              onChange={(e: any) => dispatch(setSortBy(e.target.value))}
              className="hidden lg:block px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="createdAt">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>

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
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                isViewer 
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <span>+</span>
              <span>New Task</span>
            </button>

            {/* Export & Backup Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Export / Backup</span>
                <span>▾</span>
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                    Document & Data Export
                  </div>
                  
                  {/* PDF Export Action */}
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left p-2 rounded-xl text-slate-800 hover:bg-rose-50 hover:text-rose-700 font-bold transition-colors cursor-pointer flex items-center gap-2"
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
                    className="w-full text-left p-2 rounded-xl text-slate-800 hover:bg-slate-100 font-bold transition-colors cursor-pointer flex items-center gap-2"
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
                    className="w-full text-left p-2 rounded-xl text-slate-800 hover:bg-slate-100 font-bold transition-colors cursor-pointer flex items-center gap-2 border-t border-slate-100 mt-1"
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