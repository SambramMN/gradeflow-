import type {
  Subject,
  Semester,
  GradeEntry,
  SGPAResult,
  CGPAResult,
  TargetCGPAResult,
  WhatIfResult,
  SubjectPerformanceData,
  SemesterComparison,
} from '../types';
import { PERFORMANCE_CLASSIFICATIONS } from './constants';

// ─── Utility ────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function round(value: number, decimals: number = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

export function getGradePoint(grade: string, gradeSystem: GradeEntry[]): number {
  const entry = gradeSystem.find((g) => g.grade === grade);
  return entry ? entry.point : 0;
}

export function getClassification(gpa: number): string {
  for (const c of PERFORMANCE_CLASSIFICATIONS) {
    if (gpa >= c.min) return c.label;
  }
  return 'N/A';
}

export function getClassificationColor(gpa: number): string {
  for (const c of PERFORMANCE_CLASSIFICATIONS) {
    if (gpa >= c.min) return c.color;
  }
  return '#6b7280';
}

// ─── SGPA Calculation ───────────────────────────────────────────────────────

export function calculateSGPA(subjects: Subject[]): SGPAResult {
  if (subjects.length === 0) {
    return { sgpa: 0, totalCredits: 0, totalGradePoints: 0, classification: 'N/A' };
  }

  const validSubjects = subjects.filter((s) => s.credits > 0);
  if (validSubjects.length === 0) {
    return { sgpa: 0, totalCredits: 0, totalGradePoints: 0, classification: 'N/A' };
  }

  const totalCredits = validSubjects.reduce((sum, s) => sum + s.credits, 0);
  const totalGradePoints = validSubjects.reduce(
    (sum, s) => sum + s.credits * s.gradePoint,
    0
  );

  if (totalCredits === 0) {
    return { sgpa: 0, totalCredits: 0, totalGradePoints: 0, classification: 'N/A' };
  }

  const sgpa = round(totalGradePoints / totalCredits);

  return {
    sgpa,
    totalCredits,
    totalGradePoints: round(totalGradePoints),
    classification: getClassification(sgpa),
  };
}

// ─── CGPA Calculation ───────────────────────────────────────────────────────

export function calculateCGPA(
  semesters: Semester[],
  multiplier: number = 10
): CGPAResult {
  const validSemesters = semesters.filter(
    (s) => s.subjects.length > 0 && s.totalCredits > 0
  );

  if (validSemesters.length === 0) {
    return { cgpa: 0, percentage: 0, totalCredits: 0, completedSemesters: 0 };
  }

  const totalCredits = validSemesters.reduce((sum, s) => sum + s.totalCredits, 0);
  const weightedSum = validSemesters.reduce(
    (sum, s) => sum + s.sgpa * s.totalCredits,
    0
  );

  if (totalCredits === 0) {
    return { cgpa: 0, percentage: 0, totalCredits: 0, completedSemesters: 0 };
  }

  const cgpa = round(weightedSum / totalCredits);
  const percentage = round(cgpa * multiplier);

  return {
    cgpa,
    percentage,
    totalCredits,
    completedSemesters: validSemesters.length,
  };
}

// ─── Target CGPA ────────────────────────────────────────────────────────────

export function calculateTargetCGPA(
  currentCGPA: number,
  completedCredits: number,
  targetCGPA: number,
  remainingCredits: number
): TargetCGPAResult {
  if (remainingCredits <= 0) {
    return {
      requiredSGPA: 0,
      isAchievable: false,
      message: 'Please enter valid remaining credits.',
    };
  }

  const totalCredits = completedCredits + remainingCredits;
  const requiredTotal = targetCGPA * totalCredits;
  const currentTotal = currentCGPA * completedCredits;
  const requiredSGPA = round((requiredTotal - currentTotal) / remainingCredits);

  if (requiredSGPA < 0) {
    return {
      requiredSGPA: 0,
      isAchievable: true,
      message: `You've already exceeded your target! Even with minimum grades, you'll surpass ${targetCGPA} CGPA.`,
    };
  }

  if (requiredSGPA > 10) {
    return {
      requiredSGPA,
      isAchievable: false,
      message: `To achieve ${targetCGPA} CGPA, you would need an SGPA of ${requiredSGPA}, which exceeds the maximum possible (10.0). Consider adjusting your target.`,
    };
  }

  return {
    requiredSGPA,
    isAchievable: true,
    message: `You need to maintain an average SGPA of ${requiredSGPA} across your remaining ${remainingCredits} credits to achieve your target CGPA of ${targetCGPA}.`,
  };
}

