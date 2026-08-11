import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import {
  calculateWhatIf,
  createDefaultSubject,
  getGradePoint,
  getClassificationColor,
  calculateCGPA,
} from '../../lib/calculations';
import type { Subject } from '../../types';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function WhatIfSimulator() {
  const { state } = useApp();
  const { semesters, settings } = state;

  const [hypotheticalSubjects, setHypotheticalSubjects] = useState<Subject[]>([
    createDefaultSubject(settings.gradeSystem),
    createDefaultSubject(settings.gradeSystem),
    createDefaultSubject(settings.gradeSystem),
  ]);

  const result = calculateWhatIf(semesters, hypotheticalSubjects, settings.cgpaToPercentageMultiplier);

  const addSubject = () => {
    setHypotheticalSubjects([...hypotheticalSubjects, createDefaultSubject(settings.gradeSystem)]);
  };

  const removeSubject = (id: string) => {
    if (hypotheticalSubjects.length <= 1) return;
    setHypotheticalSubjects(hypotheticalSubjects.filter((s) => s.id !== id));
  };

  const updateField = (id: string, field: keyof Subject, value: string | number) => {
    setHypotheticalSubjects(
      hypotheticalSubjects.map((s) => {
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

  const DirectionIcon =
    result.changeDirection === 'up'
      ? TrendingUp
      : result.changeDirection === 'down'
      ? TrendingDown
      : Minus;

  const changeColor =
    result.changeDirection === 'up'
      ? '#c8ff00'
      : result.changeDirection === 'down'
      ? '#ef4444'
      : 'var(--text-tertiary)';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Futuristic Projections
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          What-If <span className="text-gradient-accent">Simulator</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Simulate how hypothetical grades will affect your overall CGPA in real-time
        </p>
      </motion.div>

      {/* Projection Result */}
      <motion.div variants={fadeUp} className="card p-8">
        <div className="grid grid-cols-3 gap-6 items-center">
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Current CGPA</p>
            <p className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              <AnimatedNumber value={result.currentCGPA} />
            </p>
          </div>
          <div className="flex flex-col items-center">
            <DirectionIcon className="w-6 h-6 mb-1" style={{ color: changeColor }} />
            <p className="text-sm font-mono font-bold" style={{ color: changeColor }}>
              {result.change > 0 ? '+' : ''}
              <AnimatedNumber value={result.change} />
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Projected CGPA</p>
            <p
              className="text-4xl font-display font-bold tracking-tight"
              style={{ color: getClassificationColor(result.projectedCGPA) }}
            >
              <AnimatedNumber value={result.projectedCGPA} />
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hypothetical Subjects */}
      <motion.div variants={fadeUp} className="card overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
            Hypothetical Next Semester
          </h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Modify subjects and grades below to project CGPA impact
          </p>
        </div>
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
              {hypotheticalSubjects.map((subject, index) => (
                <tr
                  key={subject.id}
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
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: getClassificationColor(subject.gradePoint) }}
                    >
                      {subject.gradePoint}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => removeSubject(subject.id)}
                      disabled={hypotheticalSubjects.length <= 1}
                      className="p-1 rounded-lg transition-colors opacity-40 group-hover:opacity-100 hover:text-red-400 disabled:opacity-20"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
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
    </motion.div>
  );
}
