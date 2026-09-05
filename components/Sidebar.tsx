'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, switchUser, setActiveProject } from '@/store';

export default function Sidebar() {
  const { users, currentUser } = useSelector((state: RootState) => state.auth);
  const { projects, activeProjectId } = useSelector((state: RootState) => state.workspace);
  const dispatch = useDispatch();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6 text-blue-400">Workspace Manager</h1>
        
        {/* Projects Navigation */}
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Projects</p>
          <div className="space-y-1">
            {projects.map((proj: any) => (
              <button
                key={proj.id}
                onClick={() => dispatch(setActiveProject(proj.id))}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  activeProjectId === proj.id ? 'bg-blue-600 font-semibold' : 'hover:bg-slate-800'
                }`}
              >
                📁 {proj.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Switcher (Simulating Multi-User) */}
      <div className="border-t border-slate-800 pt-4">
        <p className="text-xs text-slate-400 mb-2">Active Persona ({currentUser.role}):</p>
        <select 
          value={currentUser.id}
          onChange={(e) => dispatch(switchUser(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 text-sm rounded p-2 text-white"
        >
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
          ))}
        </select>
      </div>
    </aside>
  );
}