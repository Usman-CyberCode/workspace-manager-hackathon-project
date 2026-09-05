'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setSelectedTaskId, addComment, updateTask, 
  convertSubtaskToTask, toggleSubtask 
} from '@/store';

export default function TaskDetailModal() {
  const { selectedTaskId, items: tasks } = useSelector((state: RootState) => state.tasks);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState('');

  if (!selectedTaskId) return null;
  const task = tasks.find((t: any) => t.id === selectedTaskId);
  if (!task) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const attachments = task.attachments || [];
        dispatch(updateTask({ 
          id: task.id, 
          attachments: [...attachments, { name: file.name, url: reader.result as string }] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    dispatch(addComment({
      taskId: task.id,
      comment: {
        id: Date.now().toString(),
        author: currentUser?.name || 'Anonymous',
        text: commentText,
        time: new Date().toLocaleTimeString()
      }
    }));
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh] text-slate-800 font-sans">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <input 
            value={task.title} 
            onChange={(e) => dispatch(updateTask({ id: task.id, title: e.target.value }))}
            className="text-2xl font-black bg-transparent outline-none text-slate-900 w-full tracking-tight focus:ring-2 focus:ring-blue-600 rounded-lg px-1"
          />
          <button 
            onClick={() => dispatch(setSelectedTaskId(null))} 
            className="p-2 text-slate-400 hover:text-slate-800 text-lg font-bold rounded-xl hover:bg-slate-100 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6 text-xs">
          {/* Description */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-2">Description</label>
            <textarea 
              value={task.description}
              onChange={(e) => dispatch(updateTask({ id: task.id, description: e.target.value }))}
              className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:border-blue-600 text-slate-900 font-medium"
              rows={3}
            />
          </div>

          {/* Subtasks Checklist Engine */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-2">Subtasks Engine</label>
            <div className="space-y-2">
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((st: any) => (
                  <div key={st.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={st.completed} 
                        onChange={() => dispatch(toggleSubtask({ taskId: task.id, subtaskId: st.id }))}
                        className="rounded accent-blue-600 w-4 h-4"
                      />
                      <span className={st.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>{st.title}</span>
                    </div>
                    <button 
                      onClick={() => dispatch(convertSubtaskToTask({ taskId: task.id, subtaskId: st.id }))}
                      className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Promote to Task ↗
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No subtasks added yet.</p>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-2">Attachments (Base64 Upload)</label>
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer" 
            />
            <div className="mt-3 flex gap-2 flex-wrap">
              {task.attachments?.map((file: any, index: number) => (
                <a key={index} href={file.url} download={file.name} className="px-3 py-1.5 bg-slate-100 rounded-xl text-blue-600 underline flex items-center gap-1 font-bold border border-slate-200">
                  📎 {file.name}
                </a>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-slate-100 pt-4">
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-3">Comments Feed</label>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto pr-1">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((c: any) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-blue-600">{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{c.time}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No comments posted.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600 text-slate-900 font-medium"
              />
              <button 
                onClick={handleAddComment} 
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-95 transition-all shadow-md shadow-blue-500/20"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}