import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Welcome } from './components/onboarding/Welcome';
import { Dashboard } from './components/dashboard/Dashboard';
import { SemesterList } from './components/semester/SemesterList';
import { SGPACalculator } from './components/calculator/SGPACalculator';
import { CGPACalculator } from './components/calculator/CGPACalculator';
import { TargetCGPACalculator } from './components/calculator/TargetCGPA';
import { WhatIfSimulator } from './components/calculator/WhatIfSimulator';
import { Analytics } from './components/analytics/Analytics';
import { Settings } from './components/settings/Settings';

function AppRoutes() {
  const { state } = useApp();

  if (!state.hasOnboarded) {
    return (
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Welcome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="semesters" element={<SemesterList />} />
        <Route path="sgpa" element={<SGPACalculator />} />
        <Route path="cgpa" element={<CGPACalculator />} />
        <Route path="what-if" element={<WhatIfSimulator />} />
        <Route path="target" element={<TargetCGPACalculator />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
