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

// ─── Settings ───────────────────────────────────────────────────────────────

export interface UserSettings {
  studentName: string;
  university: string;
  course: string;
  currentSemester: number;
  gradeSystem: GradeEntry[];
  cgpaToPercentageMultiplier: number;
  theme: 'light' | 'dark' | 'system';
  animationsEnabled: boolean;
  targetCGPA: number;
}

// ─── App State ──────────────────────────────────────────────────────────────

export interface AppData {
  semesters: Semester[];
  settings: UserSettings;
  hasOnboarded: boolean;
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

// ─── Chart Data ─────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
}

// ─── Toast ──────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// ─── Navigation ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