// ─── What-If Simulator ─────────────────────────────────────────────────────

export function calculateWhatIf(
  currentSemesters: Semester[],
  hypotheticalSubjects: Subject[],
  multiplier: number = 10
): WhatIfResult {
  const currentResult = calculateCGPA(currentSemesters, multiplier);

  // Create a hypothetical semester
  const hypotheticalSGPA = calculateSGPA(hypotheticalSubjects);

  const allSemesters: Semester[] = [
    ...currentSemesters,
    {
      id: 'hypothetical',
      name: 'Hypothetical',
      number: currentSemesters.length + 1,
      subjects: hypotheticalSubjects,
      sgpa: hypotheticalSGPA.sgpa,
      totalCredits: hypotheticalSGPA.totalCredits,
      totalGradePoints: hypotheticalSGPA.totalGradePoints,
      createdAt: new Date().toISOString(),
    },
  ];

  const projectedResult = calculateCGPA(allSemesters, multiplier);
  const change = round(projectedResult.cgpa - currentResult.cgpa);

  return {
    currentCGPA: currentResult.cgpa,
    projectedCGPA: projectedResult.cgpa,
    change,
    changeDirection: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
  };
}

// ─── Percentage Conversion ──────────────────────────────────────────────────

export function cgpaToPercentage(cgpa: number, multiplier: number): number {
  return round(cgpa * multiplier);
}

// ─── Semester Comparison ────────────────────────────────────────────────────

export function compareSemesters(semesters: Semester[]): SemesterComparison[] {
  return semesters
    .filter((s) => s.subjects.length > 0)
    .map((semester) => {
      const gradeDistribution: Record<string, number> = {};
      semester.subjects.forEach((subject) => {
        gradeDistribution[subject.grade] =
          (gradeDistribution[subject.grade] || 0) + 1;
      });

      return {
        semester,
        sgpa: semester.sgpa,
        totalCredits: semester.totalCredits,
        gradeDistribution,
      };
    });
}

// ─── Subject Performance ────────────────────────────────────────────────────

export function analyzeSubjectPerformance(
  semesters: Semester[]
): SubjectPerformanceData {
  const allSubjects = semesters.flatMap((s) => s.subjects);

  if (allSubjects.length === 0) {
    return {
      bestSubjects: [],
      weakestSubjects: [],
      highestGrade: null,
      lowestGrade: null,
      averageGradePoint: 0,
    };
  }

  const sorted = [...allSubjects].sort((a, b) => b.gradePoint - a.gradePoint);

  const totalGP = allSubjects.reduce((sum, s) => sum + s.gradePoint, 0);
  const averageGradePoint = round(totalGP / allSubjects.length);

  return {
    bestSubjects: sorted.slice(0, 5),
    weakestSubjects: sorted.slice(-5).reverse(),
    highestGrade: sorted[0] || null,
    lowestGrade: sorted[sorted.length - 1] || null,
    averageGradePoint,
  };
}

// ─── Grade Distribution (All semesters) ─────────────────────────────────────

export function getOverallGradeDistribution(
  semesters: Semester[]
): Record<string, number> {
  const distribution: Record<string, number> = {};
  semesters.forEach((semester) => {
    semester.subjects.forEach((subject) => {
      distribution[subject.grade] = (distribution[subject.grade] || 0) + 1;
    });
  });
  return distribution;
}

// ─── Create Default Subject ─────────────────────────────────────────────────

export function createDefaultSubject(gradeSystem: GradeEntry[]): Subject {
  const defaultGrade = gradeSystem[0];
  return {
    id: generateId(),
    name: '',
    code: '',
    credits: 3,
    grade: defaultGrade?.grade || 'O',
    gradePoint: defaultGrade?.point || 10,
  };
}

// ─── Create Default Semester ────────────────────────────────────────────────

export function createDefaultSemester(number: number): Semester {
  return {
    id: generateId(),
    name: `Semester ${number}`,
    number,
    subjects: [],
    sgpa: 0,
    totalCredits: 0,
    totalGradePoints: 0,
    createdAt: new Date().toISOString(),
  };
}

// ─── Recalculate semester SGPA ──────────────────────────────────────────────

export function recalculateSemester(semester: Semester): Semester {
  const result = calculateSGPA(semester.subjects);
  return {
    ...semester,
    sgpa: result.sgpa,
    totalCredits: result.totalCredits,
    totalGradePoints: result.totalGradePoints,
  };
}
