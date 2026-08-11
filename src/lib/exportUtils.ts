import jsPDF from 'jspdf';
import type { Semester, CGPAResult, UserSettings, FriendProfile } from '../types';
import { getClassification } from './calculations';

// ─── CSV Export Function ───────────────────────────────────────────────────

export function exportAcademicCSV(
  studentName: string,
  university: string,
  course: string,
  semesters: Semester[],
  friends: FriendProfile[]
): void {
  const lines: string[] = [];

  // Header Info
  lines.push(`Academic Performance Summary - ${studentName || 'Student'}`);
  lines.push(`University,${university || 'N/A'}`);
  lines.push(`Course,${course || 'N/A'}`);
  lines.push(`Export Date,${new Date().toLocaleDateString()}`);
  lines.push('');

  // Semesters Breakdown
  lines.push('--- SEMESTERS BREAKDOWN ---');
  lines.push('Semester,Subject Name,Subject Code,Credits,Grade,Grade Point');

  semesters.forEach((sem) => {
    if (sem.subjects.length === 0) {
      lines.push(`"${sem.name}",No Subjects Entered,"",0,"",0`);
    } else {
      sem.subjects.forEach((sub) => {
        lines.push(
          `"${sem.name}","${sub.name.replace(/"/g, '""')}","${sub.code.replace(/"/g, '""')}",${sub.credits},"${sub.grade}",${sub.gradePoint}`
        );
      });
    }
  });

  lines.push('');
  lines.push('--- SEMESTER SUMMARY ---');
  lines.push('Semester,SGPA,Total Credits,Total Grade Points,Classification');
  semesters.forEach((sem) => {
    lines.push(
      `"${sem.name}",${sem.sgpa.toFixed(2)},${sem.totalCredits},${sem.totalGradePoints},"${getClassification(sem.sgpa)}"`
    );
  });

  // Friend Profiles Benchmark
  if (friends && friends.length > 0) {
    lines.push('');
    lines.push('--- ACADEMIC BENCHMARK & FRIENDS LEADERBOARD ---');
    lines.push('Name,Title / Badge,Semester,CGPA,SGPA,Credits');
    friends.forEach((f) => {
      lines.push(
        `"${f.name.replace(/"/g, '""')}","${f.title.replace(/"/g, '""')}",${f.semester},${f.cgpa.toFixed(2)},${f.sgpa.toFixed(2)},${f.credits}`
      );
    });
  }

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `academic-performance-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── PDF Transcript / Report Generator ─────────────────────────────────────

export function generateAcademicPDF(
  settings: UserSettings,
  semesters: Semester[],
  cgpaResult: CGPAResult,
  insights: string[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(200, 255, 0); // Lime
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('GRADEFLOW', 14, 16);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL ACADEMIC PERFORMANCE TRANSCRIPT', 14, 23);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 23, { align: 'right' });

  y = 42;

  // Student Details Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, y, pageWidth - 28, 24, 3, 3, 'F');

  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(settings.studentName || 'Student', 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`University: ${settings.university || 'N/A'}`, 18, y + 15);
  doc.text(`Course: ${settings.course || 'N/A'}`, 18, y + 20);

  // Cumulative Metrics Summary on right of box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text(`CGPA: ${cgpaResult.cgpa.toFixed(2)}`, pageWidth - 20, y + 10, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Percentage: ${cgpaResult.percentage.toFixed(1)}%`, pageWidth - 20, y + 16, { align: 'right' });
  doc.text(`Total Credits: ${cgpaResult.totalCredits}`, pageWidth - 20, y + 20, { align: 'right' });

  y += 32;

  // Semesters Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('Semester Academic Breakdown', 14, y);
  y += 6;

  semesters.forEach((sem) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    // Semester Header Bar
    doc.setFillColor(235, 235, 235);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(`${sem.name}`, 16, y + 5);
    doc.text(`SGPA: ${sem.sgpa.toFixed(2)} | Credits: ${sem.totalCredits}`, pageWidth - 16, y + 5, { align: 'right' });
    y += 9;

    if (sem.subjects.length > 0) {
      // Table Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('SUBJECT', 16, y);
      doc.text('CODE', 90, y);
      doc.text('CREDITS', 130, y);
      doc.text('GRADE', 160, y);
      doc.text('GRADE POINT', pageWidth - 16, y, { align: 'right' });
      y += 4;
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, pageWidth - 14, y);
      y += 4;

      // Subject Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);

      sem.subjects.forEach((sub) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(sub.name || 'Subject', 16, y);
        doc.text(sub.code || '—', 90, y);
        doc.text(sub.credits.toString(), 130, y);
        doc.text(sub.grade, 160, y);
        doc.text(sub.gradePoint.toString(), pageWidth - 16, y, { align: 'right' });
        y += 5;
      });
      y += 3;
    }
  });

  // Dynamic Insights Section
  if (insights.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text('Academic Insights & Summary', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    insights.forEach((insight) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(`•  ${insight}`, 16, y);
      y += 5;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('GradeFlow Academic Performance Platform • 100% Client-Side Private Document', pageWidth / 2, 290, { align: 'center' });

  doc.save(`GradeFlow-Transcript-${settings.studentName || 'Student'}.pdf`);
}
