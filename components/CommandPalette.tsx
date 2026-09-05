'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setActiveModal, setCommandPaletteOpen, 
  setActiveProject, setSelectedTaskId 
} from '@/store';
import { Project, TaskItem } from '@/lib/mockdata';

export default function CommandPalette() {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.commandPaletteOpen);
  const projects = useSelector((state: RootState) => state.workspace.projects);
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);

  const [query, setQuery] = useState('');

  // Global Keydown Listeners for ⌘K and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette on Cmd+K or Ctrl+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!open));
      }
      // Esc to close
      if (e.key === 'Escape' && open) {
        dispatch(setCommandPaletteOpen(false));
      }
      // Quick shortcut 'c' for new task if not inside input
      if (e.key.toLowerCase() === 'c' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        dispatch(setActiveModal('newTask'));
      }
      // Quick views 1-4
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        if (e.key === '1') dispatch(setActiveView('kanban'));
        if (e.key === '2') dispatch(setActiveView('table'));
        if (e.key === '3') dispatch(setActiveView('calendar'));
        if (e.key === '4') dispatch(setActiveView('list'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, dispatch]);

  if (!open) return null;

  const filteredTasks = tasks.filter((t: TaskItem) => 
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredProjects = projects.filter((p: Project) => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (cb: () => void) => {
    cb();
    dispatch(setCommandPaletteOpen(false));
    setQuery('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-start justify-center pt-24 p-4 font-sans animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 shadow-2xl border border-slate-200 animate-scaleUp text-slate-800">
        
        {/* Search Bar */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <span className="text-slate-400 text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="Type a command, project, or task... (Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs font-bold text-slate-900 placeholder:text-slate-400"
            autoFocus
          />
        </div>

        <div className="mt-3 space-y-4 max-h-80 overflow-y-auto pr-1 text-xs">
          
          {/* Quick Actions */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Actions
            </span>
            <div className="space-y-1">
              <button 
                onClick={() => handleAction(() => dispatch(setActiveModal('newTask')))}
                className="w-full text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>➕ Create New Task</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">C</kbd>
              </button>

              <button 
                onClick={() => handleAction(() => window.print())}
                className="w-full text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📄 Export Clean PDF Report</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">Print</kbd>
              </button>

              <button 
                onClick={() => handleAction(() => dispatch(setActiveModal('newProject')))}
                className="w-full text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📁 New Project with Templates</span>
              </button>

              <button 
                onClick={() => handleAction(() => dispatch(setActiveModal('shortcuts')))}
                className="w-full text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>⌨️ View Keyboard Shortcuts</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">?</kbd>
              </button>
            </div>
          </div>

          {/* Switch Views */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Switch Views
            </span>
            <div className="grid grid-cols-2 gap-1">
              <button 
                onClick={() => handleAction(() => dispatch(setActiveView('kanban')))}
                className="text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>📋 Kanban Board</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">1</kbd>
              </button>
              <button 
                onClick={() => handleAction(() => dispatch(setActiveView('table')))}
                className="text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>📑 Table View</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">2</kbd>
              </button>
              <button 
                onClick={() => handleAction(() => dispatch(setActiveView('calendar')))}
                className="text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>📅 Calendar View</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">3</kbd>
              </button>
              <button 
                onClick={() => handleAction(() => dispatch(setActiveView('list')))}
                className="text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>📄 List View</span>
                <kbd className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">4</kbd>
              </button>
            </div>
          </div>

          {/* Projects Navigation */}
          {filteredProjects.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Jump to Project
              </span>
              <div className="space-y-1">
                {filteredProjects.map((p: Project) => (
                  <button
                    key={p.id}
                    onClick={() => handleAction(() => dispatch(setActiveProject(p.id)))}
                    className="w-full text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{p.icon || '📁'}</span>
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Tasks
              </span>
              <div className="space-y-1">
                {filteredTasks.map((t: TaskItem) => (
                  <button
                    key={t.id}
                    onClick={() => handleAction(() => dispatch(setSelectedTaskId(t.id)))}
                    className="w-full text-left p-2 hover:bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{t.title}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">{t.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}