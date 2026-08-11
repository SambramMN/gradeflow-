import React, { createContext, useContext, useCallback, useEffect, useReducer } from 'react';
import type { AppData, Semester, Subject, UserSettings, Toast, FriendProfile, SavedComparison, UserProfile } from '../types';
import { loadAppData, saveAppData, clearAppData } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../lib/constants';
import {
  generateId,
  recalculateSemester,
  createDefaultSemester,
  createDefaultSubject,
  getGradePoint,
} from '../lib/calculations';

// ─── State ──────────────────────────────────────────────────────────────────

interface AppState extends AppData {
  toasts: Toast[];
}

// ─── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'SET_ONBOARDED' }
  | { type: 'ADD_SEMESTER' }
  | { type: 'UPDATE_SEMESTER'; payload: Semester }
  | { type: 'DELETE_SEMESTER'; payload: string }
  | { type: 'CLEAR_SEMESTER'; payload: string }
  | { type: 'DUPLICATE_SEMESTER'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: { semesterId: string; subject: Subject } }
  | { type: 'UPDATE_SUBJECT'; payload: { semesterId: string; subject: Subject } }
  | { type: 'DELETE_SUBJECT'; payload: { semesterId: string; subjectId: string } }
  | { type: 'REORDER_SUBJECTS'; payload: { semesterId: string; subjects: Subject[] } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'ADD_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_PROFILE'; payload: UserProfile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SWITCH_PROFILE'; payload: string }
  | { type: 'DUPLICATE_PROFILE'; payload: string }
  | { type: 'ADD_FRIEND'; payload: FriendProfile }
  | { type: 'UPDATE_FRIEND'; payload: FriendProfile }
  | { type: 'DELETE_FRIEND'; payload: string }
  | { type: 'ADD_SAVED_COMPARISON'; payload: SavedComparison }
  | { type: 'DELETE_SAVED_COMPARISON'; payload: string }
  | { type: 'RESET_DATA' }
  | { type: 'IMPORT_DATA'; payload: AppData }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload };

    case 'SET_ONBOARDED':
      return { ...state, hasOnboarded: true };

    case 'ADD_PROFILE': {
      const newProfiles = [...state.profiles, action.payload];
      return {
        ...state,
        profiles: newProfiles,
        activeProfileId: action.payload.id,
        semesters: [],
        settings: {
          ...state.settings,
          studentName: action.payload.name,
          university: action.payload.university,
          college: action.payload.college || '',
          course: action.payload.course,
          branch: action.payload.branch || '',
          currentSemester: action.payload.currentSemester,
          studentId: action.payload.studentId || '',
        },
      };
    }

    case 'UPDATE_PROFILE': {
      const updatedProfiles = state.profiles.map((p) =>
        p.id === action.payload.id ? action.payload : p
      );
      const isCurrentActive = action.payload.id === state.activeProfileId;
      return {
        ...state,
        profiles: updatedProfiles,
        settings: isCurrentActive
          ? {
              ...state.settings,
              studentName: action.payload.name,
              university: action.payload.university,
              college: action.payload.college || '',
              course: action.payload.course,
              branch: action.payload.branch || '',
              currentSemester: action.payload.currentSemester,
              studentId: action.payload.studentId || '',
            }
          : state.settings,
      };
    }

    case 'DELETE_PROFILE': {
      if (state.profiles.length <= 1) return state;
      const remainingProfiles = state.profiles.filter((p) => p.id !== action.payload);
      const nextActive = remainingProfiles[0];
      return {
        ...state,
        profiles: remainingProfiles,
        activeProfileId: nextActive.id,
        settings: {
          ...state.settings,
          studentName: nextActive.name,
          university: nextActive.university,
          course: nextActive.course,
        },
      };
    }

    case 'SWITCH_PROFILE': {
      const targetProfile = state.profiles.find((p) => p.id === action.payload);
      if (!targetProfile) return state;
      return {
        ...state,
        activeProfileId: targetProfile.id,
        settings: {
          ...state.settings,
          studentName: targetProfile.name,
          university: targetProfile.university,
          course: targetProfile.course,
        },
      };
    }

    case 'DUPLICATE_PROFILE': {
      const source = state.profiles.find((p) => p.id === action.payload);
      if (!source) return state;
      const dup: UserProfile = {
        ...source,
        id: generateId(),
        name: `${source.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      return { ...state, profiles: [...state.profiles, dup] };
    }

    case 'ADD_SEMESTER': {
      const newNumber = state.semesters.length + 1;
      const newSemester = createDefaultSemester(newNumber);
      return { ...state, semesters: [...state.semesters, newSemester] };
    }

    case 'UPDATE_SEMESTER': {
      const updated = recalculateSemester(action.payload);
      return {
        ...state,
        semesters: state.semesters.map((s) => (s.id === updated.id ? updated : s)),
      };
    }

    case 'DELETE_SEMESTER':
      return {
        ...state,
        semesters: state.semesters
          .filter((s) => s.id !== action.payload)
          .map((s, i) => ({ ...s, number: i + 1, name: `Semester ${i + 1}` })),
      };

    case 'CLEAR_SEMESTER': {
      return {
        ...state,
        semesters: state.semesters.map((s) =>
          s.id === action.payload
            ? { ...s, subjects: [], sgpa: 0, totalCredits: 0, totalGradePoints: 0 }
            : s
        ),
      };
    }

    case 'DUPLICATE_SEMESTER': {
      const source = state.semesters.find((s) => s.id === action.payload);
      if (!source) return state;
      const dup: Semester = {
        ...source,
        id: generateId(),
        name: `Semester ${state.semesters.length + 1}`,
        number: state.semesters.length + 1,
        subjects: source.subjects.map((sub) => ({ ...sub, id: generateId() })),
        createdAt: new Date().toISOString(),
      };
      return { ...state, semesters: [...state.semesters, dup] };
    }

    case 'ADD_SUBJECT': {
      return {
        ...state,
        semesters: state.semesters.map((s) => {
          if (s.id !== action.payload.semesterId) return s;
          const updated = { ...s, subjects: [...s.subjects, action.payload.subject] };
          return recalculateSemester(updated);
        }),
      };
    }

    case 'UPDATE_SUBJECT': {
      return {
        ...state,
        semesters: state.semesters.map((s) => {
          if (s.id !== action.payload.semesterId) return s;
          const updated = {
            ...s,
            subjects: s.subjects.map((sub) =>
              sub.id === action.payload.subject.id ? action.payload.subject : sub
            ),
          };
          return recalculateSemester(updated);
        }),
      };
    }

    case 'DELETE_SUBJECT': {
      return {
        ...state,
        semesters: state.semesters.map((s) => {
          if (s.id !== action.payload.semesterId) return s;
          const updated = {
            ...s,
            subjects: s.subjects.filter((sub) => sub.id !== action.payload.subjectId),
          };
          return recalculateSemester(updated);
        }),
      };
    }

    case 'REORDER_SUBJECTS': {
      return {
        ...state,
        semesters: state.semesters.map((s) =>
          s.id === action.payload.semesterId
            ? { ...s, subjects: action.payload.subjects }
            : s
        ),
      };
    }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'ADD_FRIEND':
      return {
        ...state,
        friends: [...(state.friends || []), action.payload],
      };

    case 'UPDATE_FRIEND':
      return {
        ...state,
        friends: (state.friends || []).map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };

    case 'DELETE_FRIEND':
      return {
        ...state,
        friends: (state.friends || []).filter((f) => f.id !== action.payload),
      };

    case 'ADD_SAVED_COMPARISON':
      return {
        ...state,
        savedComparisons: [...(state.savedComparisons || []), action.payload],
      };

    case 'DELETE_SAVED_COMPARISON':
      return {
        ...state,
        savedComparisons: (state.savedComparisons || []).filter((c) => c.id !== action.payload),
      };

    case 'RESET_DATA':
      return {
        profiles: [],
        activeProfileId: '',
        semesters: [],
        settings: DEFAULT_SETTINGS,
        hasOnboarded: false,
        friends: [],
        savedComparisons: [],
        toasts: state.toasts,
      };

    case 'IMPORT_DATA':
      return {
        ...state,
        ...action.payload,
        hasOnboarded: true,
      };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  addProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  updateProfile: (profile: UserProfile) => void;
  deleteProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  duplicateProfile: (id: string) => void;
  addSemester: () => void;
  updateSemester: (semester: Semester) => void;
  deleteSemester: (id: string) => void;
  clearSemester: (id: string) => void;
  duplicateSemester: (id: string) => void;
  addSubject: (semesterId: string) => void;
  updateSubject: (semesterId: string, subject: Subject) => void;
  deleteSubject: (semesterId: string, subjectId: string) => void;
  reorderSubjects: (semesterId: string, subjects: Subject[]) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addFriend: (friend: Omit<FriendProfile, 'id' | 'createdAt'>) => void;
  updateFriend: (friend: FriendProfile) => void;
  deleteFriend: (id: string) => void;
  addSavedComparison: (comparison: Omit<SavedComparison, 'id' | 'createdAt'>) => void;
  deleteSavedComparison: (id: string) => void;
  resetData: () => void;
  importData: (data: AppData) => void;
  setOnboarded: () => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  updateSubjectGrade: (semesterId: string, subjectId: string, grade: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialData = loadAppData();
  const [state, dispatch] = useReducer(reducer, {
    ...initialData,
    toasts: [],
  });

  // Ensure default profile exists
  useEffect(() => {
    if (!state.profiles || state.profiles.length === 0) {
      const defaultProf: UserProfile = {
        id: generateId(),
        name: state.settings.studentName || 'Default Student',
        university: state.settings.university || 'University',
        course: state.settings.course || 'B.Tech / B.E.',
        currentSemester: state.settings.currentSemester || 1,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PROFILE', payload: defaultProf });
    }
  }, []);

  // Persist on changes
  useEffect(() => {
    const { toasts: _, ...persistData } = state;
    saveAppData(persistData);
  }, [state.profiles, state.activeProfileId, state.semesters, state.settings, state.hasOnboarded, state.friends, state.savedComparisons]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = generateId();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type, duration: 4000 } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  const addProfile = useCallback(
    (profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
      const profile: UserProfile = {
        ...profileData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PROFILE', payload: profile });
      addToast(`Profile "${profile.name}" created`, 'success');
    },
    [addToast]
  );

  const updateProfile = useCallback(
    (profile: UserProfile) => {
      dispatch({ type: 'UPDATE_PROFILE', payload: profile });
      addToast(`Profile "${profile.name}" updated`, 'success');
    },
    [addToast]
  );

  const deleteProfile = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_PROFILE', payload: id });
      addToast('Profile deleted', 'info');
    },
    [addToast]
  );

  const switchProfile = useCallback(
    (id: string) => {
      dispatch({ type: 'SWITCH_PROFILE', payload: id });
      addToast('Switched profile', 'info');
    },
    [addToast]
  );

  const duplicateProfile = useCallback(
    (id: string) => {
      dispatch({ type: 'DUPLICATE_PROFILE', payload: id });
      addToast('Profile duplicated', 'success');
    },
    [addToast]
  );

  const addSemester = useCallback(() => {
    dispatch({ type: 'ADD_SEMESTER' });
    addToast('Semester added', 'success');
  }, [addToast]);

  const updateSemester = useCallback((semester: Semester) => {
    dispatch({ type: 'UPDATE_SEMESTER', payload: semester });
  }, []);

  const deleteSemester = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_SEMESTER', payload: id });
      addToast('Semester deleted', 'info');
    },
    [addToast]
  );

  const clearSemester = useCallback(
    (id: string) => {
      dispatch({ type: 'CLEAR_SEMESTER', payload: id });
      addToast('Semester cleared', 'info');
    },
    [addToast]
  );

  const duplicateSemester = useCallback(
    (id: string) => {
      dispatch({ type: 'DUPLICATE_SEMESTER', payload: id });
      addToast('Semester duplicated', 'success');
    },
    [addToast]
  );

  const addSubject = useCallback(
    (semesterId: string) => {
      const subject = createDefaultSubject(state.settings.gradeSystem);
      dispatch({ type: 'ADD_SUBJECT', payload: { semesterId, subject } });
    },
    [state.settings.gradeSystem]
  );

  const updateSubject = useCallback((semesterId: string, subject: Subject) => {
    dispatch({ type: 'UPDATE_SUBJECT', payload: { semesterId, subject } });
  }, []);

  const deleteSubject = useCallback(
    (semesterId: string, subjectId: string) => {
      dispatch({ type: 'DELETE_SUBJECT', payload: { semesterId, subjectId } });
      addToast('Subject removed', 'info');
    },
    [addToast]
  );

  const reorderSubjects = useCallback((semesterId: string, subjects: Subject[]) => {
    dispatch({ type: 'REORDER_SUBJECTS', payload: { semesterId, subjects } });
  }, []);

  const updateSettings = useCallback(
    (settings: Partial<UserSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      addToast('Settings updated', 'success');
    },
    [addToast]
  );

  const addFriend = useCallback(
    (friendData: Omit<FriendProfile, 'id' | 'createdAt'>) => {
      const friend: FriendProfile = {
        ...friendData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_FRIEND', payload: friend });
      addToast(`Comparison profile "${friend.name}" added`, 'success');
    },
    [addToast]
  );

  const updateFriend = useCallback(
    (friend: FriendProfile) => {
      dispatch({ type: 'UPDATE_FRIEND', payload: friend });
      addToast(`Profile "${friend.name}" updated`, 'success');
    },
    [addToast]
  );

  const deleteFriend = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_FRIEND', payload: id });
      addToast('Profile removed', 'info');
    },
    [addToast]
  );

  const addSavedComparison = useCallback(
    (compData: Omit<SavedComparison, 'id' | 'createdAt'>) => {
      const saved: SavedComparison = {
        ...compData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_SAVED_COMPARISON', payload: saved });
      addToast(`Comparison "${saved.title}" saved`, 'success');
    },
    [addToast]
  );

  const deleteSavedComparison = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_SAVED_COMPARISON', payload: id });
      addToast('Saved comparison removed', 'info');
    },
    [addToast]
  );

  const resetData = useCallback(() => {
    clearAppData();
    dispatch({ type: 'RESET_DATA' });
    addToast('All data has been reset', 'info');
  }, [addToast]);

  const importDataFn = useCallback(
    (data: AppData) => {
      dispatch({ type: 'IMPORT_DATA', payload: data });
      addToast('Data imported successfully', 'success');
    },
    [addToast]
  );

  const setOnboarded = useCallback(() => {
    dispatch({ type: 'SET_ONBOARDED' });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const updateSubjectGrade = useCallback(
    (semesterId: string, subjectId: string, grade: string) => {
      const semester = state.semesters.find((s) => s.id === semesterId);
      if (!semester) return;
      const subject = semester.subjects.find((s) => s.id === subjectId);
      if (!subject) return;

      const gradePoint = getGradePoint(grade, state.settings.gradeSystem);
      updateSubject(semesterId, { ...subject, grade, gradePoint });
    },
    [state.semesters, state.settings.gradeSystem, updateSubject]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        addProfile,
        updateProfile,
        deleteProfile,
        switchProfile,
        duplicateProfile,
        addSemester,
        updateSemester,
        deleteSemester,
        clearSemester,
        duplicateSemester,
        addSubject,
        updateSubject,
        deleteSubject,
        reorderSubjects,
        updateSettings,
        addFriend,
        updateFriend,
        deleteFriend,
        addSavedComparison,
        deleteSavedComparison,
        resetData,
        importData: importDataFn,
        setOnboarded,
        addToast,
        removeToast,
        updateSubjectGrade,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
