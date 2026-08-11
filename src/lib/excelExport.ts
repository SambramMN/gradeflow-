import * as XLSX from 'xlsx';
import type { Semester, UserSettings, FriendProfile, CGPAResult } from '../types';
import { getClassification } from './calculations';

export function exportAcademicExcel(
  settings: UserSettings,
  semesters: Semester[],
  cgpaResult: CGPAResult,
  friends: FriendProfile[]
): void {
  const wb = XLSX.utils.book_new();

  // ─── Sheet 1: Student Profile & Summary ───────────────────────────────────
  const profileData = [
    ['GRADEFLOW ACADEMIC PERFORMANCE REPORT'],
    ['Generated Date', new Date().toLocaleDateString()],
    [''],
    ['STUDENT PROFILE'],
    ['Student Name', settings.studentName || 'Student'],
    ['University', settings.university || 'N/A'],
    ['College', settings.college || 'N/A'],
    ['Course', settings.course || 'N/A'],
    ['Branch / Major', settings.branch || 'N/A'],
    ['Academic Year', settings.academicYear || 'N/A'],
    ['Student ID', settings.studentId || 'N/A'],
    ['Current Semester', settings.currentSemester || 1],
    [''],
    ['CUMULATIVE PERFORMANCE SUMMARY'],
    ['Cumulative CGPA', cgpaResult.cgpa.toFixed(2)],
    ['Percentage Equivalent', `${cgpaResult.percentage.toFixed(1)}%`],
    ['Total Completed Credits', cgpaResult.totalCredits],
    ['Completed Semesters', cgpaResult.completedSemesters],
    ['Target CGPA', settings.targetCGPA || 'N/A'],
    ['Classification', getClassification(cgpaResult.cgpa)],
  ];
  const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
  XLSX.utils.book_append_sheet(wb, wsProfile, 'Profile Summary');

  // ─── Sheet 2: Semesters ───────────────────────────────────────────────────
  const semHeaders = ['Semester', 'SGPA', 'Total Credits', 'Total Grade Points', 'Classification'];
  const semRows = semesters.map((s) => [
    s.name,
    s.sgpa.toFixed(2),
    s.totalCredits,
    s.totalGradePoints,
    getClassification(s.sgpa),
  ]);
  const wsSemesters = XLSX.utils.aoa_to_sheet([semHeaders, ...semRows]);
  XLSX.utils.book_append_sheet(wb, wsSemesters, 'Semesters');

  // ─── Sheet 3: Subjects & Grades ───────────────────────────────────────────
  const subHeaders = ['Semester', 'Subject Name', 'Subject Code', 'Credits', 'Grade', 'Grade Point'];
  const subRows: any[][] = [];
  semesters.forEach((sem) => {
    sem.subjects.forEach((sub) => {
      subRows.push([sem.name, sub.name, sub.code || '—', sub.credits, sub.grade, sub.gradePoint]);
    });
  });
  const wsSubjects = XLSX.utils.aoa_to_sheet([subHeaders, ...subRows]);
  XLSX.utils.book_append_sheet(wb, wsSubjects, 'Subjects');

  // ─── Sheet 4: Comparisons & Friend Benchmarks ─────────────────────────────
  if (friends && friends.length > 0) {
    const friendHeaders = ['Rank', 'Name', 'Badge / Title', 'Semester', 'CGPA', 'SGPA', 'Credits'];
    const sortedFriends = [...friends].sort((a, b) => b.cgpa - a.cgpa);
    const friendRows = sortedFriends.map((f, i) => [
      i + 1,
      f.name,
      f.title,
      f.semester,
      f.cgpa.toFixed(2),
      f.sgpa.toFixed(2),
      f.credits,
    ]);
    const wsComparisons = XLSX.utils.aoa_to_sheet([friendHeaders, ...friendRows]);
    XLSX.utils.book_append_sheet(wb, wsComparisons, 'Friend Benchmarks');
  }

  // Save Excel file
  const filename = `${settings.studentName || 'Student'}_Academic_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
