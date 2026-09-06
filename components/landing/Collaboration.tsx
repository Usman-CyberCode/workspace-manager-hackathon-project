'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  History, 
  ShieldCheck, 
  AtSign, 
  Check, 
  Clock, 
  Sparkles,
  Lock,
  Eye,
  Edit3
} from 'lucide-react';
import { INITIAL_USERS } from '@/lib/mockdata';

export default function Collaboration() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.45, ease: 'easeOut' as const } 
    },
  };

  return (
    <motion.section 
      id="collaboration" 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="py-24 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
            Team Dynamics
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight mb-4">
            Collaboration with Zero Friction
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Simulate realistic engineering teamwork: verify role security policies, discuss tasks with inline @mentions, and audit every change.
          </p>
        </motion.div>

        {/* 3 Column Showcase Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          
          {/* CARD 1: Role-Based Access States */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Domain #2 • RBAC Personas
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1.5">
                Role-Based Access States
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-5">
                Four pre-configured personas let you instantly test read/write boundaries without creating mock accounts.
              </p>

              {/* Persona List */}
              <div className="space-y-2.5">
                {INITIAL_USERS.map((user) => (
                  <div
                    key={user.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {user.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          user.role === 'owner'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                            : user.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300'
                            : user.role === 'member'
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.role === 'viewer' ? (
                        <span title="Read Only">
                          <Eye className="w-3 h-3 text-slate-400" />
                        </span>
                      ) : (
                        <span title="Full Edit">
                          <Edit3 className="w-3 h-3 text-emerald-500" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <span>Viewer restrictions auto-enforced</span>
              <span className="text-emerald-500 font-extrabold">Active Guard ✓</span>
            </div>
          </motion.div>

          {/* CARD 2: Comments & @Mention Autocomplete */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Domain #8 • Contextual Threads
                </span>
                <AtSign className="w-4 h-4 text-violet-500" />
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1.5">
                Comments & @Mentions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-5">
                Discuss blockers right where work happens. Type "@" to trigger smart member autocomplete popovers.
              </p>

              {/* Mock Comment Thread */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
                
                {/* Comment 1 */}
                <div className="flex items-start gap-2.5">
                  <img src={INITIAL_USERS[1].avatar} alt="Sarah" className="w-7 h-7 rounded-full object-cover mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Sarah Chen</span>
                      <span className="text-[10px] text-slate-400">12m ago</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">
                      Hey <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded">@Alex Morgan</span>, verify the print styling on the 3-tone columns.
                    </p>
                  </div>
                </div>

                {/* Comment 2 */}
                <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                  <img src={INITIAL_USERS[0].avatar} alt="Alex" className="w-7 h-7 rounded-full object-cover mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Alex Morgan</span>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">
                      Checked! Yellow, green, and red columns scale into a crisp PDF sprint report.
                    </p>
                  </div>
                </div>

                {/* Simulated @Mention Popup */}
                <div className="mt-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">@Mi...</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Mike Ross (Frontend)</span>
                  </div>
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold px-1.5 py-0.5 rounded">
                    Press Tab ⇥
                  </span>
                </div>

              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <span>Real-time in-app alerts on @mentions</span>
              <span className="text-blue-500 font-extrabold">Instant Notification ✓</span>
            </div>
          </motion.div>

          {/* CARD 3: Activity Feed & Audit Trail */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Domain #9 • Audit Stream
                </span>
                <History className="w-4 h-4 text-cyan-500" />
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1.5">
                Activity Log & Audit Trail
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-5">
                Every drag, status transition, checklist toggle, and attachment is preserved in an immutable audit timeline.
              </p>

              {/* Activity Items */}
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <div className="truncate flex-1">
                    <span className="font-bold text-slate-900 dark:text-white">Alex</span>
                    <span className="text-slate-500 dark:text-slate-400"> moved card to </span>
                    <span className="font-bold text-emerald-600">In Progress</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">2m ago</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <div className="truncate flex-1">
                    <span className="font-bold text-slate-900 dark:text-white">Sarah</span>
                    <span className="text-slate-500 dark:text-slate-400"> completed 3 checklist items</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">14m ago</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <div className="truncate flex-1">
                    <span className="font-bold text-slate-900 dark:text-white">Mike</span>
                    <span className="text-slate-500 dark:text-slate-400"> exported sprint PDF report</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">45m ago</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 opacity-75">
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                  <div className="truncate flex-1">
                    <span className="font-bold text-slate-900 dark:text-white">Emma</span>
                    <span className="text-slate-500 dark:text-slate-400"> viewed workspace</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">1h ago</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <span>Auto-logged across all actions</span>
              <span className="text-cyan-500 font-extrabold">Audit Live ✓</span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </motion.section>
  );
}
