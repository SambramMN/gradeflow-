import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { EmptyState } from '../ui/EmptyState';
import {
  calculateCGPA,
  getClassification,
  getClassificationColor,
} from '../../lib/calculations';
import { GraduationCap, BookOpen, Percent, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function CGPACalculator() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { semesters, settings } = state;

  const result = calculateCGPA(semesters, settings.cgpaToPercentageMultiplier);
  const validSemesters = semesters.filter((s) => s.subjects.length > 0 && s.totalCredits > 0);

  if (validSemesters.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Cumulative Metric
          </p>
          <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            CGPA <span className="text-gradient-accent">Calculator</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Cumulative Grade Point Average across all semesters
          </p>
        </div>
        <EmptyState
          icon={GraduationCap}
          title="No semester data available"
          description="Add subjects to your semesters first, then come back to see your CGPA."
          action={
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/semesters')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold font-heading transition-colors"
              style={{ background: '#c8ff00', color: '#0a0a0a' }}
            >
              Go to Semesters
            </motion.button>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Cumulative Metric
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          CGPA <span className="text-gradient-accent">Calculator</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Cumulative Grade Point Average across all semesters
        </p>
      </motion.div>

      {/* Main Result Card */}
      <motion.div
        variants={fadeUp}
        className="card p-8 relative overflow-hidden"
        style={{ border: '1px solid var(--border-hover)' }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #c8ff00, transparent 70%)' }} />
        <div className="relative z-10">
          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Overall Cumulative GPA
          </p>
          <p className="text-6xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <AnimatedNumber value={result.cgpa} />
          </p>
          <p className="text-sm font-heading font-medium mt-2" style={{ color: getClassificationColor(result.cgpa) }}>
            {getClassification(result.cgpa)}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Percentage', value: result.percentage, icon: Percent, suffix: '%' },
          { label: 'Total Credits', value: result.totalCredits, icon: BookOpen, decimals: 0 },
          { label: 'Semesters', value: result.completedSemesters, icon: Award, decimals: 0 },
          { label: 'Multiplier', value: settings.cgpaToPercentageMultiplier, icon: GraduationCap, prefix: '×' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <stat.icon className="w-4 h-4 mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              {stat.prefix}
              <AnimatedNumber value={stat.value} decimals={stat.decimals ?? 2} />
              {stat.suffix}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Semester Breakdown */}
      <motion.div variants={fadeUp} className="card overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
            Semester Breakdown
          </h3>
        </div>
        <div>
          {validSemesters.map((sem, i) => (
            <motion.div
              key={sem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: i < validSemesters.length - 1 ? '1px solid var(--border-primary)' : 'none' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: 'var(--accent-dim)', color: '#c8ff00', border: '1px solid var(--border-primary)' }}
                >
                  S{sem.number}
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>{sem.name}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    {sem.subjects.length} subjects · {sem.totalCredits} credits
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-display font-bold" style={{ color: getClassificationColor(sem.sgpa) }}>
                  {sem.sgpa.toFixed(2)}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {getClassification(sem.sgpa)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Formula */}
      <motion.div variants={fadeUp} className="card p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Formulas Used</p>
        <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-secondary)' }}>
          CGPA = Σ(Semester Credits × SGPA) / Σ(Semester Credits)
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          Percentage = CGPA × {settings.cgpaToPercentageMultiplier}
        </p>
      </motion.div>
    </motion.div>
  );
}
