// ─── Grade System ───────────────────────────────────────────────────────────

export interface GradeEntry {
  grade: string;
  point: number;
}

export interface GradePreset {
  id: string;
  name: string;
  grades: GradeEntry[];
}

// ─── Subject ────────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade: string;
  gradePoint: number;
  internalMarks?: number;
  externalMarks?: number;
}

// ─── Semester ───────────────────────────────────────────────────────────────

export interface Semester {
  id: string;
  name: string;
  number: number;
  subjects: Subject[];
  sgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  createdAt: string;
}

// ─── Friend / Classmate Comparison Profile ──────────────────────────────────

export interface FriendSubject {
  id: string;
  name: string;
  grade: string;
  gradePoint: number;
  credits: number;
}

export interface FriendProfile {
  id: string;
  name: string;
  title: string;
  university: string;
  course: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  credits: number;
  subjects: FriendSubject[];
  createdAt: string;
}

// ─── Saved Comparison ───────────────────────────────────────────────────────

export interface SavedComparison {
  id: string;
  title: string;
  type: 'semester-vs-semester' | 'friend-comparison' | 'what-if-comparison';
  targetA: string;
  targetB: string;
  createdAt: string;
}

// ─── Student Profile ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  university: string;
  college?: string;
  course: string;
  branch?: string;
  academicYear?: string;
  currentSemester: number;
  studentId?: string;
  createdAt: string;
}

// ─── Settings ───────────────────────────────────────────────────────────────

export interface UserSettings {
  studentName: string;
  university: string;
  college?: string;
  course: string;
  branch?: string;
  academicYear?: string;
  studentId?: string;
  currentSemester: number;
  gradeSystem: GradeEntry[];
  cgpaToPercentageMultiplier: number;
  theme: 'light' | 'dark' | 'system';
  animationsEnabled: boolean;
  targetCGPA: number;
  syncEnabled?: boolean;
}

// ─── App Data ──────────────────────────────────────────────────────────────

export interface AppData {
  profiles: UserProfile[];
  activeProfileId: string;
  semesters: Semester[];
  settings: UserSettings;
  hasOnboarded: boolean;
  friends: FriendProfile[];
  savedComparisons: SavedComparison[];
}

// ─── Calculation Results ────────────────────────────────────────────────────

export interface SGPAResult {
  sgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  classification: string;
}

export interface CGPAResult {
  cgpa: number;
  percentage: number;
  totalCredits: number;
  completedSemesters: number;
}

export interface TargetCGPAResult {
  requiredSGPA: number;
  isAchievable: boolean;
  message: string;
}

export interface WhatIfResult {
  currentCGPA: number;
  projectedCGPA: number;
  change: number;
  changeDirection: 'up' | 'down' | 'same';
}

export interface SemesterComparison {
  semester: Semester;
  sgpa: number;
  totalCredits: number;
  gradeDistribution: Record<string, number>;
}

export interface SubjectPerformanceData {
  bestSubjects: Subject[];
  weakestSubjects: Subject[];
  highestGrade: Subject | null;
  lowestGrade: Subject | null;
  averageGradePoint: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
