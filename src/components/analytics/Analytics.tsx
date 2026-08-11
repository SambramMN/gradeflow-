import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../ui/EmptyState';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateCGPA,
  getOverallGradeDistribution,
  compareSemesters,
  analyzeSubjectPerformance,
  getClassificationColor,
} from '../../lib/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { CHART_COLORS } from '../../lib/constants';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Analytics() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { semesters, settings } = state;

  const gradeDistribution = getOverallGradeDistribution(semesters);
  const semesterComparisons = compareSemesters(semesters);
  const subjectPerformance = analyzeSubjectPerformance(semesters);

  const validSemesters = semesters.filter((s) => s.subjects.length > 0);

  if (validSemesters.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Data Visualization
          </p>
          <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Academic <span className="text-gradient-accent">Analytics</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Deep insights, performance trends, and grade distribution
          </p>
        </div>
        <EmptyState
          icon={BarChart3}
          title="No data to analyze"
          description="Add subjects and grades to your semesters to see performance analytics."
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

  // Running CGPA
  let runningCredits = 0;
  let runningWeighted = 0;
  const cgpaProgressData = validSemesters.map((s) => {
    runningCredits += s.totalCredits;
    runningWeighted += s.sgpa * s.totalCredits;
    return {
      name: `Sem ${s.number}`,
      cgpa: parseFloat((runningWeighted / runningCredits).toFixed(2)),
      sgpa: s.sgpa,
    };
  });

  const gradeChartData = Object.entries(gradeDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([grade, count]) => ({ grade, count }));

  const creditsData = validSemesters.map((s) => ({
    name: `Sem ${s.number}`,
    credits: s.totalCredits,
  }));

  const bestSemester = validSemesters.reduce((best, s) =>
    s.sgpa > best.sgpa ? s : best
  );
  const weakestSemester = validSemesters.reduce((worst, s) =>
    s.sgpa < worst.sgpa ? s : worst
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Data Visualization
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Academic <span className="text-gradient-accent">Analytics</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Deep insights, performance trends, and grade distribution
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <Award className="w-4 h-4 text-emerald-400 mb-3" />
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Best Semester</p>
          <p className="text-xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{bestSemester.name}</p>
          <p className="text-xs font-mono font-bold mt-1" style={{ color: getClassificationColor(bestSemester.sgpa) }}>
            SGPA: {bestSemester.sgpa.toFixed(2)}
          </p>
        </div>
        <div className="card p-5">
          <AlertTriangle className="w-4 h-4 text-amber-400 mb-3" />
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Needs Focus</p>
          <p className="text-xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{weakestSemester.name}</p>
          <p className="text-xs font-mono font-bold mt-1" style={{ color: getClassificationColor(weakestSemester.sgpa) }}>
            SGPA: {weakestSemester.sgpa.toFixed(2)}
          </p>
        </div>
        <div className="card p-5">
          <TrendingUp className="w-4 h-4 text-blue-400 mb-3" />
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Avg Grade Point</p>
          <p className="text-xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            <AnimatedNumber value={subjectPerformance.averageGradePoint} />
          </p>
        </div>
        <div className="card p-5">
          <BarChart3 className="w-4 h-4 text-purple-400 mb-3" />
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total Subjects</p>
          <p className="text-xl font-display font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {semesters.reduce((s, sem) => s + sem.subjects.length, 0)}
          </p>
        </div>
      </motion.div>

      {/* CGPA Progression */}
      <motion.div variants={fadeUp} className="card p-6">
        <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          CGPA & SGPA Progression
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cgpaProgressData}>
              <defs>
                <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8ff00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c8ff00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" />
              <Tooltip />
              <Area type="monotone" dataKey="cgpa" stroke="#c8ff00" strokeWidth={2.5} fill="url(#cgpaGrad)" dot={{ fill: '#c8ff00', r: 4 }} name="CGPA" />
              <Area type="monotone" dataKey="sgpa" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fill="url(#sgpaGrad)" dot={{ fill: '#8b5cf6', r: 3 }} name="SGPA" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Grade Distribution */}
        <div className="card p-6">
          <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Grade Distribution
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#c8ff00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credits by Semester */}
        <div className="card p-6">
          <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Credits per Semester
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="credits" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Semester Comparison Table */}
      <motion.div variants={fadeUp} className="card overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
            Semester Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-primary)' }}>
                <th className="px-6 py-3.5 font-medium">Semester</th>
                <th className="px-6 py-3.5 font-medium">SGPA</th>
                <th className="px-6 py-3.5 font-medium">Credits</th>
                <th className="px-6 py-3.5 font-medium">Subjects</th>
                <th className="px-6 py-3.5 font-medium">Delta</th>
              </tr>
            </thead>
            <tbody>
              {semesterComparisons.map((comp, i) => {
                const prev = i > 0 ? semesterComparisons[i - 1] : null;
                const change = prev ? comp.sgpa - prev.sgpa : 0;
                return (
                  <tr key={comp.semester.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td className="px-6 py-3.5 font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {comp.semester.name}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold" style={{ color: getClassificationColor(comp.sgpa) }}>
                      {comp.sgpa.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{comp.totalCredits}</td>
                    <td className="px-6 py-3.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{comp.semester.subjects.length}</td>
                    <td className="px-6 py-3.5 font-mono">
                      {i > 0 && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                          {change > 0 ? <TrendingUp className="w-3 h-3" /> : change < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                          {change > 0 ? '+' : ''}{change.toFixed(2)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
