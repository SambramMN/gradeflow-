import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import type { FriendProfile, FriendSubject } from '../../types';
import { generateId, getGradePoint } from '../../lib/calculations';
import { useApp } from '../../context/AppContext';

interface FriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendToEdit?: FriendProfile | null;
}

export function FriendModal({ isOpen, onClose, friendToEdit }: FriendModalProps) {
  const { state, addFriend, updateFriend } = useApp();
  const { gradeSystem } = state.settings;

  const [name, setName] = useState(friendToEdit?.name || '');
  const [title, setTitle] = useState(friendToEdit?.title || 'Class Benchmark');
  const [university, setUniversity] = useState(friendToEdit?.university || '');
  const [course, setCourse] = useState(friendToEdit?.course || '');
  const [semester, setSemester] = useState(friendToEdit?.semester || 1);
  const [cgpa, setCgpa] = useState(friendToEdit?.cgpa || 8.0);
  const [sgpa, setSgpa] = useState(friendToEdit?.sgpa || 8.0);
  const [credits, setCredits] = useState(friendToEdit?.credits || 20);

  const [subjects, setSubjects] = useState<FriendSubject[]>(
    friendToEdit?.subjects || [
      { id: generateId(), name: 'Data Structures', grade: 'A', gradePoint: 9, credits: 4 },
      { id: generateId(), name: 'DBMS', grade: 'A+', gradePoint: 10, credits: 4 },
    ]
  );

  if (!isOpen) return null;

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { id: generateId(), name: '', grade: 'A', gradePoint: 9, credits: 3 },
    ]);
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleSubjectChange = (id: string, field: keyof FriendSubject, value: string | number) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id !== id) return s;
        if (field === 'grade') {
          const gp = getGradePoint(value as string, gradeSystem);
          return { ...s, grade: value as string, gradePoint: gp };
        }
        return { ...s, [field]: value };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      title: title || 'Academic Benchmark',
      university,
      course,
      semester: Number(semester),
      cgpa: Number(cgpa),
      sgpa: Number(sgpa),
      credits: Number(credits),
      subjects,
    };

    if (friendToEdit) {
      updateFriend({ ...friendToEdit, ...payload });
    } else {
      addFriend(payload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="card max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hover)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: 'var(--bg-card)' }}
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {friendToEdit ? 'Edit Friend Profile' : 'Add Comparison Profile'}
          </h2>
          <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Comparison data is stored 100% locally on your device.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Title / Badge
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Database King"
                  className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  CGPA *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min={0}
                  max={10}
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Latest SGPA *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min={0}
                  max={10}
                  value={sgpa}
                  onChange={(e) => setSgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Total Credits
                </label>
                <input
                  type="number"
                  min={0}
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Semester #
                </label>
                <input
                  type="number"
                  min={1}
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Subject Breakdown for Matrix Comparison */}
            <div className="pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Subject Breakdown (Optional)
                </span>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="inline-flex items-center gap-1 text-xs font-heading font-semibold"
                  style={{ color: '#c8ff00' }}
                >
                  <Plus className="w-3 h-3" /> Add Subject
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {subjects.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={sub.name}
                      onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs font-heading focus:outline-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                    />
                    <select
                      value={sub.grade}
                      onChange={(e) => handleSubjectChange(sub.id, 'grade', e.target.value)}
                      className="px-2 py-1.5 rounded-lg text-xs font-mono focus:outline-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                    >
                      {gradeSystem.map((g) => (
                        <option key={g.grade} value={g.grade} style={{ background: 'var(--bg-surface)' }}>
                          {g.grade}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-heading"
                style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-heading font-semibold"
                style={{ background: '#c8ff00', color: '#0a0a0a' }}
              >
                {friendToEdit ? 'Save Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
