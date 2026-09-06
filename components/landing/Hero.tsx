'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Kanban, 
  TableProperties, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileDown,
  Users
} from 'lucide-react';
import { INITIAL_USERS } from '@/lib/mockdata';

interface HeroProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLaunchDemo: () => void;
}

export default function Hero({ onOpenAuth, onLaunchDemo }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'kanban' | 'table' | 'calendar'>('kanban');

  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } 
    },
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
      
      {/* Ambient Pulsating Gradient Glow Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/25 to-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-44 -left-20 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-44 -right-20 w-72 h-72 bg-violet-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Hero Content Staggered Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Pill Badge */}
        <motion.div variants={itemVariants} className="inline-block mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs backdrop-blur-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Workspace Manager 2.0</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 inline" />
              Notion Meets Jira Speed
            </span>
          </div>
        </motion.div>

        {/* Big Bold Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.08] mb-6 font-sans"
        >
          Manage projects at the <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            speed of thought.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          An ultra-fast, minimalist workspace for ambitious software teams.
          Switch seamlessly between 3-tone color Kanban pipelines, dense tables, 
          and sprint calendars with instant PDF reporting.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-7 py-4 bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-slate-950/15 dark:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <span>Start Free with Work Email</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto px-6 py-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-sm rounded-2xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLaunchDemo}
            className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 font-extrabold text-sm rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Interactive Demo</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Floating Animated Product Screenshot Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        className="relative"
      >
        {/* Subtle Floating Animation Container */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="animate-float bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-300/60 dark:shadow-black/60 text-left backdrop-blur-sm"
        >
          {/* Mockup Top Browser Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-5 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-2xs"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-2xs"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-2xs"></span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                workspace.devon.io / sprint-board
              </span>
            </div>

            {/* Interactive View Switcher inside Hero */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'table'
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT WITH ANIMATE PRESENCE */}
          <AnimatePresence mode="wait">
            {activeTab === 'kanban' && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Column 1: To Do (Yellow Accent #f59e0b) */}
                <div 
                  className="bg-slate-50/90 dark:bg-slate-950/70 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800"
                  style={{ borderTop: '4px solid #f59e0b' }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      TO DO
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      2
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          Clean PDF Sprint Report
                        </h4>
                        <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                          Urgent
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        @media print rules with 3-tone columns format.
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>2/3 subtasks</span>
                        </div>
                        <img 
                          src={INITIAL_USERS[0].avatar} 
                          alt="Alex" 
                          className="w-5 h-5 rounded-full object-cover border border-slate-300" 
                        />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          Framer Motion Transitions
                        </h4>
                        <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                          High
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Staggered entrances and floating hero loop.
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Sep 12</span>
                        <img 
                          src={INITIAL_USERS[1].avatar} 
                          alt="Sarah" 
                          className="w-5 h-5 rounded-full object-cover border border-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress (Green Accent #10b981) */}
                <div 
                  className="bg-slate-50/90 dark:bg-slate-950/70 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800"
                  style={{ borderTop: '4px solid #10b981' }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      IN PROGRESS
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      1
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          Persona Switcher with Avatars
                        </h4>
                        <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                          Medium
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Render avatar images in dropdown list.
                      </p>
                      
                      {/* Subtask Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                          <span>Checklist Progress</span>
                          <span className="text-emerald-600 dark:text-emerald-400">100%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">💬 3 comments</span>
                        <img 
                          src={INITIAL_USERS[2].avatar} 
                          alt="Mike" 
                          className="w-5 h-5 rounded-full object-cover border border-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Completed (Red Accent #f43f5e) */}
                <div 
                  className="bg-slate-50/90 dark:bg-slate-950/70 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800"
                  style={{ borderTop: '4px solid #f43f5e' }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      COMPLETED
                    </span>
                    <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full">
                      1
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs opacity-90">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-through text-slate-400">
                          Dark-Themed OTP Auth Modal
                        </h4>
                        <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          Shipped
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Auto-focus 4-digit verification inputs.
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                        <img 
                          src={INITIAL_USERS[3].avatar} 
                          alt="Emma" 
                          className="w-5 h-5 rounded-full object-cover border border-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="overflow-x-auto text-xs"
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black text-[10px]">
                      <th className="pb-3">Task</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Assignee</th>
                      <th className="pb-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">Implement Persona Switcher with Avatars</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold text-[10px]">In Progress</span></td>
                      <td className="py-3"><span className="text-rose-600 font-black text-[10px]">🔴 Urgent</span></td>
                      <td className="py-3">Sarah Chen (Admin)</td>
                      <td className="py-3 text-slate-500">2026-09-10</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">3-Column PDF Print Formatter</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded font-bold text-[10px]">To Do</span></td>
                      <td className="py-3"><span className="text-amber-600 font-black text-[10px]">🟡 High</span></td>
                      <td className="py-3">Alex Morgan (Owner)</td>
                      <td className="py-3 text-slate-500">2026-09-12</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">Command Palette ⌘K Quick Actions</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-bold text-[10px]">Completed</span></td>
                      <td className="py-3"><span className="text-blue-600 font-black text-[10px]">🟢 Medium</span></td>
                      <td className="py-3">Mike Ross (Member)</td>
                      <td className="py-3 text-slate-500">2026-09-08</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-7 gap-1.5 text-center text-xs"
              >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-[10px] font-black text-slate-400 py-1 uppercase">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 14 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-16 p-1 border border-slate-100 dark:border-slate-800 rounded-lg text-left bg-slate-50/50 dark:bg-slate-950/40 relative"
                  >
                    <span className="text-[10px] font-bold text-slate-400 block">{idx + 1}</span>
                    {idx === 2 && (
                      <span className="block text-[9px] font-bold p-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded mt-1 truncate">
                        Sprint Sync
                      </span>
                    )}
                    {idx === 5 && (
                      <span className="block text-[9px] font-bold p-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded mt-1 truncate">
                        PDF Release
                      </span>
                    )}
                    {idx === 9 && (
                      <span className="block text-[9px] font-bold p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded mt-1 truncate">
                        Demo Launch
                      </span>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>

    </section>
  );
}
