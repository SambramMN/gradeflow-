import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  GitCompare,
  Plus,
  Trash2,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  Layers,
  History,
  FileText,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { FriendModal } from './FriendModal';
import { ShareModal } from './ShareModal';
import {
  compareTwoSemesters,
  compareUserWithFriend,
  generateGlobalAcademicInsights,
} from '../../lib/comparisonEngine';
import { calculateCGPA, getClassificationColor } from '../../lib/calculations';
import type { FriendProfile, SavedComparison } from '../../types';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Compare() {
  const { state, deleteFriend, addSavedComparison, deleteSavedComparison } = useApp();
  const { semesters, settings, friends = [], savedComparisons = [] } = state;

  const [activeTab, setActiveTab] = useState<'semesters' | 'friends' | 'matrix' | 'journey' | 'history'>('semesters');
  const [customTitle, setCustomTitle] = useState('Academic Comparison Showdown');

  // Semester vs Semester Selection
  const validSemesters = semesters.filter((s) => s.subjects.length > 0 || s.totalCredits > 0);
  const [semAId, setSemAId] = useState<string>(validSemesters[0]?.id || '');
  const [semBId, setSemBId] = useState<string>(validSemesters[validSemesters.length - 1]?.id || '');

  // Friend Selection
  const [selectedFriendId, setSelectedFriendId] = useState<string>(friends[0]?.id || '');

  // Modals
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [friendToEdit, setFriendToEdit] = useState<FriendProfile | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Multi-semester selection for Journey Timeline
  const [selectedJourneySemIds, setSelectedJourneySemIds] = useState<string[]>(
    validSemesters.map((s) => s.id)
  );

  const cgpaResult = calculateCGPA(semesters, settings.cgpaToPercentageMultiplier);

  // Calculations
  const semA = validSemesters.find((s) => s.id === semAId) || validSemesters[0];
  const semB = validSemesters.find((s) => s.id === semBId) || validSemesters[validSemesters.length - 1];

  const semComparison = semA && semB && semA.id !== semB.id ? compareTwoSemesters(semA, semB) : null;
  const selectedFriend = friends.find((f) => f.id === selectedFriendId);

  const friendComparison = selectedFriend
    ? compareUserWithFriend(
        cgpaResult.cgpa,
        semB?.sgpa || 0,
        cgpaResult.totalCredits,
        semesters,
        selectedFriend,
        customTitle
      )
    : null;

  const globalInsights = generateGlobalAcademicInsights(cgpaResult.cgpa, semesters, friends);

  // Leaderboard ranking (User + Friends)
  const leaderboard = [
    { id: 'user', name: settings.studentName || 'You (User)', title: 'Current CGPA', cgpa: cgpaResult.cgpa, isUser: true },
    ...friends.map((f) => ({ id: f.id, name: f.name, title: f.title, cgpa: f.cgpa, isUser: false })),
  ].sort((a, b) => b.cgpa - a.cgpa);

  const handleSaveCurrentComparison = () => {
    addSavedComparison({
      title: customTitle,
      type: activeTab === 'friends' ? 'friend-comparison' : 'semester-vs-semester',
      targetA: semAId || 'semA',
      targetB: selectedFriendId || semBId || 'semB',
    });
  };

  const toggleJourneySem = (id: string) => {
    if (selectedJourneySemIds.includes(id)) {
      if (selectedJourneySemIds.length > 1) {
        setSelectedJourneySemIds(selectedJourneySemIds.filter((sId) => sId !== id));
      }
    } else {
      setSelectedJourneySemIds([...selectedJourneySemIds, id]);
    }
  };

  // Previous vs Current Quick Comparison
  const prevSemester = validSemesters.length > 1 ? validSemesters[validSemesters.length - 2] : null;
  const currentSemester = validSemesters.length > 0 ? validSemesters[validSemesters.length - 1] : null;
  const quickSemDiff = currentSemester && prevSemester ? currentSemester.sgpa - prevSemester.sgpa : 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="space-y-8">
      {/* Hero Banner */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-primary)' }}>
            <GitCompare className="w-3.5 h-3.5" style={{ color: '#c8ff00' }} />
            <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>Academic Benchmarking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Compare. Understand. <span className="text-gradient-accent">Improve.</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Turn academic performance into meaningful insights & benchmarks.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
          >
            <Share2 className="w-3.5 h-3.5" /> Share & Export
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSaveCurrentComparison}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-primary)', color: '#c8ff00' }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Save View
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Previous vs Current Banner */}
      {prevSemester && currentSemester && (
        <motion.div variants={fadeUp} className="card p-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: '#c8ff00' }}>
                VS
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Progress</p>
                <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {prevSemester.name} ({prevSemester.sgpa.toFixed(2)}) → {currentSemester.name} ({currentSemester.sgpa.toFixed(2)})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${quickSemDiff >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {quickSemDiff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : quickSemDiff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {quickSemDiff > 0 ? '+' : ''}{quickSemDiff.toFixed(2)} SGPA ({((quickSemDiff / prevSemester.sgpa) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Title Input */}
      <motion.div variants={fadeUp} className="card p-4 flex items-center gap-3">
        <Edit2 className="w-4 h-4 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Give this comparison a title (e.g. Me vs Rahul, Semester 5 Battle)..."
          className="w-full bg-transparent font-heading font-semibold text-sm focus:outline-none placeholder:text-[var(--text-muted)]"
          style={{ color: 'var(--text-primary)' }}
        />
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 pb-2 border-b border-[var(--border-primary)]">
        {[
          { id: 'semesters', label: 'My Semesters', icon: BookOpen },
          { id: 'friends', label: 'Friend Benchmark', icon: Users },
          { id: 'matrix', label: 'Subject Matrix', icon: Layers },
          { id: 'journey', label: 'Academic Journey', icon: TrendingUp },
          { id: 'history', label: `Saved (${savedComparisons.length})`, icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all"
              style={{
                background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)',
                color: isActive ? '#c8ff00' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--border-hover)' : '1px solid var(--border-primary)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* TAB 1: MY SEMESTERS COMPARISON */}
      {activeTab === 'semesters' && (
        <motion.div variants={fadeUp} className="space-y-6">
          {validSemesters.length < 2 ? (
            <div className="card p-8 text-center space-y-3">
              <BookOpen className="w-8 h-8 mx-auto opacity-40" style={{ color: 'var(--text-tertiary)' }} />
              <h3 className="text-base font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Need at least 2 semesters</h3>
              <p className="text-xs font-mono max-w-md mx-auto" style={{ color: 'var(--text-tertiary)' }}>
                Add subjects to at least two semesters to perform side-by-side semester comparison.
              </p>
            </div>
          ) : (
            <>
              {/* Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-4">
                  <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Semester A</label>
                  <select
                    value={semAId}
                    onChange={(e) => setSemAId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-heading text-xs focus:outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                  >
                    {validSemesters.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: 'var(--bg-surface)' }}>
                        {s.name} (SGPA: {s.sgpa.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="card p-4">
                  <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Semester B</label>
                  <select
                    value={semBId}
                    onChange={(e) => setSemBId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl font-heading text-xs focus:outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                  >
                    {validSemesters.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: 'var(--bg-surface)' }}>
                        {s.name} (SGPA: {s.sgpa.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Showdown Card */}
              {semA && semB && (
                <div className="card p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{semA.name}</span>
                      <p className="text-4xl font-display font-extrabold" style={{ color: getClassificationColor(semA.sgpa) }}>
                        <AnimatedNumber value={semA.sgpa} />
                      </p>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{semA.totalCredits} credits</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm mb-1" style={{ background: 'var(--accent-dim)', color: '#c8ff00', border: '1px solid var(--border-hover)' }}>
                        VS
                      </div>
                      {semComparison && (
                        <span className={`text-xs font-mono font-bold ${semComparison.sgpaDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {semComparison.sgpaDiff > 0 ? '+' : ''}{semComparison.sgpaDiff.toFixed(2)} SGPA
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{semB.name}</span>
                      <p className="text-4xl font-display font-extrabold" style={{ color: getClassificationColor(semB.sgpa) }}>
                        <AnimatedNumber value={semB.sgpa} />
                      </p>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{semB.totalCredits} credits</p>
                    </div>
                  </div>

                  {/* Dynamic Insights */}
                  {semComparison && semComparison.insights.length > 0 && (
                    <div className="p-4 rounded-xl space-y-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Automated Comparison Insights</span>
                      {semComparison.insights.map((ins, i) => (
                        <p key={i} className="text-xs font-mono flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          {ins}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* TAB 2: FRIEND BENCHMARK & LEADERBOARD */}
      {activeTab === 'friends' && (
        <motion.div variants={fadeUp} className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Friend & Classmate Benchmarks
            </p>
            <button
              onClick={() => { setFriendToEdit(null); setIsFriendModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold"
              style={{ background: '#c8ff00', color: '#0a0a0a' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Friend Profile
            </button>
          </div>

          {/* Academic Leaderboard */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-heading font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Award className="w-4 h-4 text-amber-400" /> Academic Benchmark Ranking
            </h3>
            <div className="space-y-2">
              {leaderboard.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl transition-all"
                  style={{
                    background: item.isUser ? 'var(--accent-dim)' : 'var(--bg-card)',
                    border: item.isUser ? '1px solid var(--border-hover)' : '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                      style={{ background: idx === 0 ? '#c8ff00' : 'var(--bg-elevated)', color: idx === 0 ? '#0a0a0a' : 'var(--text-secondary)' }}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.name} {item.isUser && <span className="text-[10px] font-mono text-emerald-400 ml-1">(You)</span>}
                      </p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{item.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-display font-bold" style={{ color: getClassificationColor(item.cgpa) }}>
                      {item.cgpa.toFixed(2)} <span className="text-[10px] font-mono font-normal opacity-60">CGPA</span>
                    </p>
                    {!item.isUser && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setFriendToEdit(friends.find(f => f.id === item.id) || null); setIsFriendModalOpen(true); }}
                          className="p-1 opacity-50 hover:opacity-100 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFriend(item.id)}
                          className="p-1 text-red-400 opacity-60 hover:opacity-100 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Friend Head-to-Head */}
          {friends.length > 0 && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Head-to-Head Showdown</span>
                <select
                  value={selectedFriendId}
                  onChange={(e) => setSelectedFriendId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl font-heading text-xs focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                >
                  {friends.map((f) => (
                    <option key={f.id} value={f.id} style={{ background: 'var(--bg-surface)' }}>
                      Compare with {f.name} ({f.cgpa.toFixed(2)} CGPA)
                    </option>
                  ))}
                </select>
              </div>

              {friendComparison && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center pt-2">
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Your CGPA</p>
                    <p className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{friendComparison.itemACGPA?.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-xl flex flex-col items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                    <span className="text-xs font-mono font-bold" style={{ color: '#c8ff00' }}>
                      {friendComparison.cgpaDiff && friendComparison.cgpaDiff > 0 ? `+${friendComparison.cgpaDiff.toFixed(2)} Lead` : `${friendComparison.cgpaDiff?.toFixed(2)} Difference`}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{friendComparison.itemBName}'s CGPA</p>
                    <p className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{friendComparison.itemBCGPA?.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 3: SUBJECT-BY-SUBJECT MATRIX */}
      {activeTab === 'matrix' && (
        <motion.div variants={fadeUp} className="card p-6 space-y-4">
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
            Subject-by-Subject Grade Matrix
          </h3>
          <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Comparing subject scores across matching courses.
          </p>

          {semComparison && semComparison.sharedSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-left uppercase text-[10px]" style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
                    <th className="py-2.5 pr-4">Subject</th>
                    <th className="py-2.5 pr-4">{semComparison.itemAName}</th>
                    <th className="py-2.5 pr-4">{semComparison.itemBName}</th>
                    <th className="py-2.5">Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {semComparison.sharedSubjects.map((sub, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                      <td className="py-3 pr-4 font-heading font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{sub.name}</td>
                      <td className="py-3 pr-4 font-bold">{sub.gradeA} ({sub.gpA})</td>
                      <td className="py-3 pr-4 font-bold">{sub.gradeB} ({sub.gpB})</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.winner === 'B' ? 'bg-emerald-500/10 text-emerald-400' : sub.winner === 'A' ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400'}`}>
                          {sub.winner === 'Equal' ? 'Equal' : `${sub.winner === 'B' ? semComparison.itemBName : semComparison.itemAName} Higher`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs font-mono py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              No overlapping subject names found between selected comparison targets. Name subjects identically to see matrix highlights!
            </p>
          )}
        </motion.div>
      )}

      {/* TAB 4: ACADEMIC JOURNEY & RECHARTS */}
      {activeTab === 'journey' && (
        <motion.div variants={fadeUp} className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-heading font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Multi-Semester Journey Timeline
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {validSemesters.map((s) => {
                const isSelected = selectedJourneySemIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleJourneySem(s.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
                    style={{
                      background: isSelected ? 'var(--accent-dim)' : 'var(--bg-card)',
                      border: isSelected ? '1px solid var(--border-hover)' : '1px solid var(--border-primary)',
                      color: isSelected ? '#c8ff00' : 'var(--text-tertiary)',
                    }}
                  >
                    {s.name} ({s.sgpa.toFixed(2)})
                  </button>
                );
              })}
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={validSemesters.filter((s) => selectedJourneySemIds.includes(s.id)).map((s) => ({ name: s.name, sgpa: s.sgpa, credits: s.totalCredits }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
                  <Tooltip />
                  <Bar dataKey="sgpa" fill="#c8ff00" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: SAVED HISTORY */}
      {activeTab === 'history' && (
        <motion.div variants={fadeUp} className="card p-6 space-y-4">
          <h3 className="text-sm font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>
            Saved Comparison History
          </h3>
          {savedComparisons.length === 0 ? (
            <p className="text-xs font-mono text-center py-8" style={{ color: 'var(--text-muted)' }}>
              No saved comparison presets yet. Click "Save View" at the top right to bookmark comparisons.
            </p>
          ) : (
            <div className="space-y-2">
              {savedComparisons.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                  <div>
                    <p className="text-xs font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>Saved on {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => deleteSavedComparison(c.id)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <FriendModal isOpen={isFriendModalOpen} onClose={() => setIsFriendModalOpen(false)} friendToEdit={friendToEdit} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </motion.div>
  );
}
