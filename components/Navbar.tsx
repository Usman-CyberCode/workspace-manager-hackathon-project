'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, setActiveView, setSearchQuery, setFilterPriority, 
  addTask, clearNotifications 
} from '@/store';
import UserProfileModal from '@/components/UserProfileModal';

export default function Navbar() {
  const { activeView, searchQuery, filterPriority, notifications = [] } = useSelector((state: RootState) => state.tasks) || {};
  const { currentUser } = useSelector((state: RootState) => state.auth) || {};
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('high');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    dispatch(addTask({
      id: Date.now().toString(),
      projectId: activeProjectId,
      title: taskTitle,
      description: taskDesc || 'Task details',
      status: 'todo',
      priority: taskPriority,
      dueDate: new Date().toISOString().split('T')[0],
      comments: [],
      subtasks: []
    }));
    setTaskTitle('');
    setTaskDesc('');
    setIsTaskModalOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `dev_on_backup.json`);
    anchor.click();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 text-xs font-sans shadow-xs">
        
        {/* LEFT SIDE: User Profile Icon & Bell Notification */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <button 
              onClick={() => setIsProfileOpen(true)} 
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all border border-slate-200 shadow-2xs group cursor-pointer"
            >
              <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 object-cover" />
              <span className="font-bold text-slate-800 pr-2 group-hover:text-blue-600">{currentUser.name}</span>
            </button>
          )}

          {/* Bell Notification Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 relative transition-all cursor-pointer"
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full font-bold flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900">Notifications</h4>
                  {notifications.length > 0 && (
                    <button onClick={() => dispatch(clearNotifications())} className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-center py-4 text-[11px]">No notifications</p>
                  ) : (
                    notifications.map((n: any) => (
                      <div key={n.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-800 font-medium">{n.text}</p>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <input 
            type="text" 
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-44 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-800 font-medium"
          />
        </div>

        {/* RIGHT SIDE: Priority Filter, View Switchers & Actions */}
        <div className="flex items-center gap-3">
          <select 
            value={filterPriority} 
            onChange={(e) => dispatch(setFilterPriority(e.target.value))}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Priority: All</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟡 High</option>
            <option value="medium">🟢 Medium</option>
          </select>

          {/* Views Engine */}
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 shadow-2xs">
            <button onClick={() => dispatch(setActiveView('kanban'))} className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeView === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}>
              Kanban
            </button>
            <button onClick={() => dispatch(setActiveView('table'))} className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeView === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}>
              Table
            </button>
            <button onClick={() => dispatch(setActiveView('calendar'))} className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeView === 'calendar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}>
              Calendar
            </button>
            <button onClick={() => dispatch(setActiveView('list'))} className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activeView === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}>
              List
            </button>
          </div>

          <button onClick={() => setIsTaskModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">
            + New Task
          </button>

          <button onClick={handleExportJSON} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer">
            Export
          </button>
        </div>
      </header>

      {/* New Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <h3 className="font-extrabold text-base text-slate-900 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Task Title</label>
                <input 
                  type="text" 
                  placeholder="Task Name"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-medium text-slate-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Description</label>
                <textarea 
                  placeholder="Description..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-medium text-slate-900"
                  rows={3}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Priority</label>
                <select 
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟡 High</option>
                  <option value="medium">🟢 Medium</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md active:scale-95 cursor-pointer">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}