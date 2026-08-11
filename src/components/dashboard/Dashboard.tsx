import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, TrendingUp, Plus, ArrowRight,
  Calculator, Target, FlaskConical, BarChart3, ArrowUpRight, ArrowDownRight, GitCompare, Sparkles
} from 'lucide-react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import {
  calculateCGPA, getClassification, getClassificationColor,
  getOverallGradeDistribution,
} from '../../lib/calculations';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import { CHART_COLORS } from '../../lib/constants';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// SVG Animated Progress Ring
function ProgressRing({ value, max = 10, size = 200 }: { value: number; max?: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--border-primary)" strokeWidth={strokeWidth} />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="url(#ring-gradient)" strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8ff00" />
          <stop offset="100%" stopColor="#a3e635" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Dashboard() {
  const { state, addSemester } = useApp();
  const navigate = useNavigate();
  const { semesters, settings, friends = [] } = state;

  const cgpaResult = calculateCGPA(semesters, settings.cgpaToPercentageMultiplier);
  const latestSemester = semesters.length > 0 ? semesters[semesters.length - 1] : null;
  const prevSemester = semesters.length > 1 ? semesters[semesters.length - 2] : null;
  const totalSubjects = semesters.reduce((sum, s) => sum + s.subjects.length, 0);
  const gradeDistribution = getOverallGradeDistribution(semesters);
  const sgpaChange = latestSemester && prevSemester ? latestSemester.sgpa - prevSemester.sgpa : 0;

  const sgpaProgression = semesters
    .filter((s) => s.subjects.length > 0)
    .map((s) => ({ name: `S${s.number}`, sgpa: s.sgpa, credits: s.totalCredits }));

  const pieData = Object.entries(gradeDistribution).map(([grade, count]) => ({ name: grade, value: count }));

  const quickActions = [
    { label: 'Compare', icon: GitCompare, path: '/compare' },
    { label: 'What-If', icon: FlaskConical, path: '/what-if' },
    { label: 'Target', icon: Target, path: '/target' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-[-0.03em]" style={{ color: 'var(--text-primary)' }}>
            {settings.studentName ? `${settings.studentName}'s` : 'Academic'}{' '}
            <span className="text-gradient-accent">Overview</span>
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { addSemester(); navigate('/semesters'); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-heading transition-all"
          style={{ background: '#c8ff00', color: '#0a0a0a' }}
        >
          <Plus className="w-4 h-4" /> Add Semester
        </motion.button>
      </motion.div>

      {/* CGPA Hero + Metrics */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CGPA Ring - Hero */}
        <div className="lg:col-span-5 card p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[280px]">
          {/* Ambient glow behind ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(200,255,0,0.3), transparent 70%)' }} />
          </div>
          <div className="relative">
            <ProgressRing value={cgpaResult.cgpa} size={180} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                <AnimatedNumber value={cgpaResult.cgpa} />
              </p>
              <p className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>
                CGPA
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {sgpaChange !== 0 && (
              <span className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${sgpaChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {sgpaChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {sgpaChange > 0 ? '+' : ''}{sgpaChange.toFixed(2)}
              </span>
            )}
            <span className="text-xs font-heading" style={{ color: 'var(--text-tertiary)' }}>
              {getClassification(cgpaResult.cgpa)}
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          {[
            { label: 'Latest SGPA', value: latestSemester?.sgpa ?? 0, sub: latestSemester?.name ?? '—', icon: Award, decimal: 2 },
            { label: 'Percentage', value: cgpaResult.percentage, sub: `×${settings.cgpaToPercentageMultiplier}`, icon: TrendingUp, decimal: 1, suffix: '%' },
            { label: 'Credits', value: cgpaResult.totalCredits, sub: `${totalSubjects} subjects`, icon: BookOpen, decimal: 0 },
            { label: 'Semesters', value: cgpaResult.completedSemesters, sub: `Target: ${settings.targetCGPA}`, icon: GraduationCap, decimal: 0 },
          ].map((m, i) => (
            <motion.div key={m.label} variants={fadeUp} className="card p-5 group">
              <div className="flex items-center justify-between mb-3">
                <m.icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {m.label}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                <AnimatedNumber value={m.value} decimals={m.decimal} />
                {m.suffix && <span className="text-lg">{m.suffix}</span>}
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-tertiary)' }}>{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* NEW SECTION: Performance Insights & Compare Banner */}
      <motion.div variants={fadeUp} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden" style={{ border: '1px solid var(--border-hover)' }}>
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono mb-1" style={{ background: 'var(--accent-dim)', color: '#c8ff00' }}>
            <Sparkles className="w-3 h-3" /> Performance Benchmarks & Analytics
          </div>
          <h3 className="text-lg font-display font-bold" style={{ color: 'var(--text-primary)' }}>
            Academic Comparison & Insights
          </h3>
          <p className="text-xs font-mono max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Compare performance across semesters, benchmark against friends, track subject matrices, and generate shareable transcripts.
          </p>
        </div>

        <div className="z-10 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/compare')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-heading font-semibold transition-all"
            style={{ background: '#c8ff00', color: '#0a0a0a' }}
          >
            Compare Performance <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Target Progress */}
      {settings.targetCGPA > 0 && cgpaResult.cgpa > 0 && (
        <motion.div variants={fadeUp} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Goal Progress</span>
            </div>
            <span className="text-xs font-mono font-bold" style={{ color: '#c8ff00' }}>
              {Math.min(100, Math.round((cgpaResult.cgpa / settings.targetCGPA) * 100))}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-primary)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (cgpaResult.cgpa / settings.targetCGPA) * 100)}%` }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #c8ff00, #a3e635)' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>Current: {cgpaResult.cgpa}</span>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>Target: {settings.targetCGPA}</span>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      {sgpaProgression.length > 0 && (
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* SGPA Line Chart */}
          <div className="lg:col-span-3 card p-5">
            <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              SGPA Progression
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sgpaProgression}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} stroke="var(--border-primary)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="sgpa" stroke="#c8ff00" strokeWidth={2} dot={{ fill: '#c8ff00', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#c8ff00' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="lg:col-span-2 card p-5">
            <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Grade Distribution
            </h3>
            {pieData.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                        {pieData.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {pieData.map((e, i) => (
                    <div key={e.name} className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      {e.name}: {e.value}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-center py-12" style={{ color: 'var(--text-muted)' }}>No data yet</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Recent + Quick Actions */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Semesters */}
        {semesters.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>Recent</h3>
              <button onClick={() => navigate('/semesters')} className="text-[11px] font-mono flex items-center gap-1 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {semesters.slice(-3).reverse().map((sem) => (
                <div key={sem.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors" style={{ background: 'var(--bg-card)' }}>
                  <div>
                    <p className="text-sm font-heading font-medium" style={{ color: 'var(--text-primary)' }}>{sem.name}</p>
                    <p className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {sem.subjects.length} subj · {sem.totalCredits} cr
                    </p>
                  </div>
                  <p className="text-sm font-mono font-bold" style={{ color: getClassificationColor(sem.sgpa) }}>
                    {sem.sgpa.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <motion.button
                key={action.path}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-all text-left"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
              >
                <action.icon className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-heading font-medium" style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
