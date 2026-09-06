'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Kanban, 
  TableProperties, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  Filter,
  ArrowUpDown,
  FileDown
} from 'lucide-react';
import { INITIAL_USERS } from '@/lib/mockdata';

export default function ViewsShowcase() {
  const [activeView, setActiveView] = useState<'kanban' | 'table' | 'calendar'>('kanban');

  const views = [
    {
      id: 'kanban',
      title: 'Kanban Board',
      icon: Kanban,
      description: '3-tone color-coded pipelines with Yellow (#f59e0b) To Do, Green (#10b981) In Progress, and Red (#f43f5e) Completed borders.',
      highlight: 'Fluid Drag-and-Drop'
    },
    {
      id: 'table',
      title: 'List & Table View',
      icon: TableProperties,
      description: 'Dense spreadsheet-like layout with multi-column sorting, priority badges, and instant status updates.',
      highlight: 'Dense Multi-Sort'
    },
    {
      id: 'calendar',
      title: 'Sprint Calendar',
      icon: CalendarDays,
      description: 'Chronological timeline mapping tasks by due date to prevent deadline clashes and balance developer workloads.',
      highlight: 'Due Date Timeline'
    },
  ];

  return (
    <motion.section 
      id="views" 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wider mb-3">
            Unified Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight mb-4">
            Multiple Views, One Source of Truth
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Every team member thinks differently. Let designers organize via Kanban, engineers sort by Table, and product leads track via Calendar.
          </p>
        </motion.div>

        {/* Tabbed / Sliding Switcher */}
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl mt-8 text-xs font-extrabold shadow-2xs">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`relative px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'text-slate-950 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeViewTab"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span>{view.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Preview Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden relative">
        
        <AnimatePresence mode="wait">
          
          {/* KANBAN VIEW PREVIEW */}
          {activeView === 'kanban' && (
            <motion.div
              key="kanban-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>3-Tone Color-Coded Kanban Columns</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Standardized Specification
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Exact top borders: Yellow (#f59e0b) To Do, Green (#10b981) In Progress, Red (#f43f5e) Completed.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                    <Filter className="w-3.5 h-3.5" /> Filter Priority
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Column 1: Yellow #f59e0b */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800" style={{ borderTop: '4px solid #f59e0b' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      TO DO
                    </span>
                    <span className="text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">🔴 Urgent</span>
                        <span className="text-[10px] text-slate-400">Sep 10</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2">
                        Audit Workspace RBAC Policies
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verify Viewer cannot drag cards or delete workspace projects.</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Checklist: 2/3</span>
                        <img src={INITIAL_USERS[1].avatar} alt="Sarah" className="w-5 h-5 rounded-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Green #10b981 */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800" style={{ borderTop: '4px solid #10b981' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      IN PROGRESS
                    </span>
                    <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">1</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">🟡 High</span>
                        <span className="text-[10px] text-slate-400">Sep 12</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2">
                        Persona Switcher with Avatars
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Render real circular avatar photos for Alex, Sarah, Mike, and Emma.</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-emerald-600 font-bold">100% finished</span>
                        <img src={INITIAL_USERS[0].avatar} alt="Alex" className="w-5 h-5 rounded-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Red #f43f5e */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800" style={{ borderTop: '4px solid #f43f5e' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      COMPLETED
                    </span>
                    <span className="text-[10px] font-black bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full">1</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs opacity-90">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">✓ Completed</span>
                        <span className="text-[10px] text-slate-400">Sep 05</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2 line-through text-slate-400">
                        Dark & Light Theme Redux Slice
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">Full state persistence with Tailwind v4 custom dark selector.</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-emerald-600 font-bold">
                        <span>Shipped</span>
                        <img src={INITIAL_USERS[2].avatar} alt="Mike" className="w-5 h-5 rounded-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TABLE VIEW PREVIEW */}
          {activeView === 'table' && (
            <motion.div
              key="table-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    High-Density Tabular Data Grid
                  </h3>
                  <p className="text-xs text-slate-500">Fast sorting by priority, assignee, status, and creation date.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" /> Sort: Due Date
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black text-[10px]">
                      <th className="pb-3">Task Title</th>
                      <th className="pb-3">Column Status</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Subtasks</th>
                      <th className="pb-3">Assignee</th>
                      <th className="pb-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">Audit Workspace RBAC Policies</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded font-bold text-[10px]">To Do</span></td>
                      <td className="py-3"><span className="text-rose-600 font-black text-[10px]">🔴 Urgent</span></td>
                      <td className="py-3 text-slate-500">2 / 3 subtasks</td>
                      <td className="py-3 flex items-center gap-2">
                        <img src={INITIAL_USERS[1].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span>Sarah Chen</span>
                      </td>
                      <td className="py-3 text-slate-500">2026-09-10</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">Persona Switcher with Avatars</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold text-[10px]">In Progress</span></td>
                      <td className="py-3"><span className="text-amber-600 font-black text-[10px]">🟡 High</span></td>
                      <td className="py-3 text-slate-500">3 / 3 subtasks</td>
                      <td className="py-3 flex items-center gap-2">
                        <img src={INITIAL_USERS[0].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span>Alex Morgan</span>
                      </td>
                      <td className="py-3 text-slate-500">2026-09-12</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">Clean PDF Sprint Report Formatter</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-bold text-[10px]">Completed</span></td>
                      <td className="py-3"><span className="text-blue-600 font-black text-[10px]">🟢 Medium</span></td>
                      <td className="py-3 text-slate-500">1 / 1 subtask</td>
                      <td className="py-3 flex items-center gap-2">
                        <img src={INITIAL_USERS[2].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span>Mike Ross</span>
                      </td>
                      <td className="py-3 text-slate-500">2026-09-08</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* CALENDAR VIEW PREVIEW */}
          {activeView === 'calendar' && (
            <motion.div
              key="calendar-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Interactive Sprint Calendar
                  </h3>
                  <p className="text-xs text-slate-500">Spot workload peaks and deadline clashes in real time.</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">September 2026</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-[10px] font-black text-slate-400 py-1.5 uppercase bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 21 }).map((_, idx) => (
                  <div key={idx} className="h-20 p-1.5 border border-slate-100 dark:border-slate-800 rounded-xl text-left bg-slate-50/50 dark:bg-slate-950/40 relative flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                    {idx === 3 && (
                      <div className="text-[9px] font-bold p-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded truncate border border-amber-200 dark:border-amber-800">
                        Sprint Retro
                      </div>
                    )}
                    {idx === 9 && (
                      <div className="text-[9px] font-bold p-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded truncate border border-blue-200 dark:border-blue-800">
                        PDF Export V2
                      </div>
                    )}
                    {idx === 15 && (
                      <div className="text-[9px] font-bold p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded truncate border border-emerald-200 dark:border-emerald-800">
                        Product Launch
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </motion.section>
  );
}
