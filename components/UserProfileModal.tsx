'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateProfile, switchUser, logout } from '@/store';

export default function UserProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser, users } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  if (!isOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp text-slate-800 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-base text-slate-900">User Profile Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 font-bold">✕</button>
        </div>

        {/* User Badge Info Card */}
        <div className="flex items-center gap-4 mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <img src={currentUser.avatar} alt="Avatar" className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 shadow-2xs" />
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">{currentUser.name}</h4>
            <span className="text-[10px] font-extrabold uppercase bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-md border border-blue-600/20">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 mb-6 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-semibold text-slate-900"
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all">
            Save Profile Details
          </button>
        </form>

        {/* Persona Switcher & Logout */}
        <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Switch Persona</label>
            <select 
              value={currentUser.id} 
              onChange={(e) => { dispatch(switchUser(e.target.value)); onClose(); }}
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
            >
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <button onClick={() => { dispatch(logout()); onClose(); }} className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 rounded-xl font-bold transition-all">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}