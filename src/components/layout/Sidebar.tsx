import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  GraduationCap,
  FlaskConical,
  Target,
  BarChart3,
  GitCompare,
  Settings,
  Sun,
  Moon,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { ProfileSwitcher } from '../profile/ProfileSwitcher';
import { AuthModal } from '../auth/AuthModal';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const navIcons: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, Calculator, GraduationCap,
  FlaskConical, Target, BarChart3, GitCompare, Settings,
};

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Semesters', path: '/semesters', icon: 'BookOpen' },
  { label: 'Compare', path: '/compare', icon: 'GitCompare' },
  { label: 'SGPA', path: '/sgpa', icon: 'Calculator' },
  { label: 'CGPA', path: '/cgpa', icon: 'GraduationCap' },
  { label: 'What-If', path: '/what-if', icon: 'FlaskConical' },
  { label: 'Target', path: '/target', icon: 'Target' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-[230px] h-screen sticky top-0 z-40"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)' }}>

      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #c8ff00, #a3e635)' }}>
            <GraduationCap className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-heading" style={{ color: 'var(--text-primary)' }}>
              GradeFlow
            </h1>
          </div>
        </div>
      </div>

      {/* Profile Switcher */}
      <div className="px-3 pb-3">
        <ProfileSwitcher />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto border-t border-[var(--border-primary)] pt-3">
        {navItems.map((item) => {
          const Icon = navIcons[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                  isActive
                    ? ''
                    : 'hover:bg-[var(--bg-card-hover)]'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-hover)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" style={{ opacity: isActive ? 1 : 0.5 }} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full relative z-10"
                      style={{ background: '#c8ff00' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Cloud & Theme Toggle */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 w-full rounded-xl text-xs font-medium transition-all duration-300"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {isSupabaseConfigured ? (
            <Cloud className="w-4 h-4 text-emerald-400" />
          ) : (
            <CloudOff className="w-4 h-4" style={{ opacity: 0.5 }} />
          )}
          <span>{isSupabaseConfigured ? 'Cloud Sync' : 'Local Mode'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-1.5 w-full rounded-xl text-xs font-medium transition-all duration-300"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" style={{ opacity: 0.5 }} />
          ) : (
            <Moon className="w-4 h-4" style={{ opacity: 0.5 }} />
          )}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </aside>
  );
}
