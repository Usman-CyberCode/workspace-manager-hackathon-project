'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 0,
      quote: "The 3-tone color-coded Kanban pipeline with yellow, green, and red borders gives our entire team instant visual clarity in standups. The PDF export is a game changer for executive stakeholder reviews.",
      author: "Marcus Brody",
      role: "VP of Engineering at HyperScale Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      company: "HyperScale",
      rating: 5,
    },
    {
      id: 1,
      quote: "Being able to immediately toggle personas between Owner, Admin, Member, and Viewer makes verifying access permissions a breeze without needing multiple incognito windows.",
      author: "Elena Rostova",
      role: "Head of Product at CloudNative",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      company: "CloudNative",
      rating: 5,
    },
    {
      id: 2,
      quote: "The ⌘K command palette combined with full offline sync makes the user experience feel blazing fast. Zero lag, crisp typography, and pixel-perfect design that actually feels like Linear.",
      author: "David Vance",
      role: "Staff Infrastructure Engineer at DevFlow",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      company: "DevFlow",
      rating: 5,
    },
    {
      id: 3,
      quote: "We replaced our cluttered project tools with Workspace Manager. Subtask checklists, markdown comments with @mentions, and instant undo/redo have made our sprint velocity surge.",
      author: "Amina Al-Mansoor",
      role: "Lead Agile Coach at NextGen Fintech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      company: "NextGen Fintech",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll carousel every 5 seconds unless paused on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.section 
      id="testimonials" 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="py-24 bg-slate-100/80 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 transition-colors overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            Social Proof
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight mb-4">
            Loved by High-Velocity Teams
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            See how engineering leads and agile teams streamline sprint delivery with Workspace Manager.
          </p>
        </motion.div>

        {/* Carousel Showcase Card */}
        <div className="max-w-4xl mx-auto relative">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl relative min-h-[280px] flex flex-col justify-between">
            
            <Quote className="absolute top-6 right-8 w-14 h-14 text-slate-100 dark:text-slate-800/80 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="relative z-10"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic mb-8">
                  "{testimonials[currentIndex].quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {testimonials[currentIndex].author}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {testimonials[currentIndex].company}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-8 bg-blue-600 dark:bg-blue-400'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  title={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                title="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                title="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
}
