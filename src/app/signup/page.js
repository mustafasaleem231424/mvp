'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Mail } from 'lucide-react';
import { signUp } from '@/lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { error: authError } = await signUp(email, password);
      if (authError) { setError(authError.message); return; }
      setSuccess(true);
    } catch { setError('Something went wrong.'); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-[#F2F7F0] border border-[rgba(33,160,73,0.2)] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-[#21A049]" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 text-[var(--green-dark)]">Check Your Email</h2>
          <p className="mb-8 text-[var(--text-secondary)] text-lg">
            We sent a confirmation link to <strong className="text-[var(--text)]">{email}</strong>.
          </p>
          <Link href="/login" className="btn btn-primary">Go to Login <ArrowRight className="w-5 h-5" /></Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#21A049] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21A049] to-[#124022] flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-[var(--green-dark)]">PreciFarm AI</span>
          </Link>
          <p className="text-[var(--text-secondary)] text-lg">Create your free account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl text-sm font-medium bg-[#FFEBEE] text-[#D32F2F] border border-[rgba(211,47,47,0.2)]">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="signup-email" className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/40">Email</label>
              <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                className="w-full px-5 py-4 rounded-2xl border text-base bg-white/5 focus:ring-2 focus:ring-[#21A049]/30 focus:border-[#21A049] outline-none transition-all placeholder:text-white/20"
                style={{ borderColor: 'var(--border)' }}
                placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/40">Password</label>
              <input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" minLength={6}
                className="w-full px-5 py-4 rounded-2xl border text-base bg-white/5 focus:ring-2 focus:ring-[#21A049]/30 focus:border-[#21A049] outline-none transition-all placeholder:text-white/20"
                style={{ borderColor: 'var(--border)' }}
                placeholder="At least 6 characters" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full !py-4 disabled:opacity-50 shadow-lg">
              {loading ? 'Creating account...' : <><span>Create Account</span> <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#21A049] hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
