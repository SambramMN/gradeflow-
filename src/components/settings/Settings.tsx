import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  GraduationCap,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { GRADE_PRESETS } from '../../lib/gradePresets';
import { exportAppData, importAppData } from '../../lib/storage';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Settings() {
  const { state, updateSettings, resetData, importData, addToast } = useApp();
  const { settings } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);

  const handleExport = () => {
    const json = exportAppData(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported successfully', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const data = importAppData(text);
      if (data) {
        importData(data);
      } else {
        addToast('Invalid file format. Please use a GradeFlow JSON backup.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePresetChange = (presetId: string) => {
    const preset = GRADE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      updateSettings({ gradeSystem: preset.grades });
    }
  };

  const handleGradePointChange = (index: number, point: number) => {
    const newSystem = [...settings.gradeSystem];
    newSystem[index] = { ...newSystem[index], point };
    updateSettings({ gradeSystem: newSystem });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6 max-w-2xl"
    >
      <motion.div variants={fadeUp}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Preferences & System
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          System <span className="text-gradient-accent">Settings</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Customize your grading system, profile, themes, and application data
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={fadeUp} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4" style={{ color: '#c8ff00' }} />
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Profile</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Student Name
            </label>
            <input
              type="text"
              value={settings.studentName}
              onChange={(e) => updateSettings({ studentName: e.target.value })}
              placeholder="Your name"
              className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none placeholder:text-[var(--text-muted)]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              University
            </label>
            <input
              type="text"
              value={settings.university}
              onChange={(e) => updateSettings({ university: e.target.value })}
              placeholder="Your university"
              className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none placeholder:text-[var(--text-muted)]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Course
              </label>
              <input
                type="text"
                value={settings.course}
                onChange={(e) => updateSettings({ course: e.target.value })}
                placeholder="e.g. B.Tech CSE"
                className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none placeholder:text-[var(--text-muted)]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Current Semester
              </label>
              <input
                type="number"
                value={settings.currentSemester}
                onChange={(e) =>
                  updateSettings({
                    currentSemester: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grading System */}
      <motion.div variants={fadeUp} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-4 h-4" style={{ color: '#c8ff00' }} />
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Grading System</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              University Preset
            </label>
            <select
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl font-heading text-sm focus:outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <option value="" style={{ background: 'var(--bg-surface)' }}>Select a preset...</option>
              {GRADE_PRESETS.map((p) => (
                <option key={p.id} value={p.id} style={{ background: 'var(--bg-surface)' }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Grade Points (Editable)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {settings.gradeSystem.map((g, i) => (
                <div
                  key={g.grade}
                  className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                >
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {g.grade}
                  </span>
                  <input
                    type="number"
                    value={g.point}
                    onChange={(e) =>
                      handleGradePointChange(i, parseFloat(e.target.value) || 0)
                    }
                    step="0.1"
                    min={0}
                    className="w-12 bg-transparent font-mono text-xs focus:outline-none text-right font-bold"
                    style={{ color: '#c8ff00' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Percentage Multiplier
              </label>
              <input
                type="number"
                value={settings.cgpaToPercentageMultiplier}
                onChange={(e) =>
                  updateSettings({
                    cgpaToPercentageMultiplier: parseFloat(e.target.value) || 10,
                  })
                }
                step="0.1"
                className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Target CGPA Goal
              </label>
              <input
                type="number"
                value={settings.targetCGPA}
                onChange={(e) =>
                  updateSettings({
                    targetCGPA: Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)),
                  })
                }
                step="0.1"
                min={0}
                max={10}
                className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm focus:outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={fadeUp} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4" style={{ color: '#c8ff00' }} />
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light' as const, label: 'Light', icon: Sun },
                { value: 'dark' as const, label: 'Dark', icon: Moon },
                { value: 'system' as const, label: 'System', icon: Monitor },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ theme: opt.value })}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-heading font-medium transition-all"
                  style={{
                    background: settings.theme === opt.value ? 'var(--accent-dim)' : 'var(--bg-card)',
                    border: settings.theme === opt.value ? '1px solid var(--border-hover)' : '1px solid var(--border-primary)',
                    color: settings.theme === opt.value ? '#c8ff00' : 'var(--text-secondary)',
                  }}
                >
                  <opt.icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-heading font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                UI Animations
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Enable motion interactions and transitions
              </p>
            </div>
            <button
              onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: settings.animationsEnabled ? '#c8ff00' : 'var(--border-hover)' }}
            >
              <motion.div
                animate={{ x: settings.animationsEnabled ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-black shadow-sm"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div variants={fadeUp} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-4 h-4" style={{ color: '#c8ff00' }} />
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Data Management</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <Download className="w-4 h-4" />
              Export JSON Backup
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <Upload className="w-4 h-4" />
              Import Backup
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          <div className="pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowReset(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold transition-colors text-red-400 hover:text-red-300"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <Trash2 className="w-4 h-4" />
              Reset All Application Data
            </motion.button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={showReset}
        title="Reset All Data"
        message="This will permanently delete all your semesters, subjects, grades, and settings. This action cannot be undone."
        variant="danger"
        confirmLabel="Reset Everything"
        onConfirm={() => {
          resetData();
          setShowReset(false);
        }}
        onCancel={() => setShowReset(false)}
      />
    </motion.div>
  );
}
