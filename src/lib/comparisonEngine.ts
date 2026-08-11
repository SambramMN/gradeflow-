import type { Semester, Subject, FriendProfile } from '../types';
import { getClassification } from './calculations';

export interface ComparisonResult {
  title: string;
  itemAName: string;
  itemBName: string;
  itemASGPA: number;
  itemBSGPA: number;
  itemACGPA?: number;
  itemBCGPA?: number;
  itemACredits: number;
  itemBCredits: number;
  sgpaDiff: number;
  cgpaDiff?: number;
  creditDiff: number;
  percentageDiff: number;
  status: 'improved' | 'declined' | 'stable';
  bestSubjectA?: string;
  bestSubjectB?: string;
  sharedSubjects: Array<{
    name: string;
    gradeA: string;
    gradeB: string;
    gpA: number;
    gpB: number;
    winner: 'A' | 'B' | 'Equal';
  }>;
  insights: string[];
}

export function compareTwoSemesters(semA: Semester, semB: Semester): ComparisonResult {
  const sgpaDiff = semB.sgpa - semA.sgpa;
  const creditDiff = semB.totalCredits - semA.totalCredits;
  const percentageDiff = semA.sgpa > 0 ? ((semB.sgpa - semA.sgpa) / semA.sgpa) * 100 : 0;

  const status: 'improved' | 'declined' | 'stable' =
    Math.abs(sgpaDiff) < 0.01 ? 'stable' : sgpaDiff > 0 ? 'improved' : 'declined';

  // Compare shared subjects by subject name (case-insensitive)
  const sharedSubjects: ComparisonResult['sharedSubjects'] = [];
  semA.subjects.forEach((subA) => {
    const matchingSubB = semB.subjects.find(
      (subB) => subB.name.trim().toLowerCase() === subA.name.trim().toLowerCase()
    );
    if (matchingSubB) {
      const winner =
        subA.gradePoint > matchingSubB.gradePoint
          ? 'A'
          : matchingSubB.gradePoint > subA.gradePoint
          ? 'B'
          : 'Equal';
      sharedSubjects.push({
        name: subA.name,
        gradeA: subA.grade,
        gradeB: matchingSubB.grade,
        gpA: subA.gradePoint,
        gpB: matchingSubB.gradePoint,
        winner,
      });
    }
  });

  const bestA = [...semA.subjects].sort((a, b) => b.gradePoint - a.gradePoint)[0]?.name || 'N/A';
  const bestB = [...semB.subjects].sort((a, b) => b.gradePoint - a.gradePoint)[0]?.name || 'N/A';

  const insights: string[] = [];
  if (status === 'improved') {
    insights.push(`Your SGPA increased by +${sgpaDiff.toFixed(2)} (${percentageDiff.toFixed(1)}% improvement) in ${semB.name} compared to ${semA.name}.`);
  } else if (status === 'declined') {
    insights.push(`Your SGPA dropped by ${sgpaDiff.toFixed(2)} in ${semB.name} compared to ${semA.name}.`);
  } else {
    insights.push(`Your performance remained stable across ${semA.name} and ${semB.name}.`);
  }

  if (creditDiff !== 0) {
    insights.push(`You took ${Math.abs(creditDiff)} ${creditDiff > 0 ? 'more' : 'fewer'} credits in ${semB.name}.`);
  }

  if (sharedSubjects.length > 0) {
    const winsB = sharedSubjects.filter((s) => s.winner === 'B').length;
    insights.push(`Out of ${sharedSubjects.length} matching subjects, you scored higher in ${winsB} in ${semB.name}.`);
  }

  return {
    title: `${semA.name} vs ${semB.name}`,
    itemAName: semA.name,
    itemBName: semB.name,
    itemASGPA: semA.sgpa,
    itemBSGPA: semB.sgpa,
    itemACredits: semA.totalCredits,
    itemBCredits: semB.totalCredits,
    sgpaDiff,
    creditDiff,
    percentageDiff,
    status,
    bestSubjectA: bestA,
    bestSubjectB: bestB,
    sharedSubjects,
    insights,
  };
}

