'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveWorkspace, setActiveProject, switchUser, 
  setActiveModal, archiveProject, addToast, logout 
} from '@/store';
import { Workspace, Project, MockUser } from '@/lib/mockdata';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const dispatch = useDispatch();
  const { workspaces = [], activeWorkspaceId, projects = [], activeProjectId } = useSelector((state: RootState) => state.workspace);
  const { currentUser, users = [] } = useSelector((state: RootState) => state.auth);

  const [showWsDropdown, setShowWsDropdown] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

  const activeWorkspace = workspaces.find((w: Workspace) => w.id === activeWorkspaceId) || workspaces[0];
  const workspaceProjects = projects.filter((p: Project) => p.workspaceId === activeWorkspaceId);
  const visibleProjects = workspaceProjects.filter((p: Project) => showArchived ? true : !p.archived);

  return (
    <aside className={`
      w-64 bg-slate-950 text-slate-200 h-screen flex flex-col justify-between border-r border-slate-800/80 font-sans shrink-0 z-30
      fixed inset-y-0 left-0 md:static transition-transform duration-200 ease-in-out
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Top Header & Workspace Switcher */}
      <div className="p-3.5 overflow-y-auto flex-1 flex flex-col min-h-0">
        
        {/* Workspace Brand / Selector */}
        <div className="relative mb-4">
          <button 
            onClick={() => setShowWsDropdown(!showWsDropdown)}
            className="w-full flex items-center justify-between p-2 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs"
                style={{ backgroundColor: activeWorkspace?.color || '#3b82f6' }}
              >
                {activeWorkspace?.icon || '⚡'}
              </div>
              <div className="truncate">
                <h2 className="font-black text-xs text-white truncate group-hover:text-blue-400 transition-colors">
                  {activeWorkspace?.name || 'Dev on Core'}
                </h2>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Workspace ▾
                </span>
              </div>
            </div>
          </button>

          {/* Workspace Dropdown */}
          {showWsDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                Workspaces
              </div>
              <div className="space-y-1 my-1 max-h-40 overflow-y-auto">
                {workspaces.map((ws: Workspace) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      dispatch(setActiveWorkspace(ws.id));
                      setShowWsDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-bold transition-all cursor-pointer ${
                      ws.id === activeWorkspaceId ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{ws.icon}</span>
                      <span className="truncate">{ws.name}</span>
                    </span>
                    {ws.id === activeWorkspaceId && <span className="text-blue-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-1.5 mt-1 space-y-1">
                <button
                  onClick={() => {
                    dispatch(setActiveModal('newWorkspace'));
                    setShowWsDropdown(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-blue-400 hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>➕</span> Create Workspace
                </button>
                <button
                  onClick={() => {
                    dispatch(setActiveModal('workspaceSettings'));
                    setShowWsDropdown(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-slate-300 hover:bg-slate-800 font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>⚙️</span> Workspace Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-1 mb-5">
          <button 
            onClick={() => dispatch(setActiveModal(null))}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>📊</span> Board & Tasks
          </button>
          <button 
            onClick={() => dispatch(setActiveModal('activityLog'))}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <span>📜</span> Activity Log
          </button>
          <button 
            onClick={() => dispatch(setActiveModal('shortcuts'))}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <span>⌨️</span> Keyboard Shortcuts
          </button>
        </div>

        {/* Projects Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Projects ({workspaceProjects.length})
            </span>
            <button
              onClick={() => dispatch(setActiveModal('newProject'))}
              className="px-2 py-0.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
              title="Create new project with templates"
            >
              + New
            </button>
          </div>

          {/* Project List */}
          <div className="space-y-1 overflow-y-auto flex-1 pr-1">
            {visibleProjects.map((proj: Project) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-800 text-white shadow-xs border border-slate-700/60' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                  onClick={() => {
                    dispatch(setActiveProject(proj.id));
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{proj.icon || '📁'}</span>
                    <span className="truncate">{proj.name}</span>
                    {proj.archived && (
                      <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded uppercase font-mono">
                        Archived
                      </span>
                    )}
                  </div>
                  
                  {/* Quick Archive Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(archiveProject(proj.id));
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-amber-400 p-1 rounded transition-opacity cursor-pointer"
                    title={proj.archived ? "Unarchive Project" : "Archive Project"}
                  >
                    📦
                  </button>
                </div>
              );
            })}
          </div>

          {/* Archive Toggle Filter */}
          <div className="pt-2 border-t border-slate-900 mt-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-bold transition-colors block w-full text-left px-2 cursor-pointer"
            >
              {showArchived ? 'Hide Archived Projects' : 'Show Archived Projects'}
            </button>
          </div>
        </div>

      </div>

      {/* Locked Bottom Persona Role Dropdown with User Images */}
      <div className="p-3 bg-slate-900 border-t border-slate-800/80 relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>👤</span> Switch Persona
          </label>
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase font-mono ${
            currentUser?.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            currentUser?.role === 'admin' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
            currentUser?.role === 'member' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {currentUser?.role}
          </span>
        </div>

        {/* Current Active User Trigger Card */}
        <button
          type="button"
          onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 p-2.5 rounded-2xl flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={currentUser?.avatar} 
                alt={currentUser?.name} 
                className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="truncate">
              <div className="font-extrabold text-xs text-white truncate group-hover:text-blue-300 transition-colors">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser?.title || currentUser?.role}
              </div>
            </div>
          </div>
          <span className="text-slate-400 text-xs shrink-0 group-hover:text-white transition-colors">
            {showPersonaDropdown ? '▲' : '▼'}
          </span>
        </button>

        {/* Persona Dropdown Popover with Avatars */}
        {showPersonaDropdown && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-900 border border-slate-800 rounded-3xl p-2 shadow-2xl z-50 animate-scaleUp text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-800/80 mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                Select Active Persona
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Multi-User</span>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5">
              {users.map((u: MockUser) => {
                const isSelected = u.id === currentUser?.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      dispatch(switchUser(u.id));
                      dispatch(addToast({ message: `Switched persona to ${u.name} (${u.role.toUpperCase()})`, type: 'info' }));
                      setShowPersonaDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-800/90 border border-slate-700 text-white' 
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={u.avatar} 
                        alt={u.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-white truncate">{u.name}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase font-mono ${
                            u.role === 'owner' ? 'bg-amber-500/20 text-amber-300' :
                            u.role === 'admin' ? 'bg-blue-500/20 text-blue-300' :
                            u.role === 'member' ? 'bg-emerald-500/20 text-emerald-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {u.title}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-blue-400 font-black text-sm ml-2">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {currentUser?.role === 'viewer' && (
              <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-300 font-medium text-center">
                👁️ Viewer Mode: Restricted from task edits
              </div>
            )}

            {/* Persona Switcher Divider & Sign Out */}
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => {
                  dispatch(logout());
                  dispatch(addToast({ message: 'Signed out of workspace.', type: 'info' }));
                }}
                className="w-full text-left py-2 px-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 font-extrabold text-[11px] transition-colors cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Workspace</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions & Log Out Row */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => dispatch(setActiveModal('shortcuts'))}
            className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="View Keyboard Shortcuts (?)"
          >
            <span>⌨️</span>
            <span>Shortcuts</span>
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Log out and return to landing screen"
          >
            <LogOut className="w-3 h-3 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>

        {currentUser?.role === 'viewer' && !showPersonaDropdown && (
          <p className="text-[10px] text-amber-400/90 font-medium mt-1.5 text-center">
            ⚠️ Viewer mode: Edit/Delete disabled
          </p>
        )}
      </div>

    </aside>
  );
}