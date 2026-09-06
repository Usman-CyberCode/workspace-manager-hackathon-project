'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Kanban,
  TableProperties,
  CalendarDays,
  ShieldCheck,
  MessageSquare,
  History,
  Bell,
  Command,
  WifiOff,
  Undo2,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Kanban,
      title: 'Kanban Board with Drag & Drop',
      description: '3-tone color pipelines (Yellow To Do, Green In Progress, Red Completed) with subtask progress bars and fluid card reordering.',
      badge: 'Interactive DND',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60',
    },
    {
      icon: TableProperties,
      title: 'List & Table View',
      description: 'Dense tabular layout with multi-attribute sorting (Due Date, Priority, Created At) and quick inline status selectors.',
      badge: 'Sort & Group',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60',
    },
    {
      icon: CalendarDays,
      title: 'Calendar Schedule View',
      description: 'Visual day-by-day deadline map and milestone tracker. Spot schedule conflicts and reschedule sprints at a glance.',
      badge: 'Timeline',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/60',
    },
    {
      icon: ShieldCheck,
      title: 'Roles & Permissions',
      description: 'Granular RBAC across 4 personas: Owner, Admin, Member, and Viewer. Real-time UI permission gating prevents unauthorized edits.',
      badge: 'RBAC Security',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60',
    },
    {
      icon: MessageSquare,
      title: 'Comments & @Mentions',
      description: 'Rich contextual conversations directly on task cards with avatar previews, formatted timestamps, and @mention tags.',
      badge: 'Collaboration',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/60',
    },
    {
      icon: History,
      title: 'Activity Log & Audit Trail',
      description: 'Comprehensive audit trail tracking every task creation, column change, comment, and attachment with timestamped history.',
      badge: 'Full History',
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-900/60',
    },
    {
      icon: Bell,
      title: 'Live In-App Notifications',
      description: 'Central notification bell with unread counter badges, instant popover preview, and one-click "Mark all as read".',
      badge: 'Real-Time Alerts',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60',
    },
    {
      icon: Command,
      title: 'Command Palette (⌘K)',
      description: 'Power-user search and quick command launcher. Search tasks, switch active views, trigger modals, and filter by priority.',
      badge: '⌘K / Ctrl+K',
      color: 'text-slate-800 dark:text-slate-200',
      bg: 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700',
    },
    {
      icon: WifiOff,
      title: 'Offline Support & Sync',
      description: 'Full client-side persistence with LocalStorage backup. Queues updates during network drops and syncs cleanly upon reconnect.',
      badge: 'Local-First',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/80 dark:border-teal-900/60',
    },
    {
      icon: Undo2,
      title: 'Undo & Redo History',
      description: 'Deep multi-step history stack (Ctrl+Z / Ctrl+Y) with optimistic UI updates. Safely revert accidental drags or task changes.',
      badge: 'Non-Destructive',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
      id="features" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-24 bg-white dark:bg-slate-900/70 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10 Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight mb-4">
            Everything your sprint demands. <br />
            <span className="text-slate-400 dark:text-slate-500 font-extrabold">
              Nothing you don't.
            </span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Architected specifically to satisfy all 14 Capstone domains without relying on sluggish external database roundtrips.
          </p>
        </motion.div>

        {/* Features Staggered Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -3 }}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs ${item.bg}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Domain #{index + 1}</span>
                  <span className="text-emerald-500 font-extrabold">Active ✓</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </motion.section>
  );
}
