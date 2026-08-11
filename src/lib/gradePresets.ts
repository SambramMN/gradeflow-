import { GradePreset } from '../types';

export const GRADE_PRESETS: GradePreset[] = [
  {
    id: 'indian-10',
    name: 'Indian University (10-point)',
    grades: [
      { grade: 'O', point: 10 },
      { grade: 'A+', point: 9 },
      { grade: 'A', point: 8 },
      { grade: 'B+', point: 7 },
      { grade: 'B', point: 6 },
      { grade: 'C', point: 5 },
      { grade: 'P', point: 4 },
      { grade: 'F', point: 0 },
    ],
  },
  {
    id: 'vtu',
    name: 'VTU (Visvesvaraya Technological University)',
    grades: [
      { grade: 'S', point: 10 },
      { grade: 'A', point: 9 },
      { grade: 'B', point: 8 },
      { grade: 'C', point: 7 },
      { grade: 'D', point: 6 },
      { grade: 'E', point: 5 },
      { grade: 'P', point: 4 },
      { grade: 'F', point: 0 },
    ],
  },
  {
    id: 'anna-university',
    name: 'Anna University',
    grades: [
      { grade: 'O', point: 10 },
      { grade: 'A+', point: 9 },
      { grade: 'A', point: 8 },
      { grade: 'B+', point: 7 },
      { grade: 'B', point: 6 },
      { grade: 'C', point: 5 },
      { grade: 'RA', point: 0 },
    ],
  },
  {
    id: 'us-4',
    name: 'US University (4.0 Scale)',
    grades: [
      { grade: 'A+', point: 4.0 },
      { grade: 'A', point: 4.0 },
      { grade: 'A-', point: 3.7 },
      { grade: 'B+', point: 3.3 },
      { grade: 'B', point: 3.0 },
      { grade: 'B-', point: 2.7 },
      { grade: 'C+', point: 2.3 },
      { grade: 'C', point: 2.0 },
      { grade: 'C-', point: 1.7 },
      { grade: 'D+', point: 1.3 },
      { grade: 'D', point: 1.0 },
      { grade: 'F', point: 0 },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai University',
    grades: [
      { grade: 'O', point: 10 },
      { grade: 'A', point: 9 },
      { grade: 'B', point: 8 },
      { grade: 'C', point: 7 },
      { grade: 'D', point: 6 },
      { grade: 'E', point: 5 },
      { grade: 'P', point: 4 },
      { grade: 'F', point: 0 },
    ],
  },
];

export const DEFAULT_GRADE_SYSTEM = GRADE_PRESETS[0].grades;
