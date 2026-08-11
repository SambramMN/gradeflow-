import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setLoading(false);
        if (tab === 'login') {
          addToast('Signed in successfully (Local Cloud Mode)', 'success');
        } else if (tab === 'register') {
          addToast('Account created successfully (Local Cloud Mode)', 'success');
        } else {
          addToast('Password reset link sent (Local Mode)', 'info');
        }
        onClose();
      }, 600);
      return;
    }

    try {
      if (tab === 'login') {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
        addToast('Signed in successfully', 'success');
        onClose();
      } else if (tab === 'register') {
        const { error } = await supabase!.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        addToast('Account created! Please check your email to confirm.', 'success');
        onClose();
      } else if (tab === 'forgot') {
        const { error } = await supabase!.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ text: 'Password reset link sent to your email.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Authentication error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="card max-w-md w-full p-6 relative overflow-hidden"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hover)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: 'var(--bg-card)' }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {isSupabaseConfigured
                ? 'Sync your academic profiles & data across all devices.'
                : 'Local Mode active. Set Supabase keys in .env for live Cloud Auth.'}
            </p>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-center gap-2 ${
                message.type === 'error'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sambhram M N"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {tab !== 'forgot' && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-heading font-semibold transition-all"
              style={{ background: '#c8ff00', color: '#0a0a0a' }}
            >
              {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : 'Send Reset Link'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Tab switchers */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-primary)] text-xs font-mono">
            {tab === 'login' ? (
              <>
                <button onClick={() => setTab('forgot')} style={{ color: 'var(--text-tertiary)' }}>
                  Forgot password?
                </button>
                <button onClick={() => setTab('register')} style={{ color: '#c8ff00' }}>
                  Create account →
                </button>
              </>
            ) : (
              <button onClick={() => setTab('login')} style={{ color: '#c8ff00' }} className="mx-auto">
                ← Back to Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
