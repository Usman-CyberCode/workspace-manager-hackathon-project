'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, createWorkspace, setActiveModal, addToast } from '@/store';

export default function WorkspaceModal() {
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state: RootState) => state.ui);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [color, setColor] = useState('#3b82f6');
  const [defaultView, setDefaultView] = useState<'kanban' | 'table' | 'calendar' | 'list'>('kanban');

  if (activeModal !== 'newWorkspace') return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(createWorkspace({
      name,
      icon,
      color,
      defaultView
    }));

    dispatch(addToast({ message: `Workspace "${name}" created!`, type: 'success' }));
    dispatch(setActiveModal(null));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp text-slate-800">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5">
          <h3 className="text-base font-black text-slate-900">Create New Workspace</h3>
          <button 
            onClick={() => dispatch(setActiveModal(null))}
            className="p-1 text-slate-400 hover:text-slate-800 font-bold rounded-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Workspace Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Design Systems HQ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Workspace Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                <option value="⚡">⚡ Lightning</option>
                <option value="🎨">🎨 Studio</option>
                <option value="🏢">🏢 Company HQ</option>
                <option value="💻">💻 Engineering</option>
                <option value="🧪">🧪 R&D Lab</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-[11px] text-slate-600 uppercase font-bold">{color}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Default Project View
            </label>
            <select
              value={defaultView}
              onChange={(e: any) => setDefaultView(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
            >
              <option value="kanban">📋 Kanban Board</option>
              <option value="table">📑 Table View</option>
              <option value="calendar">📅 Calendar View</option>
              <option value="list">📄 List View</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => dispatch(setActiveModal(null))}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
