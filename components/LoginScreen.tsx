'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setPendingEmail, verifyAndLogin } from '@/store';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { pendingVerificationEmail } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    dispatch(setPendingEmail(email));
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError('Please enter the full 4-digit verification code.');
      return;
    }
    // Verifying authentication code (Default accepted code: 1234 or any 4 digits)
    dispatch(verifyAndLogin({ email: pendingVerificationEmail || email }));
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl animate-scaleUp">
        
        {/* Branding Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl font-black text-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            D
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Dev on</h1>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Authentication Console</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: Email Input */}
        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Work Email Address
              </label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-3.5 text-sm text-white outline-none focus:border-blue-500 transition-all font-medium"
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-98 cursor-pointer"
            >
              Continue with Email ➔
            </button>
          </form>
        ) : (
          /* STEP 2: Verification Code Input */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <h3 className="text-sm font-extrabold text-white mb-1">Enter Verification Code</h3>
              <p className="text-xs text-slate-400">
                Code sent to <span className="text-blue-400 font-bold">{pendingVerificationEmail}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-14 bg-slate-900 border border-slate-700 rounded-2xl text-center text-xl font-black text-blue-400 outline-none focus:border-blue-500 transition-all"
                />
              ))}
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-98 cursor-pointer"
            >
              Verify & Launch Workspace 🚀
            </button>

            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className="w-full text-center text-xs font-bold text-slate-400 hover:text-white transition-all"
            >
              ← Change Email
            </button>
          </form>
        )}

      </div>
    </div>
  );
}