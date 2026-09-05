'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeToast, undo, Toast } from '@/store';

export default function ToastContainer() {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.ui.toasts);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none no-print">
      {toasts.map((toast: Toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-xs font-bold animate-fadeIn max-w-sm ${
            toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-800 text-rose-200'
              : toast.type === 'success'
              ? 'bg-slate-900/95 border-slate-700 text-white'
              : 'bg-slate-900/95 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>
              {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✓' : 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                dispatch(undo());
                dispatch(removeToast(toast.id));
              }}
              className="text-[11px] font-black text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Undo
            </button>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-0.5"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