export function compareUserWithFriend(
  userCGPA: number,
  userSGPA: number,
  userCredits: number,
  userSemesters: Semester[],
  friend: FriendProfile,
  customTitle?: string
): ComparisonResult {
  const cgpaDiff = userCGPA - friend.cgpa;
  const sgpaDiff = userSGPA - friend.sgpa;
  const creditDiff = userCredits - friend.credits;
  const percentageDiff = friend.cgpa > 0 ? ((userCGPA - friend.cgpa) / friend.cgpa) * 100 : 0;

  const status: 'improved' | 'declined' | 'stable' =
    Math.abs(cgpaDiff) < 0.01 ? 'stable' : cgpaDiff > 0 ? 'improved' : 'declined';

  // Compare shared subjects across user's all semesters and friend's subjects
  const allUserSubjects: Subject[] = userSemesters.flatMap((s) => s.subjects);
  const sharedSubjects: ComparisonResult['sharedSubjects'] = [];

  friend.subjects.forEach((fSub) => {
    const userSub = allUserSubjects.find(
      (uSub) => uSub.name.trim().toLowerCase() === fSub.name.trim().toLowerCase()
    );
    if (userSub) {
      const winner =
        userSub.gradePoint > fSub.gradePoint
          ? 'A'
          : fSub.gradePoint > userSub.gradePoint
          ? 'B'
          : 'Equal';
      sharedSubjects.push({
        name: fSub.name,
        gradeA: userSub.grade,
        gradeB: fSub.grade,
        gpA: userSub.gradePoint,
        gpB: fSub.gradePoint,
        winner,
      });
    }
  });

  const insights: string[] = [];
  if (cgpaDiff > 0) {
    insights.push(`Your CGPA is +${cgpaDiff.toFixed(2)} points higher than ${friend.name}'s.`);
  } else if (cgpaDiff < 0) {
    insights.push(`${friend.name}'s CGPA is +${Math.abs(cgpaDiff).toFixed(2)} points higher than yours.`);
  } else {
    insights.push(`You and ${friend.name} have an identical CGPA of ${userCGPA.toFixed(2)}.`);
  }

  if (creditDiff !== 0) {
    insights.push(`You have completed ${Math.abs(creditDiff)} ${creditDiff > 0 ? 'more' : 'fewer'} credits than ${friend.name}.`);
  }

  if (sharedSubjects.length > 0) {
    const userWins = sharedSubjects.filter((s) => s.winner === 'A').length;
    insights.push(`In ${sharedSubjects.length} shared subjects, you performed better in ${userWins}.`);
  }

  return {
    title: customTitle || `Me vs ${friend.name}`,
    itemAName: 'You',
    itemBName: friend.name,
    itemASGPA: userSGPA,
    itemBSGPA: friend.sgpa,
    itemACGPA: userCGPA,
    itemBCGPA: friend.cgpa,
    itemACredits: userCredits,
    itemBCredits: friend.credits,
    sgpaDiff,
    cgpaDiff,
    creditDiff,
    percentageDiff,
    status,
    sharedSubjects,
    insights,
  };
}

export function generateGlobalAcademicInsights(
  userCGPA: number,
  semesters: Semester[],
  friends: FriendProfile[]
): string[] {
  const insights: string[] = [];

  if (semesters.length > 0) {
    const validSems = semesters.filter((s) => s.subjects.length > 0);
    if (validSems.length >= 2) {
      const latest = validSems[validSems.length - 1];
      const prev = validSems[validSems.length - 2];
      const diff = latest.sgpa - prev.sgpa;
      if (diff > 0) {
        insights.push(`You improved your SGPA by +${diff.toFixed(2)} in ${latest.name} compared to ${prev.name}.`);
      } else if (diff < 0) {
        insights.push(`Your SGPA changed by ${diff.toFixed(2)} in ${latest.name}.`);
      }
    }

    const totalSubjects = semesters.reduce((sum, s) => sum + s.subjects.length, 0);
    insights.push(`You have tracked ${totalSubjects} subjects across ${semesters.length} semesters.`);
  }

  if (friends && friends.length > 0) {
    const leaderboard = [
      { name: 'You', cgpa: userCGPA },
      ...friends.map((f) => ({ name: f.name, cgpa: f.cgpa })),
    ].sort((a, b) => b.cgpa - a.cgpa);

    const userRank = leaderboard.findIndex((item) => item.name === 'You') + 1;
    insights.push(`You rank #${userRank} out of ${leaderboard.length} students in your benchmark comparison list.`);
  }

  return insights;
}
