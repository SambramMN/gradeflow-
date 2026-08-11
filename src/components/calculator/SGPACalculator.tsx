import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import {
  calculateSGPA,
  createDefaultSubject,
  getClassificationColor,
  getGradePoint,
} from '../../lib/calculations';
import type { Subject } from '../../types';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function SGPACalculator() {
  const { state } = useApp();
  const { settings } = state;

  const [subjects, setSubjects] = useState<Subject[]>([
    createDefaultSubject(settings.gradeSystem),
    createDefaultSubject(settings.gradeSystem),
    createDefaultSubject(settings.gradeSystem),
  ]);

  const result = calculateSGPA(subjects);

  const addSubject = () => {
    setSubjects([...subjects, createDefaultSubject(settings.gradeSystem)]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateField = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id !== id) return s;
        if (field === 'grade') {
          const gp = getGradePoint(value as string, settings.gradeSystem);
          return { ...s, grade: value as string, gradePoint: gp };
        }
        if (field === 'credits') {
          return { ...s, credits: Math.max(0, value as number) };
        }
        return { ...s, [field]: value };
      })
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Quick Calculation
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          SGPA <span className="text-gradient-accent">Calculator</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Calculate your Semester Grade Point Average interactively
        </p>
      </motion.div>

      {/* Result Card */}
      <motion.div
        variants={fadeUp}
        className="card p-6 relative overflow-hidden"
        style={{ border: '1px solid var(--border-hover)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #c8ff00, transparent 70%)' }} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Estimated SGPA
            </p>
            <p className="text-5xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              <AnimatedNumber value={result.sgpa} />
            </p>
            <p className="text-xs font-heading font-medium mt-2" style={{ color: getClassificationColor(result.sgpa) }}>
              {result.classification}
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total Credits</p>
              <p className="text-2xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{result.totalCredits}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Grade Points</p>
              <p className="text-2xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{result.totalGradePoints}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subject Table */}
      <motion.div variants={fadeUp} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>
                <th className="px-6 py-3.5 font-medium">Subject</th>
                <th className="px-6 py-3.5 font-medium">Credits</th>
                <th className="px-6 py-3.5 font-medium">Grade</th>
                <th className="px-6 py-3.5 font-medium">Points</th>
                <th className="px-6 py-3.5 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <motion.tr
                  key={subject.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                  style={{ borderBottom: '1px solid var(--border-primary)' }}
                >
                  <td className="px-6 py-3.5">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => updateField(subject.id, 'name', e.target.value)}
                      placeholder={`Subject ${index + 1}`}
                      className="bg-transparent font-heading font-medium text-sm focus:outline-none w-full placeholder:text-[var(--text-muted)]"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </td>
                  <td className="px-6 py-3.5">
                    <input
                      type="number"
                      value={subject.credits}
                      onChange={(e) =>
                        updateField(subject.id, 'credits', parseInt(e.target.value) || 0)
                      }
                      min={0}
                      className="w-16 px-2 py-1 rounded-lg font-mono text-xs text-center focus:outline-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                    />
                  </td>
                  <td className="px-6 py-3.5">
                    <select
                      value={subject.grade}
                      onChange={(e) => updateField(subject.id, 'grade', e.target.value)}
                      className="px-2.5 py-1 rounded-lg font-mono text-xs focus:outline-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                    >
                      {settings.gradeSystem.map((g) => (
                        <option key={g.grade} value={g.grade} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                          {g.grade} ({g.point})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs font-bold" style={{ color: getClassificationColor(subject.gradePoint) }}>
                      {subject.gradePoint}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => removeSubject(subject.id)}
                      disabled={subjects.length <= 1}
                      className="p-1 rounded-lg transition-colors opacity-40 group-hover:opacity-100 hover:text-red-400 disabled:opacity-20"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addSubject}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading transition-colors"
            style={{ background: 'var(--accent-dim)', color: '#c8ff00', border: '1px solid var(--border-primary)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Subject
          </motion.button>
        </div>
      </motion.div>

      {/* Formula */}
      <motion.div variants={fadeUp} className="card p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Calculation Formula</p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          SGPA = Σ(Credit × Grade Point) / Σ(Credits)
        </p>
      </motion.div>
    </motion.div>
  );
}
