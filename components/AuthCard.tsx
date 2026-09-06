'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { verifyAndLogin, signUpUser, addToast } from '@/store';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface AuthCardProps {
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthCard({ onClose, initialMode = 'login' }: AuthCardProps) {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
    setErrorMessage('');
  }, [initialMode]);

  // Form states
  const [loginEmail, setLoginEmail] = useState('alex@devon.io');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShakeKey((prev) => prev + 1);
    dispatch(addToast({ message: msg, type: 'error' }));
  };

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      triggerError('Please enter a valid work email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch(verifyAndLogin({ email: loginEmail }));
      dispatch(addToast({ message: `Welcome back, ${loginEmail}!`, type: 'success' }));
      setLoading(false);
      if (onClose) onClose();
    }, 450);
  };

  // Handle Sign Up submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!signUpName.trim()) {
      triggerError('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      triggerError('Please enter a valid work email.');
      return;
    }
    if (signUpPassword.length < 6) {
      triggerError('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      triggerError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      dispatch(signUpUser({
        name: signUpName,
        email: signUpEmail,
        role: 'member',
      }));
      dispatch(verifyAndLogin({ email: signUpEmail }));
      dispatch(addToast({ message: `Account created! Welcome, ${signUpName}.`, type: 'success' }));
      setLoading(false);
      if (onClose) onClose();
    }, 450);
  };

  // 1-Click Quick Demo Login (Alex Morgan)
  const handleDemoLogin = (userEmail: string = 'alex@devon.io') => {
    setErrorMessage('');
    dispatch(verifyAndLogin({ email: userEmail }));
    dispatch(addToast({ message: 'Logged in as Demo Persona (Alex Morgan - Owner)', type: 'success' }));
    if (onClose) onClose();
  };

  // Framer Motion variants for form inputs stagger
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.12,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const } 
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg overflow-hidden animate-fadeIn select-none">
      
      {/* =========================================================================
          ANIMATION MODULE: Ambient Glowing Orbs & Interactive Floating Particles
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Aurora Orb 1 (Top Left) */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -35, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-600/25 to-indigo-600/30 rounded-full blur-3xl"
        />

        {/* Floating Aurora Orb 2 (Bottom Right) */}
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 35, -20, 0],
            scale: [1, 1.25, 0.95, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-violet-600/25 to-pink-600/20 rounded-full blur-3xl"
        />

        {/* Floating Particle Sparks (Subtle Shimmer) */}
        {[
          { top: '15%', left: '20%', size: 4, delay: 0 },
          { top: '25%', left: '80%', size: 3, delay: 1.2 },
          { top: '75%', left: '15%', size: 5, delay: 2.4 },
          { top: '80%', left: '70%', size: 4, delay: 0.8 },
          { top: '50%', left: '90%', size: 3, delay: 1.8 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
            }}
            className="absolute rounded-full bg-blue-400 shadow-md shadow-blue-400/50"
          />
        ))}
      </div>

      {/* Outer Card Container with Smooth Spring 3D-feel Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[880px] min-h-[580px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-black/40 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row z-10"
      >
        
        {/* Close Modal Button with Hover Micro-Animation */}
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-40 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}

        {/* Mobile & Small Screen Mode Switcher Header */}
        <div className="md:hidden p-4 pb-0 flex justify-center">
          <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-1 w-full max-w-xs">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
                !isSignUp ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {!isSignUp && (
                <motion.div
                  layoutId="mobileAuthTabIndicator"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
                isSignUp ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {isSignUp && (
                <motion.div
                  layoutId="mobileAuthTabIndicator"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">Create Account</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            1. LEFT FORM CONTAINER: Sign In / Login
            ========================================================================= */}
        <div className={`w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between transition-all duration-300 ${
          isSignUp ? 'md:pointer-events-none md:opacity-0 md:translate-x-4' : 'opacity-100 translate-x-0'
        }`}>
          <div>
            {/* Branding Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 cursor-pointer"
              >
                W
              </motion.div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
                    Workspace Manager
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                    Console
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight mb-1">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
              Enter your credentials to launch your sprint boards and pipelines.
            </p>

            {/* Animated Validation Error Shake Box */}
            <AnimatePresence>
              {errorMessage && !isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-2.5 text-rose-600 dark:text-rose-400 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form with Error Shake Motion */}
            <motion.div
              key={shakeKey}
              animate={shakeKey > 0 && !isSignUp ? { x: [-10, 10, -7, 7, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <motion.form 
                variants={formVariants} 
                initial="hidden" 
                animate={!isSignUp ? "visible" : "hidden"}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                {/* Email Input */}
                <motion.div variants={inputVariants} className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Work Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setErrorMessage(''); }}
                      placeholder="alex@devon.io"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:scale-[1.01]"
                    />
                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div variants={inputVariants} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Password
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); dispatch(addToast({ message: 'Password reset link sent to registered email.', type: 'info' })); }} 
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => { setLoginPassword(e.target.value); setErrorMessage(''); }}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:scale-[1.01]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-transform active:scale-90"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Login Button */}
                <motion.div variants={inputVariants} className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authenticating Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Quick 1-Click Demo Login with Animated Badge */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleDemoLogin('alex@devon.io')}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-950/60 text-slate-800 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs group"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                <span>1-Click Live Demo (Alex Morgan - Owner)</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Switch to Sign Up */}
          <div className="mt-5 text-center md:hidden text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
              className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. RIGHT FORM CONTAINER: Sign Up / Register
            ========================================================================= */}
        <div className={`w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between transition-all duration-300 ${
          !isSignUp ? 'md:pointer-events-none md:opacity-0 md:-translate-x-4' : 'opacity-100 translate-x-0'
        }`}>
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-violet-500/20 cursor-pointer"
              >
                W
              </motion.div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
                    Workspace Manager
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                    Registration
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight mb-1">
              Create Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
              Get started with pre-seeded personas, kanban boards, and PDF exports.
            </p>

            {/* Animated Validation Error Shake Box */}
            <AnimatePresence>
              {errorMessage && isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-3 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign Up Form with Error Shake Motion */}
            <motion.div
              key={shakeKey}
              animate={shakeKey > 0 && isSignUp ? { x: [-10, 10, -7, 7, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <motion.form 
                variants={formVariants} 
                initial="hidden" 
                animate={isSignUp ? "visible" : "hidden"}
                onSubmit={handleSignUp}
                className="space-y-3"
              >
                {/* Full Name */}
                <motion.div variants={inputVariants} className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => { setSignUpName(e.target.value); setErrorMessage(''); }}
                      placeholder="Jordan Lee"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:scale-[1.01]"
                    />
                  </div>
                </motion.div>

                {/* Work Email */}
                <motion.div variants={inputVariants} className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Work Email
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => { setSignUpEmail(e.target.value); setErrorMessage(''); }}
                      placeholder="jordan@company.io"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:scale-[1.01]"
                    />
                  </div>
                </motion.div>

                {/* Password Fields in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.div variants={inputVariants} className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={signUpPassword}
                        onChange={(e) => { setSignUpPassword(e.target.value); setErrorMessage(''); }}
                        placeholder="Min 6 chars"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:scale-[1.01]"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={inputVariants} className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Confirm
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={signUpConfirmPassword}
                        onChange={(e) => { setSignUpConfirmPassword(e.target.value); setErrorMessage(''); }}
                        placeholder="Re-type"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:scale-[1.01]"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Submit Sign Up Button */}
                <motion.div variants={inputVariants} className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Workspace Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Free Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>

          {/* Mobile Switch to Sign In */}
          <div className="mt-4 text-center md:hidden text-xs text-slate-500">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
              className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. DESKTOP SLIDING OVERLAY PANEL (Deepak Yadav Dribbble Style with Animations)
            ========================================================================= */}
        <motion.div
          animate={{
            x: isSignUp ? '-100%' : '0%',
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1], // Custom smooth cubic bezier
          }}
          className="hidden md:flex absolute top-0 right-0 w-1/2 h-full z-30 flex-col items-center justify-center p-12 text-center text-white bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-2xl pointer-events-auto overflow-hidden"
        >
          
          {/* Subtle Ambient Decorative Glow Rings */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/25 rounded-full blur-2xl pointer-events-none" 
          />

          <AnimatePresence mode="wait">
            {!isSignUp ? (
              // PANEL CONTENT 1: Invite to Sign Up
              <motion.div
                key="welcome-friend"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 max-w-xs space-y-4"
              >
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto shadow-inner backdrop-blur-xs"
                >
                  <Sparkles className="w-7 h-7 text-amber-300" />
                </motion.div>

                <h3 className="text-2xl lg:text-3xl font-black tracking-tight">
                  Hello, Friend!
                </h3>

                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Enter your details and start your journey with fast, agile sprint boards, dense tables, and live collaboration.
                </p>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
                    className="px-8 py-3 rounded-2xl border-2 border-white text-white font-extrabold text-xs uppercase tracking-wider hover:bg-white hover:text-indigo-700 transition-all cursor-pointer shadow-lg shadow-black/15"
                  >
                    Create Account
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              // PANEL CONTENT 2: Welcome Back (Invite to Login)
              <motion.div
                key="welcome-back"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 max-w-xs space-y-4"
              >
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto shadow-inner backdrop-blur-xs"
                >
                  <ShieldCheck className="w-7 h-7 text-emerald-300" />
                </motion.div>

                <h3 className="text-2xl lg:text-3xl font-black tracking-tight">
                  Welcome Back!
                </h3>

                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  To keep connected with your project pipelines, please log in with your work email credentials.
                </p>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
                    className="px-8 py-3 rounded-2xl border-2 border-white text-white font-extrabold text-xs uppercase tracking-wider hover:bg-white hover:text-indigo-700 transition-all cursor-pointer shadow-lg shadow-black/15"
                  >
                    Sign In
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </motion.div>
    </div>
  );
}
