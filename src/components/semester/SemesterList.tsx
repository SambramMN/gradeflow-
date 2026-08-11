import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { getClassification, getClassificationColor, getGradePoint } from '../../lib/calculations';
import { AnimatedNumber } from '../ui/AnimatedNumber';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function SemesterList() {
  const {
    state,
    addSemester,
    deleteSemester,
    clearSemester,
    duplicateSemester,
    addSubject,
    updateSubject,
    deleteSubject,
  } = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(
    state.semesters.length > 0 ? state.semesters[state.semesters.length - 1].id : null
  );
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete-semester' | 'clear-semester' | 'delete-subject';
    id: string;
    parentId?: string;
    title: string;
    message: string;
  } | null>(null);

  const { semesters, settings } = state;

  const handleGradeChange = (semesterId: string, subjectId: string, grade: string) => {
    const semester = semesters.find((s) => s.id === semesterId);
    if (!semester) return;
    const subject = semester.subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    const gradePoint = getGradePoint(grade, settings.gradeSystem);
    updateSubject(semesterId, { ...subject, grade, gradePoint });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Academic Records
          </p>
          <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Semesters <span className="text-gradient-accent">& Subjects</span>
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addSemester}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-heading transition-all"
          style={{ background: '#c8ff00', color: '#0a0a0a' }}
        >
          <Plus className="w-4 h-4" />
          Add Semester
        </motion.button>
      </motion.div>

      {/* Semesters */}
      {semesters.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No semesters yet"
          description="Create your first semester to start tracking your academic performance."
          action={
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={addSemester}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-heading transition-colors"
              style={{ background: '#c8ff00', color: '#0a0a0a' }}
            >
              <Plus className="w-4 h-4" />
              Create Semester
            </motion.button>
          }
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {semesters.map((semester) => {
            const isExpanded = expandedId === semester.id;
            return (
              <motion.div
                key={semester.id}
                variants={fadeUp}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card overflow-hidden"
              >
                {/* Semester Header */}
                <div
                  className="flex items-center justify-between p-4 sm:p-6 cursor-pointer transition-colors"
                  style={{ background: isExpanded ? 'var(--bg-card-hover)' : 'transparent' }}
                  onClick={() => setExpandedId(isExpanded ? null : semester.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-bold text-base"
                      style={{ background: 'var(--accent-dim)', color: '#c8ff00', border: '1px solid var(--border-primary)' }}
                    >
                      S{semester.number}
                    </div>
                    <div>
                      <h3 className="text-base font-display font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {semester.name}
                      </h3>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {semester.subjects.length} subjects · {semester.totalCredits} credits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {semester.sgpa > 0 && (
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-display font-bold" style={{ color: getClassificationColor(semester.sgpa) }}>
                          <AnimatedNumber value={semester.sgpa} />
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {getClassification(semester.sgpa)}
                        </p>
                      </div>
                    )}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-6 pt-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
                        {/* Mobile SGPA Summary */}
                        {semester.sgpa > 0 && (
                          <div className="flex items-center justify-between py-3 sm:hidden" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                            <span className="text-xs font-mono uppercase" style={{ color: 'var(--text-muted)' }}>SGPA Score</span>
                            <span className="text-base font-display font-bold" style={{ color: getClassificationColor(semester.sgpa) }}>
                              {semester.sgpa.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* Subject Table */}
                        {semester.subjects.length > 0 && (
                          <div className="overflow-x-auto mt-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>
                                  <th className="pb-3 font-medium pr-4">Subject</th>
                                  <th className="pb-3 font-medium pr-4 hidden sm:table-cell">Code</th>
                                  <th className="pb-3 font-medium pr-4">Credits</th>
                                  <th className="pb-3 font-medium pr-4">Grade</th>
                                  <th className="pb-3 font-medium pr-4">Points</th>
                                  <th className="pb-3 font-medium w-8"></th>
                                </tr>
                              </thead>
                              <tbody>
                                <AnimatePresence mode="popLayout">
                                  {semester.subjects.map((subject) => (
                                    <motion.tr
                                      key={subject.id}
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="group"
                                      style={{ borderBottom: '1px solid var(--border-primary)' }}
                                    >
                                      <td className="py-3 pr-4">
                                        <input
                                          type="text"
                                          value={subject.name}
                                          onChange={(e) =>
                                            updateSubject(semester.id, {
                                              ...subject,
                                              name: e.target.value,
                                            })
                                          }
                                          placeholder="Subject name"
                                          className="w-full bg-transparent font-heading font-medium text-sm focus:outline-none placeholder:text-[var(--text-muted)]"
                                          style={{ color: 'var(--text-primary)' }}
                                        />
                                      </td>
                                      <td className="py-3 pr-4 hidden sm:table-cell">
                                        <input
                                          type="text"
                                          value={subject.code}
                                          onChange={(e) =>
                                            updateSubject(semester.id, {
                                              ...subject,
                                              code: e.target.value,
                                            })
                                          }
                                          placeholder="Code"
                                          className="w-20 bg-transparent font-mono text-xs focus:outline-none placeholder:text-[var(--text-muted)]"
                                          style={{ color: 'var(--text-tertiary)' }}
                                        />
                                      </td>
                                      <td className="py-3 pr-4">
                                        <input
                                          type="number"
                                          value={subject.credits}
                                          onChange={(e) => {
                                            const val = Math.max(0, parseInt(e.target.value) || 0);
                                            updateSubject(semester.id, {
                                              ...subject,
                                              credits: val,
                                            });
                                          }}
                                          min={0}
                                          className="w-14 px-2 py-1 rounded-lg font-mono text-xs focus:outline-none text-center"
                                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                                        />
                                      </td>
                                      <td className="py-3 pr-4">
                                        <select
                                          value={subject.grade}
                                          onChange={(e) =>
                                            handleGradeChange(
                                              semester.id,
                                              subject.id,
                                              e.target.value
                                            )
                                          }
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
                                      <td className="py-3 pr-4">
                                        <span className="font-mono text-xs font-bold" style={{ color: getClassificationColor(subject.gradePoint) }}>
                                          {subject.gradePoint}
                                        </span>
                                      </td>
                                      <td className="py-3">
                                        <button
                                          onClick={() =>
                                            setConfirmAction({
                                              type: 'delete-subject',
                                              id: subject.id,
                                              parentId: semester.id,
                                              title: 'Delete Subject',
                                              message: `Remove "${subject.name || 'this subject'}" from ${semester.name}?`,
                                            })
                                          }
                                          className="p-1.5 rounded-lg transition-colors opacity-40 group-hover:opacity-100 hover:text-red-400"
                                          style={{ color: 'var(--text-tertiary)' }}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </motion.tr>
                                  ))}
                                </AnimatePresence>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 mt-5">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => addSubject(semester.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading transition-colors"
                            style={{ background: 'var(--accent-dim)', color: '#c8ff00', border: '1px solid var(--border-primary)' }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Subject
                          </motion.button>
                          <button
                            onClick={() => duplicateSemester(semester.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading transition-colors"
                            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicate
                          </button>
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: 'clear-semester',
                                id: semester.id,
                                title: 'Clear Semester',
                                message: `Remove all subjects from ${semester.name}? This cannot be undone.`,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading transition-colors"
                            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Clear
                          </button>
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: 'delete-semester',
                                id: semester.id,
                                title: 'Delete Semester',
                                message: `Delete ${semester.name} and all its subjects? This cannot be undone.`,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading transition-colors ml-auto text-red-400 hover:text-red-300"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'delete-semester') {
            deleteSemester(confirmAction.id);
          } else if (confirmAction.type === 'clear-semester') {
            clearSemester(confirmAction.id);
          } else if (confirmAction.type === 'delete-subject' && confirmAction.parentId) {
            deleteSubject(confirmAction.parentId, confirmAction.id);
          }
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </motion.div>
  );
}
