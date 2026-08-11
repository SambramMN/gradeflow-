import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateCGPA } from '../../lib/calculations';
import { exportAcademicCSV, generateAcademicPDF } from '../../lib/exportUtils';
import { generateGlobalAcademicInsights } from '../../lib/comparisonEngine';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonSummaryText?: string;
}

export function ShareModal({ isOpen, onClose, comparisonSummaryText }: ShareModalProps) {
  const { state, addToast } = useApp();
  const { semesters, settings, friends } = state;
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cgpaResult = calculateCGPA(semesters, settings.cgpaToPercentageMultiplier);
  const insights = generateGlobalAcademicInsights(cgpaResult.cgpa, semesters, friends || []);

  const defaultSummaryText = comparisonSummaryText || `Academic Performance Summary:
${settings.studentName || 'Student'} (${settings.course || 'Degree'}):
• CGPA: ${cgpaResult.cgpa.toFixed(2)} (${cgpaResult.percentage.toFixed(1)}%)
• Completed Semesters: ${cgpaResult.completedSemesters}
• Total Credits: ${cgpaResult.totalCredits}

Generated via GradeFlow Academic Tracker`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultSummaryText);
    setCopied(true);
    addToast('Summary copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    exportAcademicCSV(settings.studentName, settings.university, settings.course, semesters, friends || []);
    addToast('CSV file downloaded', 'success');
  };

  const handleExportPDF = () => {
    generateAcademicPDF(settings, semesters, cgpaResult, insights);
    addToast('PDF Transcript generated & downloaded', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="card max-w-lg w-full p-6 relative"
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
            Share & Export Performance
          </h2>
          <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Generate shareable summary text, CSV dataset, or official PDF transcript.
          </p>

          <div className="space-y-4">
            {/* Copy Summary Box */}
            <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Shareable Text Summary
              </span>
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {defaultSummaryText}
              </pre>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all w-full justify-center"
                style={{ background: copied ? 'var(--accent-dim)' : 'var(--bg-elevated)', border: '1px solid var(--border-primary)', color: copied ? '#c8ff00' : 'var(--text-primary)' }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}
              </button>
            </div>

            {/* Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl text-xs font-heading font-semibold transition-all"
                style={{ background: '#c8ff00', color: '#0a0a0a' }}
              >
                <FileText className="w-4 h-4" />
                Download PDF Transcript
              </button>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl text-xs font-heading font-semibold transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <Download className="w-4 h-4" />
                Export CSV Dataset
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
