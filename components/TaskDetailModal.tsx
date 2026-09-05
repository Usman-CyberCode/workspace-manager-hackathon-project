'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSelectedTaskId, addComment, updateTask, convertSubtaskToTask, toggleSubtask } from '@/store';

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
          attachments: [...attachments, { name: file.name, url: reader.result }] 
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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[90vh] text-slate-800 dark:text-slate-100">
        <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
          <input 
            value={task.title} 
            onChange={(e) => dispatch(updateTask({ id: task.id, title: e.target.value }))}
            className="text-2xl font-black bg-transparent outline-none dark:text-white w-full tracking-tight"
          />
          <button onClick={() => dispatch(setSelectedTaskId(null))} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white text-lg">✕</button>
        </div>

        <div className="mt-6 space-y-6 text-xs">
          {/* Description */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-2">Description</label>
            <textarea 
              value={task.description}
              onChange={(e) => dispatch(updateTask({ id: task.id, description: e.target.value }))}
              className="w-full p-3 border dark:border-slate-700/80 rounded-2xl dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Subtasks with Checklist and Promotion to Full Task */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-2">Subtasks Engine</label>
            <div className="space-y-2">
              {task.subtasks?.length > 0 ? (
                task.subtasks.map((st: any) => (
                  <div key={st.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={st.completed} 
                        onChange={() => dispatch(toggleSubtask({ taskId: task.id, subtaskId: st.id }))}
                        className="rounded accent-blue-600"
                      />
                      <span className={st.completed ? 'line-through text-slate-400' : 'font-medium'}>{st.title}</span>
                    </div>
                    <button 
                      onClick={() => dispatch(convertSubtaskToTask({ taskId: task.id, subtaskId: st.id }))}
                      className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all"
                    >
                      Promote to Task ↗
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No subtasks added.</p>
              )}
            </div>
          </div>

          {/* Attachments (Base64) */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-2">Attachments (Base64)</label>
            <input type="file" onChange={handleFileUpload} className="block w-full text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <div className="mt-3 flex gap-2 flex-wrap">
              {task.attachments?.map((file: any, index: number) => (
                <a key={index} href={file.url} download={file.name} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-blue-500 underline flex items-center gap-1 font-medium">
                  📎 {file.name}
                </a>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4 dark:border-slate-800">
            <label className="font-bold uppercase tracking-wider text-slate-400 block mb-3">Comments Thread</label>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {task.comments?.map((c: any) => (
                <div key={c.id} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-500">{c.author}</span>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 p-2.5 border dark:border-slate-700 rounded-xl dark:bg-slate-800 outline-none"
              />
              <button onClick={handleAddComment} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}