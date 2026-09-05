'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, createProject, setActiveModal, addToast, addTask } from '@/store';
import { PROJECT_TEMPLATES, MockUser } from '@/lib/mockdata';

export default function ProjectModal() {
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state: RootState) => state.ui);
  const { activeWorkspaceId } = useSelector((state: RootState) => state.workspace);
  const { users = [] } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [color, setColor] = useState('bg-blue-600');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [assignedMembers, setAssignedMembers] = useState<string[]>(['u-1', 'u-2']);

  if (activeModal !== 'newProject') return null;

  const handleSelectTemplate = (tempId: string) => {
    setSelectedTemplate(tempId);
    const template = PROJECT_TEMPLATES.find((t) => t.id === tempId);
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setIcon(template.icon);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProjId = `proj-${Date.now()}`;
    dispatch(createProject({
      workspaceId: activeWorkspaceId,
      name,
      description,
      color,
      icon,
      members: assignedMembers,
      archived: false,
      template: selectedTemplate || undefined
    }));

    // If template selected, seed predefined tasks!
    const template = PROJECT_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (template?.tasks) {
      template.tasks.forEach((taskData) => {
        dispatch(addTask({
          projectId: newProjId,
          title: taskData.title,
          description: `Predefined task from ${template.name} template.`,
          status: taskData.status as any,
          priority: taskData.priority as any,
          dueDate: '2026-09-20',
          assigneeId: assignedMembers[0] || 'u-1',
          labels: taskData.labels || [],
          subtasks: [],
          attachments: [],
          comments: []
        }));
      });
    }

    dispatch(addToast({ message: `Project "${name}" created!`, type: 'success' }));
    dispatch(setActiveModal(null));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-scaleUp text-slate-800">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Create New Project</h3>
            <p className="text-xs text-slate-500 font-medium">Add a project to your active workspace</p>
          </div>
          <button 
            onClick={() => dispatch(setActiveModal(null))}
            className="p-1 text-slate-400 hover:text-slate-800 font-bold rounded-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Project Templates Quick Selector */}
        <div className="mb-5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Predefined Project Templates (Optional)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PROJECT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTemplate(t.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedTemplate === t.id 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <span className="text-lg block mb-1">{t.icon}</span>
                <span className="font-bold text-[11px] text-slate-900 block truncate">{t.name}</span>
                <span className="text-[9px] text-slate-500 block truncate">{t.tasks.length} starter tasks</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Project Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Q4 Growth Sprint"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 text-xs"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Description
            </label>
            <textarea 
              placeholder="Project goals, roadmap, or sprint description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Project Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                <option value="🚀">🚀 Rocket</option>
                <option value="🐞">🐞 Bug Tracker</option>
                <option value="📈">📈 Growth / Marketing</option>
                <option value="🎨">🎨 Design System</option>
                <option value="⚡">⚡ Core API</option>
                <option value="📱">📱 Mobile App</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Member Assignment
              </label>
              <select
                multiple
                value={assignedMembers}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setAssignedMembers(selected);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none h-16"
              >
                {users.map((u: MockUser) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
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
              Create Project ➔
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
