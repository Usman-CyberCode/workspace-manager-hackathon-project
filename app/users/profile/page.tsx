'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addProject, deleteUser, logout } from '@/store';

export default function UserProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [newProjName, setNewProjName] = useState('');

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const users = useSelector((state: RootState) => state.auth.users);
  const projects = useSelector((state: RootState) => state.workspace.projects);
  const activeWorkspaceId = useSelector((state: RootState) => state.workspace.activeWorkspaceId);
  const tasks = useSelector((state: RootState) => state.tasks.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Session</h2>
        <p className="text-xs text-slate-500 mb-4">Please sign in to view your profile and projects.</p>
        <button onClick={() => router.push('/')} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer">
          ← Back to Login / Dashboard
        </button>
      </div>
    );
  }

  const userProjects = projects.filter((p: any) => p.userId === currentUser.id || !p.userId);

  const handleCreateUserProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    dispatch(addProject({
      id: `proj-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      userId: currentUser.id,
      name: newProjName,
      color: 'bg-indigo-500'
    }));
    setNewProjName('');
  };

  const handleDeleteAccount = () => {
    if (users.length <= 1) {
      alert("Cannot delete the last remaining user account!");
      return;
    }
    if (confirm(`Are you sure you want to delete user ${currentUser.name}?`)) {
      dispatch(deleteUser(currentUser.id));
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Back */}
        <button 
          onClick={() => router.push('/')} 
          className="mb-6 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          ← Back to Dashboard
        </button>

        {/* User Card Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <img src={currentUser.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 object-cover shadow-inner" />
            <div>
              <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{currentUser.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-extrabold uppercase">
                  Role: {currentUser.role}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-[10px] font-extrabold uppercase">
                  ID: {currentUser.id}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => { dispatch(logout()); router.push('/'); }} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Sign Out 🚪
            </button>
            <button 
              onClick={handleDeleteAccount} 
              className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Delete User 🗑️
            </button>
          </div>
        </div>

        {/* User Projects Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs mb-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">📁 My Projects ({currentUser.name})</h3>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
              {userProjects.length} Projects
            </span>
          </div>

          <div className="space-y-2 mb-6">
            {userProjects.length > 0 ? (
              userProjects.map((p: any) => (
                <div key={p.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    📁 {p.name}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    Active Workspace
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic text-center py-4">No specific projects found.</p>
            )}
          </div>

          <form onSubmit={handleCreateUserProject} className="flex gap-2 pt-3 border-t border-slate-100">
            <input 
              type="text" 
              placeholder="Create new project..." 
              value={newProjName}
              onChange={(e) => setNewProjName(e.target.value)}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium text-slate-900"
            />
            <button 
              type="submit" 
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              + Add Project
            </button>
          </form>
        </div>

        {/* User Activity Stats */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4">Workspace Activity & Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
              <span className="text-2xl font-black text-blue-600">{tasks.length}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Total Tasks</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
              <span className="text-2xl font-black text-emerald-600">{tasks.filter((t: any) => t.status === 'done').length}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Completed</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
              <span className="text-2xl font-black text-amber-600">{tasks.filter((t: any) => t.status === 'in-progress').length}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">In Progress</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}