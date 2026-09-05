'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setSearchQuery, setFilterPriority, setFilterStatus,
  addTask, importStateData, toggleTheme 
} from '@/store';

export default function Navbar() {
  const { activeView, searchQuery, filterPriority, filterStatus, theme } = useSelector((state: RootState) => state.tasks);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCreateTask = () => {
    const title = prompt("Task Title:");
    if (title) {
      dispatch(addTask({
        id: Date.now().toString(),
        projectId: activeProjectId,
        title,
        description: 'New task created',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-09-15',
        subtasks: []
      }));
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `workspace_data.json`);
    anchor.click();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      {/* Search & Multi-Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input 
          type="text" 
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        {/* Priority Filter */}
        <select 
          value={filterPriority} 
          onChange={(e) => dispatch(setFilterPriority(e.target.value))}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold dark:text-white outline-none cursor-pointer"
        >
          <option value="all">Priority: All</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟡 High</option>
          <option value="medium">🟢 Medium</option>
        </select>

        {/* Status Filter */}
        <select 
          value={filterStatus} 
          onChange={(e) => dispatch(setFilterStatus(e.target.value))}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold dark:text-white outline-none cursor-pointer"
        >
          <option value="all">Status: All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Completed</option>
        </select>

        {/* Online/Offline Status */}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </span>
      </div>

      {/* View Switcher & Theme */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex text-xs">
          <button 
            onClick={() => dispatch(setActiveView('kanban'))}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeView === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-md' : 'text-slate-400'}`}
          >
            Kanban
          </button>
          <button 
            onClick={() => dispatch(setActiveView('list'))}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeView === 'list' ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-md' : 'text-slate-400'}`}
          >
            Table
          </button>
          <button 
            onClick={() => dispatch(setActiveView('calendar'))}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeView === 'calendar' ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-md' : 'text-slate-400'}`}
          >
            Calendar
          </button>
        </div>

        <button onClick={() => dispatch(toggleTheme())} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold transition-all">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <button onClick={handleCreateTask} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          + Task
        </button>

        <button onClick={exportJSON} className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          Export
        </button>
      </div>
    </header>
  );
}