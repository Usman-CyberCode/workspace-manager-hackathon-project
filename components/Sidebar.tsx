'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setActiveProject, addProject, switchUser } from '@/store';

export default function Sidebar() {
  const { projects, activeProjectId } = useSelector((state: RootState) => state.workspace);
  const activeWorkspaceId = useSelector((state: RootState) => state.workspace.activeWorkspaceId);
  const { currentUser, users } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    dispatch(addProject({
      id: Date.now().toString(),
      workspaceId: activeWorkspaceId,
      name: projectName,
      color: 'bg-blue-500'
    }));
    setProjectName('');
    setIsProjectModalOpen(false);
  };

  return (
    <>
      <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col justify-between border-r border-slate-800 font-sans shadow-xl">
        <div>
          {/* Logo Branding */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-slate-800/80 rounded-2xl border border-slate-700/60 shadow-md">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-xl font-black text-sm flex items-center justify-center shadow-md">
              D
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight">Dev on</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase">Workspace</p>
            </div>
          </div>

          {/* Projects Navigation with CSS Folder Icons */}
          <div className="mb-6">
            <div className="flex justify-between items-center px-2 mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projects</span>
              <button 
                onClick={() => setIsProjectModalOpen(true)} 
                className="px-2 py-0.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition-all shadow-2xs"
              >
                + New
              </button>
            </div>

            <div className="space-y-1.5">
              {projects.map((proj: any) => (
                <button
                  key={proj.id}
                  onClick={() => dispatch(setActiveProject(proj.id))}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    activeProjectId === proj.id 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'hover:bg-slate-800/80 text-slate-400'
                  }`}
                >
                  <span className="p-1 bg-amber-500/20 border border-amber-500/40 rounded-md text-[10px]">📁</span>
                  <span className="truncate">{proj.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CSS Persona Switcher */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase block">Switch Persona</label>
          <select 
            value={currentUser?.id || ''} 
            onChange={(e) => dispatch(switchUser(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700/80 text-xs rounded-xl p-2.5 text-white outline-none font-bold cursor-pointer hover:bg-slate-700/80 transition-all shadow-inner"
          >
            {users.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Styled Project Creation Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scaleUp">
            <h3 className="font-extrabold text-sm text-slate-900 mb-4">Create New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <input 
                type="text" 
                placeholder="Project Name" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-900 font-medium focus:border-blue-600"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}