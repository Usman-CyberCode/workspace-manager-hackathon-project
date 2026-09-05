'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, login } from '@/store';

export default function LoginScreen() {
  const users = useSelector((state: RootState) => state.auth.users);
  const dispatch = useDispatch();
  const [selectedEmail, setSelectedEmail] = useState(users[0]?.email || '');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email: selectedEmail }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-2 text-blue-400">Workspace Manager</h2>
        <p className="text-xs text-center text-slate-400 mb-6">Select a pre-configured mock persona to sign in</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Select User Profile</label>
            <select 
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
            >
              {users.map((u: any) => (
                <option key={u.id} value={u.email}>
                  {u.name} ({u.role.toUpperCase()}) - {u.email}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20"
          >
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
}