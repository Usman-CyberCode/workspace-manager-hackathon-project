'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setPendingEmail, verifyAndLogin, signUpUser } from '@/store';
import { INITIAL_USERS } from '@/lib/mockdata';

interface LoginScreenProps {
  onClose?: () => void;
}

export default function LoginScreen({ onClose }: LoginScreenProps) {
  const dispatch = useDispatch();
  const { pendingVerificationEmail } = useSelector((state: RootState) => state.auth);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'owner' | 'admin' | 'member' | 'viewer'>('member');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your full name for sign up.');
      return;
    }
    setError('');
    dispatch(setPendingEmail(email));
    setStep('otp');
    setResendTimer(30);
    // Focus first OTP field
    setTimeout(() => inputRefs[0].current?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Single character only
    const char = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-focus next input
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs[3].current?.focus();
    }
  };

  const handleFillDemoCode = () => {
    setOtp(['1', '2', '3', '4']);
    setError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError('Please enter the complete 4-digit verification code.');
      return;
    }

    if (mode === 'signup') {
      dispatch(signUpUser({ name, email, role }));
    } else {
      dispatch(verifyAndLogin({ email: pendingVerificationEmail || email }));
    }
    if (onClose) onClose();
  };

  const handleSelectQuickUser = (userEmail: string) => {
    setEmail(userEmail);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 font-sans text-slate-100 animate-fadeIn">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative animate-scaleUp">
        
        {/* Close Button if opened as modal */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            ✕
          </button>
        )}

        {/* Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 text-slate-950 rounded-2xl font-black text-lg flex items-center justify-center shadow-lg">
            D
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Dev on</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authentication Console</p>
          </div>
        </div>

        {/* Login / Sign Up Tabs */}
        {step === 'credentials' && (
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: Email / Credentials */}
        {step === 'credentials' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Alex Morgan" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-slate-500 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Default Persona Role
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-slate-500 transition-all font-bold"
                  >
                    <option value="owner">👑 Owner (Full permissions)</option>
                    <option value="admin">🛡️ Admin (Workspace & Project edits)</option>
                    <option value="member">💻 Member (Task edits & comments)</option>
                    <option value="viewer">👁️ Viewer (Read-only)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Email Address
              </label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-slate-500 transition-all font-medium"
                autoFocus
                required
              />
            </div>

            {/* Mock User Quick Selector */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                ⚡ Quick Pick Mock Personas
              </span>
              <div className="grid grid-cols-2 gap-2">
                {INITIAL_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectQuickUser(u.email)}
                    className={`p-2 rounded-xl border text-left text-[11px] transition-all cursor-pointer flex items-center gap-2 ${
                      email === u.email 
                        ? 'border-blue-500 bg-blue-500/10 text-white' 
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <img 
                      src={u.avatar} 
                      alt={u.name} 
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="truncate">
                      <div className="font-bold truncate text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{u.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 mt-4 bg-white hover:bg-slate-200 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              Continue with OTP ➔
            </button>
          </form>
        ) : (
          /* STEP 2: 4-Digit OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center">
              <h3 className="text-sm font-extrabold text-white mb-1">Enter 4-Digit Verification Code</h3>
              <p className="text-xs text-slate-400">
                Code sent to <span className="text-white font-bold">{pendingVerificationEmail || email}</span>
              </p>
            </div>

            {/* 4 Auto-focus OTP Input Boxes */}
            <div className="flex justify-center gap-3 my-4" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-16 bg-slate-950 border border-slate-800 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Helper Button */}
            <div className="flex items-center justify-between text-xs px-1">
              <button
                type="button"
                onClick={handleFillDemoCode}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                ⚡ Fill Demo Code (1234)
              </button>

              <span className="text-[11px] text-slate-500">
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : (
                  <button 
                    type="button" 
                    onClick={() => setResendTimer(30)} 
                    className="text-white hover:underline font-bold"
                  >
                    Resend Code
                  </button>
                )}
              </span>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-900/30 transition-all active:scale-98 cursor-pointer"
            >
              Verify & Launch Workspace 🚀
            </button>

            <button 
              type="button" 
              onClick={() => setStep('credentials')} 
              className="w-full text-center text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              ← Change Email
            </button>
          </form>
        )}

      </div>
    </div>
  );
}