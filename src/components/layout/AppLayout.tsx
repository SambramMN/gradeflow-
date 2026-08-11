import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';
import { CustomCursor } from '../ui/CustomCursor';
import { useApp } from '../../context/AppContext';

export function AppLayout() {
  const { state, removeToast } = useApp();
  const location = useLocation();

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Mesh gradient background */}
      <div className="mesh-bg" />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Custom cursor */}
      <CustomCursor />

      <Sidebar />
      <main className="flex-1 min-h-screen pb-24 lg:pb-0 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav />
      <ToastContainer toasts={state.toasts} onRemove={removeToast} />
    </div>
  );
}
