import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { calculateCGPA, calculateTargetCGPA, getClassificationColor } from '../../lib/calculations';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function TargetCGPACalculator() {
  const { state } = useApp();
  const { semesters, settings } = state;

  const currentResult = calculateCGPA(semesters, settings.cgpaToPercentageMultiplier);

  const [targetCGPA, setTargetCGPA] = useState(settings.targetCGPA);
  const [remainingCredits, setRemainingCredits] = useState(20);
  const [currentCGPA, setCurrentCGPA] = useState(currentResult.cgpa);
  const [completedCredits, setCompletedCredits] = useState(currentResult.totalCredits);

  const result = calculateTargetCGPA(currentCGPA, completedCredits, targetCGPA, remainingCredits);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6 max-w-2xl"
    >
      <motion.div variants={fadeUp}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Goal Engineering
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Target <span className="text-gradient-accent">CGPA</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Calculate the required SGPA needed to achieve your target CGPA
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.div variants={fadeUp} className="card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Current CGPA
            </label>
            <input
              type="number"
              value={currentCGPA}
              onChange={(e) => setCurrentCGPA(parseFloat(e.target.value) || 0)}
              step="0.01"
              min={0}
              max={10}
              className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Completed Credits
            </label>
            <input
              type="number"
              value={completedCredits}
              onChange={(e) => setCompletedCredits(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Target CGPA
            </label>
            <input
              type="number"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(parseFloat(e.target.value) || 0)}
              step="0.01"
              min={0}
              max={10}
              className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Remaining Credits
            </label>
            <input
              type="number"
              value={remainingCredits}
              onChange={(e) => setRemainingCredits(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
        {currentResult.cgpa > 0 && (
          <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Pre-filled from your existing records. Adjust as needed.
          </p>
        )}
      </motion.div>

      {/* Result */}
      {remainingCredits > 0 && (
        <motion.div
          variants={fadeUp}
          className="card p-6"
          style={{
            border: result.isAchievable ? '1px solid rgba(200, 255, 0, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            background: result.isAchievable ? 'rgba(200, 255, 0, 0.03)' : 'rgba(239, 68, 68, 0.03)',
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            {result.isAchievable ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#c8ff00' }} />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h3 className="text-base font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                {result.isAchievable ? 'Target is Achievable!' : 'Target is Not Achievable'}
              </h3>
              <p className="text-xs font-heading mt-1" style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
            </div>
          </div>

          {result.requiredSGPA > 0 && result.requiredSGPA <= 10 && (
            <div className="flex items-center gap-4 mt-6 pt-5" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <div className="flex-1">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Current</p>
                <p className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentCGPA.toFixed(2)}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 opacity-40" style={{ color: 'var(--text-tertiary)' }} />
              <div className="flex-1">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Required SGPA</p>
                <p
                  className="text-2xl font-display font-bold"
                  style={{ color: getClassificationColor(result.requiredSGPA) }}
                >
                  <AnimatedNumber value={result.requiredSGPA} />
                </p>
              </div>
              <ArrowRight className="w-4 h-4 opacity-40" style={{ color: 'var(--text-tertiary)' }} />
              <div className="flex-1">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Target</p>
                <p className="text-2xl font-display font-bold" style={{ color: '#c8ff00' }}>{targetCGPA.toFixed(2)}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Info */}
      <motion.div variants={fadeUp} className="card p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Methodology</p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          Required SGPA = (Target × Total Credits − Current × Completed) / Remaining Credits
        </p>
      </motion.div>
    </motion.div>
  );
}
