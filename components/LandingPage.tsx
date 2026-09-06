'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, verifyAndLogin, toggleTheme } from '@/store';
import LoginScreen from './LoginScreen';

// Modular Section Components
import LandingNavbar from './landing/LandingNavbar';
import Hero from './landing/Hero';
import Features from './landing/Features';
import ViewsShowcase from './landing/ViewsShowcase';
import Collaboration from './landing/Collaboration';
import Productivity from './landing/Productivity';
import Testimonials from './landing/Testimonials';
import CtaBanner from './landing/CtaBanner';
import Footer from './landing/Footer';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLaunchDemo = () => {
    dispatch(verifyAndLogin({ email: 'alex@devon.io' }));
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-x-hidden transition-colors duration-200">
      
      {/* 1. Navbar */}
      <LandingNavbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setShowAuthModal(true)}
        onLaunchDemo={handleLaunchDemo}
      />

      {/* 2. Hero Section */}
      <Hero
        onOpenAuth={() => setShowAuthModal(true)}
        onLaunchDemo={handleLaunchDemo}
      />

      {/* 3. Feature Highlights Grid */}
      <Features />

      {/* 4. Multiple Views, One Source of Truth */}
      <ViewsShowcase />

      {/* 5. Collaboration Section */}
      <Collaboration />

      {/* 6. Productivity & UX Section */}
      <Productivity />

      {/* 7. Testimonials & Social Proof */}
      <Testimonials />

      {/* 8. Final CTA Banner */}
      <CtaBanner
        onOpenAuth={() => setShowAuthModal(true)}
        onLaunchDemo={handleLaunchDemo}
      />

      {/* 9. Footer */}
      <Footer onOpenAuth={() => setShowAuthModal(true)} />

      {/* Auth Screen Modal */}
      {showAuthModal && (
        <LoginScreen onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
}
