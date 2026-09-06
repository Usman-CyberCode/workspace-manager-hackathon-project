'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface CTAProps {
  onOpenAuth: () => void;
  onLaunchDemo: () => void;
}

export default function CTA({ onOpenAuth, onLaunchDemo }: CTAProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center"
    >
      
      {/* Animated Moving Gradient Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl p-10 sm:p-16 shadow-2xl border border-slate-800 overflow-hidden text-white bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 animate-gradient-shift"
      >
        
        {/* Animated Moving Aurora Glow Orbs */}
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 35, -25, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-extrabold text-xs uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Instant Setup • Zero External Dependencies</span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-[1.1] text-white">
            Start organizing your work today.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience Notion-style clarity paired with Jira sprint velocity.
            Pre-seeded with 4 multi-role personas, sprint templates, and 3-tone color pipelines.
          </p>

          {/* CTA Buttons with hover scale */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Started with OTP</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-extrabold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Launch Live Demo (1-Click)</span>
            </motion.button>
          </div>

          {/* Trust Value Props */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 14 Capstone Domains pre-loaded
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline data resilience
            </span>
          </div>

        </div>

      </motion.div>
    </motion.section>
  );
}
