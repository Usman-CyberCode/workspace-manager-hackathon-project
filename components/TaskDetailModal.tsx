'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setSelectedTaskId, addComment, editComment, deleteComment, 
  updateTaskStatus, updateTaskPriority, updateTaskAssignee, editTask, 
  deleteTask, duplicateTask, addSubtask, toggleSubtask, deleteSubtask, 
  convertSubtaskToTask, addAttachment, deleteAttachment, addToast 
} from '@/store';
import { TaskItem, MockUser, Attachment, Subtask, TaskComment } from '@/lib/mockdata';

export default function TaskDetailModal() {
  const dispatch = useDispatch();
  const { selectedTaskId, items: tasks } = useSelector((state: RootState) => state.tasks);
  const { currentUser, users = [] } = useSelector((state: RootState) => state.auth);

  const [commentText, setCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'attachments' | 'comments'>('details');

  if (!selectedTaskId) return null;
  const task = tasks.find((t: TaskItem) => t.id === selectedTaskId);
  if (!task) return null;

  const isViewer = currentUser?.role === 'viewer';

  // Handle Comment with @mentions
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCommentText(val);
    if (val.includes('@')) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSelectMention = (userName: string) => {
    const parts = commentText.split('@');
    setCommentText(`${parts[0]}@${userName.toLowerCase().replace(' ', '')} `);
    setShowMentionMenu(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser?.id || 'u-1',
      authorName: currentUser?.name || 'Alex Morgan',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: commentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(addComment({ taskId: task.id, comment: newComment }));
    setCommentText('');
  };

  // Subtask creation
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || isViewer) return;
    dispatch(addSubtask({ taskId: task.id, title: newSubtaskTitle }));
    setNewSubtaskTitle('');
  };

  // File Attachment (Mock base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const att: Attachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'document',
        dataUrl: event.target?.result as string,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      dispatch(addAttachment({ taskId: task.id, attachment: att }));
      dispatch(addToast({ message: `Attached ${file.name}`, type: 'success' }));
    };
    reader.readAsDataURL(file);
  };

  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s: Subtask) => s.completed).length || 0;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh] text-slate-800">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                Task #{task.id}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                task.status === 'todo' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                task.status === 'in-progress' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {task.status}
              </span>
            </div>
            
            {/* Title (editable if not viewer) */}
            <input 
              type="text"
              disabled={isViewer}
              value={task.title}
              onChange={(e) => dispatch(editTask({ id: task.id, title: e.target.value }))}
              className="text-lg sm:text-xl font-black text-slate-900 w-full outline-none focus:border-b-2 focus:border-blue-600 bg-transparent"
            />
          </div>

          <button 
            onClick={() => dispatch(setSelectedTaskId(null))} 
            className="p-1 text-slate-400 hover:text-slate-800 text-lg font-bold rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status, Priority, Assignee & Due Date Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
            <select
              disabled={isViewer}
              value={task.status}
              onChange={(e: any) => dispatch(updateTaskStatus({ id: task.id, status: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-1.5 font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="todo">🟡 To Do</option>
              <option value="in-progress">🟢 In Progress</option>
              <option value="done">🔴 Completed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
            <select
              disabled={isViewer}
              value={task.priority}
              onChange={(e: any) => dispatch(updateTaskPriority({ id: task.id, priority: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-1.5 font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🟢 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assignee</label>
            <select
              disabled={isViewer}
              value={task.assigneeId}
              onChange={(e) => dispatch(updateTaskAssignee({ id: task.id, assigneeId: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-1.5 font-bold text-slate-800 outline-none cursor-pointer"
            >
              {users.map((u: MockUser) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Due Date</label>
            <input 
              type="date" 
              disabled={isViewer}
              value={task.dueDate}
              onChange={(e) => dispatch(editTask({ id: task.id, dueDate: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-1.5 font-bold text-slate-800 outline-none text-xs"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-4 text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'details' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Description & Details
          </button>
          <button
            onClick={() => setActiveTab('subtasks')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subtasks' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>Subtasks</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-extrabold">
              {completedSubtasks}/{subtaskCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'attachments' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>Attachments</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-extrabold">
              {task.attachments?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comments' ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>Comments</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-extrabold">
              {task.comments?.length || 0}
            </span>
          </button>
        </div>

        {/* TAB 1: DESCRIPTION */}
        {activeTab === 'details' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Task Description
              </label>
              <textarea 
                disabled={isViewer}
                value={task.description}
                onChange={(e) => dispatch(editTask({ id: task.id, description: e.target.value }))}
                rows={4}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-400 font-medium text-slate-800 text-xs leading-relaxed"
                placeholder="Add rich description..."
              />
            </div>

            {/* Labels / Tags */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                Labels & Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {task.labels?.map((lbl: string) => (
                  <span key={lbl} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                    🏷️ {lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NESTED SUBTASKS CHECKLIST */}
        {activeTab === 'subtasks' && (
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
              <span>Checklist Progress</span>
              <span>{completedSubtasks}/{subtaskCount} completed</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {task.subtasks?.map((sub: Subtask) => (
                <div 
                  key={sub.id} 
                  className="group flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/80 transition-colors"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input 
                      type="checkbox"
                      disabled={isViewer}
                      checked={sub.completed}
                      onChange={() => dispatch(toggleSubtask({ taskId: task.id, subtaskId: sub.id }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={`truncate text-xs font-medium ${sub.completed ? 'line-through text-slate-400' : 'text-slate-900 font-semibold'}`}>
                      {sub.title}
                    </span>
                  </label>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isViewer && (
                      <>
                        <button
                          onClick={() => dispatch(convertSubtaskToTask({ taskId: task.id, subtaskId: sub.id }))}
                          className="text-[10px] text-blue-600 hover:underline font-bold"
                          title="Convert to full standalone task"
                        >
                          Convert to Task ↗
                        </button>
                        <button
                          onClick={() => dispatch(deleteSubtask({ taskId: task.id, subtaskId: sub.id }))}
                          className="text-slate-400 hover:text-rose-600 text-xs font-bold px-1"
                          title="Delete subtask"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {subtaskCount === 0 && (
                <p className="text-slate-400 italic text-center py-4">No subtasks added yet.</p>
              )}
            </div>

            {/* Add Subtask Input */}
            {!isViewer && (
              <form onSubmit={handleAddSubtask} className="flex gap-2 pt-2 border-t border-slate-100">
                <input 
                  type="text"
                  placeholder="Add a checklist subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400 text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  + Add
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: ATTACHMENTS (Mock Base64 Storage) */}
        {activeTab === 'attachments' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {task.attachments?.map((att: Attachment) => (
                <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">📄</span>
                    <div>
                      <h5 className="font-bold text-slate-900 truncate text-xs">{att.name}</h5>
                      <span className="text-[10px] text-slate-400">{att.size} • Uploaded {att.uploadedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {att.dataUrl && (
                      <a 
                        href={att.dataUrl} 
                        download={att.name}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Download 📥
                      </a>
                    )}
                    {!isViewer && (
                      <button 
                        onClick={() => dispatch(deleteAttachment({ taskId: task.id, attachmentId: att.id }))}
                        className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {(!task.attachments || task.attachments.length === 0) && (
                <p className="text-slate-400 italic text-center py-6">No files attached to this task.</p>
              )}
            </div>

            {!isViewer && (
              <label className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <span className="text-2xl mb-1">📎</span>
                <span className="font-bold text-slate-800">Attach File (Stored locally in state)</span>
                <span className="text-[10px] text-slate-400">PDF, PNG, JPG, or TXT up to 5MB</span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        )}

        {/* TAB 4: COMMENTS & COLLABORATION */}
        {activeTab === 'comments' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {task.comments?.map((c: TaskComment) => {
                const isAuthor = c.authorId === currentUser?.id;
                return (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img src={c.authorAvatar} alt={c.authorName} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-extrabold text-slate-900">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>

                      {isAuthor && !isViewer && (
                        <div className="flex gap-1.5 text-[10px] font-bold">
                          <button 
                            onClick={() => {
                              setEditingCommentId(c.id);
                              setEditingCommentText(c.text);
                            }}
                            className="text-slate-400 hover:text-slate-800 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => dispatch(deleteComment({ taskId: task.id, commentId: c.id }))}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editingCommentId === c.id ? (
                      <div className="flex gap-2 mt-2">
                        <input 
                          type="text" 
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none"
                        />
                        <button 
                          onClick={() => {
                            dispatch(editComment({ taskId: task.id, commentId: c.id, text: editingCommentText }));
                            setEditingCommentId(null);
                          }}
                          className="px-3 py-1 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-700 font-medium leading-relaxed">{c.text}</p>
                    )}
                  </div>
                );
              })}

              {(!task.comments || task.comments.length === 0) && (
                <p className="text-slate-400 italic text-center py-6">No comments yet. Start the conversation!</p>
              )}
            </div>

            {/* Comment Box with @Mention */}
            <div className="relative pt-2 border-t border-slate-100">
              {showMentionMenu && (
                <div className="absolute bottom-full left-0 mb-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 text-xs">
                  <div className="text-[9px] uppercase font-bold text-slate-400 px-2 py-1">Mention Member</div>
                  {users.map((u: MockUser) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectMention(u.name)}
                      className="w-full text-left p-1.5 hover:bg-slate-100 rounded-lg flex items-center gap-2 font-bold cursor-pointer text-slate-800"
                    >
                      <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full" />
                      <span>{u.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add a comment... (Type '@' to mention teammate)"
                  value={commentText}
                  onChange={handleCommentChange}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400 text-slate-900 font-medium"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  Send 💬
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex justify-between items-center pt-5 mt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            {!isViewer && (
              <button 
                onClick={() => {
                  if (confirm(`Delete task "${task.title}"?`)) {
                    dispatch(deleteTask(task.id));
                    dispatch(setSelectedTaskId(null));
                    dispatch(addToast({ message: 'Task deleted.', type: 'info' }));
                  }
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-extrabold rounded-xl transition-all cursor-pointer"
              >
                🗑️ Delete Task
              </button>
            )}
            
            <button 
              onClick={() => {
                dispatch(duplicateTask(task.id));
                dispatch(addToast({ message: 'Task duplicated.', type: 'info' }));
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              📋 Duplicate
            </button>
          </div>

          <button 
            onClick={() => dispatch(setSelectedTaskId(null))}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}