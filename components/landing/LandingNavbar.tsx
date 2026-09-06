'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  Layers,
  LayoutGrid,
  CreditCard,
  FileText,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLaunchDemo: () => void;
}

export default function LandingNavbar({
  theme,
  onToggleTheme,
  onOpenAuth,
  onLaunchDemo,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features', icon: LayoutGrid },
    { name: 'Views', href: '#views', icon: Layers },
    { name: 'Pricing', href: '#pricing', icon: CreditCard },
    { name: 'Docs', href: '#productivity', icon: FileText },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 sm:py-3'
          : 'bg-white/60 dark:bg-slate-950/60 backdrop-blur-xs border-b border-slate-200/40 dark:border-slate-800/40 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            W
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 dark:text-white truncate">
                Workspace Manager
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 shrink-0">
                PRO
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:block -mt-0.5 tracking-wider uppercase truncate">
              By Dev on Technologies
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Visible on lg+ displays to prevent tablet squishing) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1 font-medium"
            >
              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </motion.button>

          {/* Login Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span>Login</span>
          </button>

          {/* 1-Click Live Demo */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLaunchDemo}
            className="px-3 sm:px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs"
            title="Try full dashboard with sample data in 1-click"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Live Demo</span>
            <span className="md:hidden">Demo</span>
          </motion.button>

          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenAuth('signup')}
            className="px-3.5 sm:px-4 py-2 text-xs font-black bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Mobile View Navigation Cluster (<sm) */}
        <div className="flex sm:hidden items-center gap-1.5">
          
          {/* Quick 1-Click Demo on Mobile */}
          <button
            onClick={onLaunchDemo}
            className="px-2.5 py-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center gap-1 cursor-pointer"
            title="Launch Demo"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Demo</span>
          </button>

          {/* Mobile Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Hamburger Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 shadow-xl"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
              Navigation
            </div>
            
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                  <span>{link.name}</span>
                </a>
              );
            })}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 text-slate-800 dark:text-slate-200"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Sign In / Login</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchDemo();
                }}
                className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-blue-200/80 dark:border-blue-900"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Launch Live Demo</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
