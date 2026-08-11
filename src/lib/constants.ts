import type { UserSettings } from '../types';
import { DEFAULT_GRADE_SYSTEM } from './gradePresets';

export const APP_NAME = 'GradeFlow';

export const DEFAULT_SETTINGS: UserSettings = {
  studentName: '',
  university: '',
  course: '',
  currentSemester: 1,
  gradeSystem: DEFAULT_GRADE_SYSTEM,
  cgpaToPercentageMultiplier: 10,
  theme: 'dark',
  animationsEnabled: true,
  targetCGPA: 8.0,
};

export const PERFORMANCE_CLASSIFICATIONS = [
  { min: 9.0, label: 'Outstanding', color: '#22c55e' },
  { min: 8.0, label: 'Excellent', color: '#3b82f6' },
  { min: 7.0, label: 'Very Good', color: '#8b5cf6' },
  { min: 6.0, label: 'Good', color: '#f59e0b' },
  { min: 5.0, label: 'Average', color: '#f97316' },
  { min: 4.0, label: 'Below Average', color: '#ef4444' },
  { min: 0, label: 'Poor', color: '#dc2626' },
];

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Semesters', path: '/semesters', icon: 'BookOpen' },
  { label: 'SGPA', path: '/sgpa', icon: 'Calculator' },
  { label: 'CGPA', path: '/cgpa', icon: 'GraduationCap' },
  { label: 'What-If', path: '/what-if', icon: 'FlaskConical' },
  { label: 'Target', path: '/target', icon: 'Target' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];
