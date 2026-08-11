import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, GitCompare, BarChart3, Settings } from 'lucide-react';

const items = [
  { label: 'Home', path: '/', icon: LayoutDashboard },
  { label: 'Semesters', path: '/semesters', icon: BookOpen },
  { label: 'Compare', path: '/compare', icon: GitCompare },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        backdropFilter: 'blur(20px)',
      }}>
      <div className="flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobile-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'var(--accent-dim)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  className="w-[18px] h-[18px] relative z-10"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                />
                <span
                  className="text-[10px] font-heading font-medium relative z-10"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
