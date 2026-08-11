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
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const navIcons: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, Calculator, GraduationCap,
  FlaskConical, Target, BarChart3, Settings,
};

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Semesters', path: '/semesters', icon: 'BookOpen' },
  { label: 'SGPA', path: '/sgpa', icon: 'Calculator' },
  { label: 'CGPA', path: '/cgpa', icon: 'GraduationCap' },
  { label: 'What-If', path: '/what-if', icon: 'FlaskConical' },
  { label: 'Target', path: '/target', icon: 'Target' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] h-screen sticky top-0 z-40"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-7">
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

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
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

      {/* Theme Toggle */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-[13px] font-medium transition-all duration-300"
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
    </aside>
  );
}
