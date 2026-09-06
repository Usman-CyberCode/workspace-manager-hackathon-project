'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'; // Next.js Link imported
import { RootState, updateProfile, deleteUser, logout, addToast } from '@/store';
import { LogOut } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const dispatch = useDispatch();
  const { currentUser, users } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    dispatch(updateProfile({ name, email }));
    onClose();
  };

  const handleDeleteAccount = () => {
    if (users.length <= 1) {
      alert("Cannot delete the last remaining user account!");
      return;
    }
    if (confirm(`Are you sure you want to delete user ${currentUser.name}?`)) {
      dispatch(deleteUser(currentUser.id));
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ message: 'You have been successfully logged out.', type: 'info' }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp text-slate-800">
        
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900">User Profile Settings</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800 font-bold text-lg rounded-xl cursor-pointer">✕</button>
        </div>

        {/* User Avatar Card with Next.js Link */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl bg-slate-200 border border-slate-300 object-cover shadow-2xs" />
            <div>
              <h4 className="font-black text-sm text-slate-900">{currentUser.name}</h4>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md inline-block mt-0.5">
                Role: {currentUser.role}
              </span>
            </div>
          </div>
          
          {/* Using Next.js Link Component */}
          <Link 
  href="/users/profile" 
  onClick={onClose}
  className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-xs transition-all"
>
  View Profile ↗
</Link>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold">
          <div>
            <label className="text-slate-500 uppercase tracking-wider block mb-1">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-medium text-slate-900"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={handleLogout}
                className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
              <button 
                type="button" 
                onClick={handleDeleteAccount}
                className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white font-extrabold rounded-xl transition-all cursor-pointer"
              >
                Delete User 🗑️
              </button>
            </div>

            <button 
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}