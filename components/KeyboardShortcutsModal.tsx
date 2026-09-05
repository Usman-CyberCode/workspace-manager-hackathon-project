'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setActiveModal } from '@/store';

export default function KeyboardShortcutsModal() {
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state: RootState) => state.ui);

  if (activeModal !== 'shortcuts') return null;

  const shortcuts = [
    { key: '⌘ + K / Ctrl + K', action: 'Open Command Palette' },
    { key: 'C', action: 'Create New Task' },
    { key: '1', action: 'Switch to Kanban View' },
    { key: '2', action: 'Switch to Table View' },
    { key: '3', action: 'Switch to Calendar View' },
    { key: '4', action: 'Switch to List View' },
    { key: 'Ctrl + Z', action: 'Undo last change' },
    { key: 'Ctrl + Y', action: 'Redo last change' },
    { key: 'Esc', action: 'Close active modal / drawer' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp text-slate-800">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⌨️</span>
            <h3 className="text-base font-black text-slate-900">Keyboard Shortcuts</h3>
          </div>
          <button 
            onClick={() => dispatch(setActiveModal(null))}
            className="p-1 text-slate-400 hover:text-slate-800 font-bold rounded-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="font-semibold text-slate-700">{s.action}</span>
              <kbd className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[10px] font-mono font-bold text-slate-800 shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => dispatch(setActiveModal(null))}
            className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
