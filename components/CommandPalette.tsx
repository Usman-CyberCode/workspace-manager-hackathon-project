'use client';
import React, { useEffect, useState } from 'react';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-2xl border">
        <input 
          type="text" 
          placeholder="Type a command or search... (ESC to exit)" 
          className="w-full bg-slate-50 border-b pb-2 outline-none text-slate-800"
          autoFocus
        />
        <div className="mt-3 space-y-1 text-sm text-slate-600">
          <div className="p-2 hover:bg-slate-100 rounded cursor-pointer">➕ Create New Task</div>
          <div className="p-2 hover:bg-slate-100 rounded cursor-pointer">📥 Export JSON Backup</div>
        </div>
      </div>
    </div>
  );
}