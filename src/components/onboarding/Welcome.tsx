import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Target, Sparkles, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Stagger word animation
function AnimatedText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

const features = [
  { icon: BarChart3, label: 'Live Analytics' },
  { icon: Target, label: 'Goal Tracking' },
  { icon: Sparkles, label: 'What-If Simulator' },
  { icon: GraduationCap, label: 'Multi-Semester' },
];

export function Welcome() {
  const { addSemester, setOnboarded } = useApp();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    addSemester();
    setOnboarded();
    navigate('/semesters');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,255,0,0.15) 0%, transparent 70%)' }} />

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-primary)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
          <span className="text-xs font-medium font-heading tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Academic Performance Tracker
          </span>
        </motion.div>

        {/* Hero Typography */}
        <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.9] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
          <AnimatedText text="YOUR ACADEMIC" delay={0.2} />
          <br />
          <AnimatedText text="PERFORMANCE." delay={0.4} />
          <br />
          <span className="text-gradient-accent">
            <AnimatedText text="VISUALIZED." delay={0.6} />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          Track your GPA, analyze semester trends, simulate future outcomes,
          and set strategic academic goals — all in one premium dashboard.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGetStarted}
            data-magnetic
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold font-heading transition-all duration-300"
            style={{
              background: '#c8ff00',
              color: '#0a0a0a',
              boxShadow: '0 0 30px rgba(200,255,0,0.15)',
            }}
          >
            Start Calculating
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setOnboarded(); navigate('/'); }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-medium font-heading transition-all duration-300"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            Explore Dashboard
          </motion.button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.5 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <f.icon className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-xs font-medium font-heading" style={{ color: 'var(--text-secondary)' }}>
                {f.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-[11px] mt-10"
          style={{ color: 'var(--text-muted)' }}
        >
          100% private — your data never leaves your device.
        </motion.p>
      </div>
    </div>
  );
}
