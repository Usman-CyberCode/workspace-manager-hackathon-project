'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyAndLogin } from '@/store';
import LoginScreen from './LoginScreen';

export default function LandingPage() {
  const dispatch = useDispatch();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLaunchDemo = () => {
    dispatch(verifyAndLogin({ email: 'alex@devon.io' }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">

      {/* Notion Minimalist Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-base shadow-sm">
            D
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">Dev on</span>
            <span className="text-[10px] font-bold text-slate-400 block -mt-1 tracking-wider uppercase">Workspace</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#kanban" className="hover:text-slate-900 transition-colors">Kanban Board</a>
          <a href="#personas" className="hover:text-slate-900 transition-colors">Personas</a>
          <a href="#export" className="hover:text-slate-900 transition-colors">PDF Export</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            Live Demo
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Get Started ➔
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">

        {/* Minimalist Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300/80 text-[11px] font-bold text-slate-700 mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Dev on Workspace</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">70 Capstone Features</span>
        </div>

        {/* Bold Typography */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
          Dev on, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-600 bg-clip-text text-transparent">
            Make Your Worklife Easy.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-9 leading-relaxed">
          Execute sprints, track 3-tone color-coded Kanban pipelines, switch personas seamlessly,
          and export clean PDF reports with zero backend friction.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-slate-900/15 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <span className="text-slate-400">➔</span>
          </button>

          <button
            onClick={handleLaunchDemo}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-sm rounded-2xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀 Explore Live Demo</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">No Login Required</span>
          </button>
        </div>

        {/* Interactive Notion Kanban Preview Box */}
        <div id="kanban" className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xl shadow-slate-200/60 text-left transition-all hover:border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="ml-2 text-xs font-bold text-slate-400 font-mono">devon.workspace/sprint-launch</span>
            </div>
            <div className="flex gap-1.5 text-[10px] font-bold text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 rounded-md">⌘K Command Palette</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md">Live Redux State</span>
            </div>
          </div>

          {/* 3 Color Accented Columns Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Yellow */}
            <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80" style={{ borderTop: '4px solid #f59e0b' }}>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  TO DO
                </span>
                <span className="text-[10px] font-bold bg-amber-100/80 text-amber-800 px-1.5 py-0.5 rounded-full">2</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-xs">Notion-style 3-Column Kanban</span>
                    <span className="text-[9px] uppercase font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Urgent</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Yellow, Green, and Red top borders</p>
                  <div className="mt-2 text-[10px] text-slate-400 font-medium">☑ 2/3 subtasks • 💬 1 comment</div>
                </div>
              </div>
            </div>

            {/* Column 2: Green */}
            <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80" style={{ borderTop: '4px solid #10b981' }}>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  IN PROGRESS
                </span>
                <span className="text-[10px] font-bold bg-emerald-100/80 text-emerald-800 px-1.5 py-0.5 rounded-full">1</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-xs">Client-Side Persistence</span>
                    <span className="text-[9px] uppercase font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">High</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">IndexedDB & LocalStorage rehydration</p>
                  <div className="mt-2 text-[10px] text-slate-400 font-medium">☑ 3/3 subtasks complete</div>
                </div>
              </div>
            </div>

            {/* Column 3: Red */}
            <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80" style={{ borderTop: '4px solid #f43f5e' }}>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  COMPLETED
                </span>
                <span className="text-[10px] font-bold bg-rose-100/80 text-rose-800 px-1.5 py-0.5 rounded-full">1</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs opacity-90">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-xs line-through text-slate-400">Dark OTP Auth Screen</span>
                    <span className="text-[9px] uppercase font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Done</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Auto-focus 4-digit verification UI</p>
                  <div className="mt-2 text-[10px] text-emerald-600 font-bold">✓ Released</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid Layout */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Enterprise Ready</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Engineered with Notion Precision
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Every detail crafted with pixel perfection across all 14 capstone domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xl mb-4">
                📋
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1.5">3-Tone Kanban Pipeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Color-accented columns: Yellow (<code className="text-[10px] bg-amber-50 px-1 py-0.5 rounded text-amber-700">#f59e0b</code>) To Do,
                Green (<code className="text-[10px] bg-emerald-50 px-1 py-0.5 rounded text-emerald-700">#10b981</code>) In Progress,
                and Red (<code className="text-[10px] bg-rose-50 px-1 py-0.5 rounded text-rose-700">#f43f5e</code>) Completed with drag-and-drop.
              </p>
            </div>

            {/* Feature 2 */}
            <div id="personas" className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-xl mb-4">
                👥
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1.5">Multi-User Personas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Role-based access control with Owner, Admin, Member, and Viewer personas.
                Experience live permission gating where Viewer role is prevented from editing or deleting.
              </p>
            </div>

            {/* Feature 3 */}
            <div id="export" className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-xl mb-4">
                📄
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1.5">Print & PDF Export</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated "Export PDF" engine with optimized <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">@media print</code> rules
                that hide sidebars and format the Kanban board into a clean corporate executive report.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-xl mb-4">
                🔍
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1.5">Multi-View Switcher</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switch instantaneously between Kanban Board, Sortable Table, Monthly Calendar, and
                Notion List view with dynamic grouping by status, assignee, priority, or tag.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl mb-4">
                ⚡
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1.5">Undo/Redo & Optimistic UX</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete history stack for task updates and moves. Inline toast alerts with immediate
                Undo action buttons and simulated live background updates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-xl mb-4">
                💾
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1.5">JSON Backup & Offline Sync</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click JSON backup export and validated JSON restore. Offline mode simulation with
                manual sync reconciliation and localStorage persistence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notion Minimalist Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
              D
            </div>
            <span className="font-bold text-slate-900">Dev on</span>
            <span>— Notion-Inspired Workspace Manager</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowAuthModal(true)} className="hover:text-slate-900 font-bold transition-colors">
              Sign In with OTP
            </button>
            <span>•</span>
            <button onClick={handleLaunchDemo} className="text-blue-600 hover:text-blue-700 font-bold">
              Direct Demo Launch 🚀
            </button>
          </div>
        </div>
      </footer>

      {/* Dark OTP Auth Modal (When Get Started is clicked) */}
      {showAuthModal && (
        <LoginScreen onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
}
