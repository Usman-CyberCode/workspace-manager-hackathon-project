'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setSelectedTaskId, addComment, updateTaskStatus, 
  updateTaskPriority, deleteTask 
} from '@/store';

export default function TaskDetailModal() {
  const { selectedTaskId, items: tasks } = useSelector((state: RootState) => state.tasks);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState('');

  if (!selectedTaskId) return null;
  const task = tasks.find((t: any) => t.id === selectedTaskId);
  if (!task) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({
      taskId: task.id,
      comment: {
        id: Date.now().toString(),
        author: currentUser?.name || 'Anonymous User',
        text: commentText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh] text-slate-800 font-sans">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-200">
              Task Details
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2 leading-snug">{task.title}</h3>
          </div>
          <button 
            onClick={() => dispatch(setSelectedTaskId(null))} 
            className="p-1.5 text-slate-400 hover:text-slate-800 text-lg font-bold rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status & Priority Selectors */}
        <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold">
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Status</label>
            <select 
              value={task.status} 
              onChange={(e) => dispatch(updateTaskStatus({ id: task.id, status: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="todo">🟡 To Do</option>
              <option value="in-progress">🟢 In Progress</option>
              <option value="done">🔴 Completed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
            <select 
              value={task.priority} 
              onChange={(e) => dispatch(updateTaskPriority({ id: task.id, priority: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🟢 Medium</option>
            </select>
          </div>
        </div>

        {/* Task Description */}
        <div className="mb-6">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed min-h-[70px]">
            {task.description || 'No description provided.'}
          </div>
        </div>

        {/* Comments Thread Section */}
        <div className="border-t border-slate-100 pt-4">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3">
            💬 Comments Feed ({task.comments?.length || 0})
          </label>

          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((c: any) => (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-blue-600">{c.author}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{c.time}</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-snug">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic text-xs text-center py-3">No comments added yet.</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Write a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium text-slate-900"
            />
            <button 
              type="submit" 
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex justify-between items-center pt-5 mt-6 border-t border-slate-100 text-xs">
          <button 
            onClick={() => { dispatch(deleteTask(task.id)); dispatch(setSelectedTaskId(null)); }}
            className="px-3.5 py-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white font-extrabold rounded-xl transition-all cursor-pointer"
          >
            🗑️ Delete Task
          </button>
          <button 
            onClick={() => dispatch(setSelectedTaskId(null))}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}