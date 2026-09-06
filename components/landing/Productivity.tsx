'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Command, 
  Keyboard, 
  Undo2, 
  WifiOff, 
  FileCode2, 
  FileDown, 
  CheckCircle2, 
  Zap,
  Sparkles
} from 'lucide-react';

export default function Productivity() {
  const tools = [
    {
      icon: Command,
      badge: '⌘K / Ctrl+K',
      title: 'Global Command Palette',
      description: 'Search tasks, switch projects, trigger status updates, and execute bulk actions instantaneously without touching your mouse.',
      detail: 'Fuzzy task search • Modal hotkeys • Instant navigation',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-800',
    },
    {
      icon: Keyboard,
      badge: 'Speed Keys',
      title: 'Power Keyboard Shortcuts',
      description: 'Built for developers. Press "N" for new task, "P" for priority filter, "?" for shortcut overlay, and ESC to exit modals.',
      detail: 'N = New Task • P = Filter • ? = Cheatsheet',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/50 border-violet-200/80 dark:border-violet-800',
    },
    {
      icon: Undo2,
      badge: 'Ctrl+Z / Ctrl+Y',
      title: 'Deep Multi-Step Undo / Redo',
      description: 'Never fear accidental task moves or checklist deletions. The optimistic history stack lets you jump backward and forward flawlessly.',
      detail: '10+ step stack • Non-destructive • Instant rollback',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800',
    },
    {
      icon: WifiOff,
      badge: 'Offline-First',
      title: 'Offline Indicator & Auto-Sync',
      description: 'Network outages won\'t stop your sprint. Workspace Manager automatically saves dirty states locally and validates sync upon reconnect.',
      detail: 'LocalStorage replica • 0 Data loss • Status banner',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-800',
    },
    {
      icon: FileCode2,
      badge: 'Data Portability',
      title: 'JSON Workspace Export & Import',
      description: 'Own your data completely. Export entire workspaces into portable JSON files with one click, or restore previous backups on any machine.',
      detail: 'Complete backup • Schema validated • 1-click restore',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.section 
      id="productivity" 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-black uppercase tracking-wider mb-3">
          Developer Flow
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight mb-4">
          Speed as a Feature
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
          Cut out mouse clicks and loading spinners. Everything in Workspace Manager is built for near-instant keyboard responsiveness.
        </p>
      </motion.div>

      {/* Grid of Productivity Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
      >
        {tools.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs ${item.bg}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400">
                {item.detail}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

    </motion.section>
  );
}
