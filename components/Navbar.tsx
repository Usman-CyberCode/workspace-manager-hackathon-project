'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setSearchQuery, setFilterPriority, setSortBy,
  setActiveModal, clearNotifications, markAsRead, markAllAsRead, 
  toggleTheme, bulkUpdateStatus, bulkDeleteTasks, 
  clearSelectedTasks, addToast, NotificationItem, logout,
  setCommandPaletteOpen
} from '@/store';
import UserProfileModal from '@/components/UserProfileModal';
import { Workspace, Project, MockUser } from '@/lib/mockdata';
import { 
  Menu, 
  Kanban, 
  Table, 
  Calendar, 
  ListTodo, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown,
  Plus, 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronDown, 
  User, 
  Trash2,
  Settings
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const { activeView, searchQuery, filterPriority, sortBy = 'dueDate', selectedTaskIds = [] } = state.tasks;
  const { currentUser } = state.auth;
  const { workspaces = [], activeWorkspaceId, projects = [], activeProjectId } = state.workspace;
  const { items: notifications = [] } = state.notifications;
  const { theme } = state.ui;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileViewMenuOpen, setIsMobileViewMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
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
      if (mobileViewMenuRef.current && !mobileViewMenuRef.current.contains(target)) {
        setIsMobileViewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const viewLabels: Record<string, { label: string; icon: any }> = {
    kanban: { label: 'Kanban', icon: Kanban },
    table: { label: 'Table', icon: Table },
    calendar: { label: 'Calendar', icon: Calendar },
    list: { label: 'List', icon: ListTodo },
  };

  const CurrentViewIcon = viewLabels[activeView]?.icon || Kanban;

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 font-sans shadow-2xs transition-all select-none">
        
        {/* ======================================================== */}
        {/* ROW 1: TOP GLOBAL BAR (Breadcrumb, Search, Utilities)    */}
        {/* ======================================================== */}
        <div className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle & Workspace / Project Breadcrumbs */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
              title="Toggle sidebar menu"
              aria-label="Toggle sidebar menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold min-w-0 truncate">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[130px] sm:max-w-[200px]">
                <span className="text-base shrink-0">{activeWorkspace?.icon || '⚡'}</span>
                <span className="truncate">{activeWorkspace?.name || 'Dev on Core'}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600 shrink-0 font-normal">/</span>
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/70 dark:border-slate-800/80">
                {activeProject?.name || 'Sprint Launch'}
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar (Isolated & Prominent) */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md mx-2 hidden sm:block">
            <input 
              type="text" 
              placeholder="Search tasks or ⌘K..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-8 pr-12 py-1.5 bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all placeholder:text-slate-400 shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <button 
              onClick={() => dispatch(setCommandPaletteOpen(true))}
              className="absolute right-2 top-1.5 text-[9px] font-bold text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded hover:text-slate-700 dark:hover:text-white cursor-pointer"
              title="Open Command Palette (⌘K)"
            >
              ⌘K
            </button>
          </div>

          {/* Right: Notifications, Theme, Profile, Standalone Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Mobile-only Search Button */}
            <button
              onClick={() => dispatch(setCommandPaletteOpen(true))}
              className="sm:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Search tasks (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-1.5 sm:p-2 rounded-xl border text-slate-700 dark:text-slate-300 relative transition-all cursor-pointer ${
                  isNotifOpen 
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' 
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
                title="Notifications"
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
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* User Profile Menu */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer group shrink-0"
                  title="User Profile & Settings"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full bg-slate-200 object-cover border border-slate-300 dark:border-slate-600" 
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:inline group-hover:text-blue-600 truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:inline" />
                </button>

                {/* Profile Flyout Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn text-xs">
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

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Profile Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          dispatch(setActiveModal('workspaceSettings'));
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Workspace Settings</span>
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        dispatch(logout());
                        dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Sign Out Icon Button for Large Displays (xl+) */}
            <button
              onClick={() => {
                dispatch(logout());
                dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
              }}
              className="hidden xl:flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
              title="Quick Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 2: VIEWS BAR & ACTIONS TOOLBAR (Separated from Search) */}
        {/* ======================================================== */}
        <div className="px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 w-full max-w-full">
          
          {/* LEFT: Kanban, Table, Calendar, List View Switcher (Completely Separate!) */}
          <div className="flex items-center gap-1.5 min-w-0">
            
            {/* Desktop Segmented View Control (sm+) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs shrink-0">
              <button
                onClick={() => dispatch(setActiveView('kanban'))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'kanban' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Kanban Board View (Key 1)"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('table'))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'table' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Table Grid View (Key 2)"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('calendar'))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'calendar' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Calendar Timeline View (Key 3)"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => dispatch(setActiveView('list'))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'list' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white'
                }`}
                title="List View (Key 4)"
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

            {/* Mobile View Selector Dropdown (<sm) */}
            <div className="relative sm:hidden shrink-0" ref={mobileViewMenuRef}>
              <button
                onClick={() => setIsMobileViewMenuOpen(!isMobileViewMenuOpen)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Switch Workspace View"
              >
                <CurrentViewIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs">{viewLabels[activeView]?.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isMobileViewMenuOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-fadeIn text-xs">
                  {(['kanban', 'table', 'calendar', 'list'] as const).map((viewKey) => {
                    const ViewIcon = viewLabels[viewKey].icon;
                    return (
                      <button
                        key={viewKey}
                        onClick={() => {
                          dispatch(setActiveView(viewKey));
                          setIsMobileViewMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
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

          {/* RIGHT: Sort Function + Priority Filter + + New Task (Side-by-side!) */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Sort Dropdown (Placed next to New Task) */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e: any) => dispatch(setSortBy(e.target.value))}
                className="pl-7 pr-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                title="Sort tasks"
              >
                <option value="dueDate">Sort: Due Date</option>
                <option value="priority">Sort: Priority</option>
                <option value="createdAt">Sort: Created Date</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative hidden md:flex items-center">
              <select
                value={filterPriority}
                onChange={(e) => dispatch(setFilterPriority(e.target.value))}
                className="pl-7 pr-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                title="Filter tasks by priority"
              >
                <option value="all">Priority: All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>

            {/* Primary Action: + New Task Button (Right next to Sort!) */}
            <button
              disabled={isViewer}
              onClick={() => {
                if (isViewer) {
                  dispatch(addToast({ message: 'Access Denied: Viewers cannot create tasks.', type: 'error' }));
                  return;
                }
                dispatch(setActiveModal('newTask'));
              }}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isViewer 
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
              }`}
              title="Create new task (Key C)"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

          </div>

        </div>

        {/* Bulk Multi-Select Action Bar (Shows when 1 or more tasks selected) */}
        {selectedTaskIds.length > 0 && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mb-2 bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-between gap-3 text-xs animate-scaleUp shadow-lg border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <span className="font-extrabold text-blue-400 shrink-0">{selectedTaskIds.length} selected</span>
              <button 
                onClick={() => dispatch(clearSelectedTasks())}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer truncate"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                onChange={(e: any) => {
                  if (e.target.value) dispatch(bulkUpdateStatus(e.target.value));
                }}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Move Status...</option>
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
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
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