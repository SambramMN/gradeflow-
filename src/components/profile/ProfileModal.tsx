import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, GraduationCap, Building, BookOpen, Hash } from 'lucide-react';
import type { UserProfile } from '../../types';
import { generateId } from '../../lib/calculations';
import { useApp } from '../../context/AppContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit?: UserProfile | null;
}

export function ProfileModal({ isOpen, onClose, profileToEdit }: ProfileModalProps) {
  const { addProfile, updateProfile } = useApp();

  const [name, setName] = useState(profileToEdit?.name || '');
  const [university, setUniversity] = useState(profileToEdit?.university || '');
  const [college, setCollege] = useState(profileToEdit?.college || '');
  const [course, setCourse] = useState(profileToEdit?.course || '');
  const [branch, setBranch] = useState(profileToEdit?.branch || '');
  const [academicYear, setAcademicYear] = useState(profileToEdit?.academicYear || '2024-2028');
  const [currentSemester, setCurrentSemester] = useState(profileToEdit?.currentSemester || 1);
  const [studentId, setStudentId] = useState(profileToEdit?.studentId || '');
  const [avatarUrl, setAvatarUrl] = useState(profileToEdit?.avatarUrl || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      university,
      college,
      course,
      branch,
      academicYear,
      currentSemester: Number(currentSemester),
      studentId,
      avatarUrl,
    };

    if (profileToEdit) {
      updateProfile({ ...profileToEdit, ...payload });
    } else {
      addProfile(payload);
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
          className="card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hover)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: 'var(--bg-card)' }}
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {profileToEdit ? 'Edit Academic Profile' : 'Create New Profile'}
          </h2>
          <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Each profile has separate semesters, grades, calculators, and settings.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Student Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sambhram M N"
                className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  University *
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. Dayananda Sagar University"
                  className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  College / School
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. School of Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Degree / Course *
                </label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech / B.E."
                  className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Branch / Major
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 2024–2028"
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Student ID / USN
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 1DS21CS001"
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
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
                {profileToEdit ? 'Save Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
