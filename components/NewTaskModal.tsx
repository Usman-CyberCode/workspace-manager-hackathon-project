'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addTask, setActiveModal, addToast } from '@/store';
import { MockUser } from '@/lib/mockdata';

export default function NewTaskModal() {
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state: RootState) => state.ui);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const { users = [], currentUser } = useSelector((state: RootState) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assigneeId, setAssigneeId] = useState(currentUser?.id || 'u-1');
  const [labelInput, setLabelInput] = useState('Frontend, UI/UX');

  if (activeModal !== 'newTask') return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelInput.split(',').map((l) => l.trim()).filter(Boolean);

    dispatch(addTask({
      projectId: activeProjectId,
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
      labels,
      subtasks: [],
      attachments: [],
      comments: []
    }));

    dispatch(addToast({ message: `Task "${title}" created!`, type: 'success' }));
    dispatch(setActiveModal(null));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp text-slate-800">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base font-black text-slate-900">Create New Task</h3>
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
              Task Title
            </label>
            <input 
              type="text" 
              placeholder="e.g. Implement drag-and-drop animations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-bold text-slate-900"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Description
            </label>
            <textarea 
              placeholder="Task details and acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Column Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                <option value="todo">🟡 To Do</option>
                <option value="in-progress">🟢 In Progress</option>
                <option value="done">🔴 Completed</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟡 High</option>
                <option value="medium">🟢 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                {users.map((u: MockUser) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Due Date
              </label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Tags / Labels (comma separated)
            </label>
            <input 
              type="text" 
              placeholder="e.g. Frontend, Design, Security"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-medium"
            />
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Create Task ➔
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
