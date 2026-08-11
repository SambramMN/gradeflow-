# GradeFlow — CGPA Calculator & Academic Tracker

A modern, award-worthy, interactive CGPA and SGPA calculator with rich academic analytics, target goal engineering, what-if grade simulation, and local storage persistence.

---

## Features

- **SGPA & CGPA Calculators**: Instant calculations with credit-weighted grade point average algorithms (`Σ(Credit × GP) / Σ(Credits)`).
- **Semester & Subject Management**: Full CRUD capabilities — add, edit, delete, duplicate, clear semesters and subject rows with live auto-recalculation.
- **What-If Simulator**: Project how future/hypothetical semester grades will impact overall cumulative CGPA with real-time trend feedback.
- **Target CGPA Calculator**: Goal engineering engine that calculates the required SGPA needed in remaining credits to achieve a target CGPA.
- **Academic Analytics & Data Visualizations**:
  - CGPA & SGPA progression timeline (Area Chart)
  - Grade distribution breakdown (Bar Chart & Pie Chart)
  - Credits per semester tracker
  - Semester comparison matrix with delta trends
  - Best and weakest subject identification
- **University Grade Presets**: Pre-configured grading scales (Indian 10-Point, VTU, Anna University, US 4.0, Mumbai University) plus fully customizable grade points.
- **Data Privacy & Storage**: 100% client-side persistence using `localStorage`, with full JSON backup export and import functionality.
- **Design System & UX**:
  - Dark / Light mode with smooth theme toggling
  - Custom cursor follower for desktop pointer interaction
  - Animated SVG progress ring for hero CGPA visual
  - Spring-based micro-interactions powered by Framer Motion
  - Reduced-motion accessibility support

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 with custom CSS design tokens
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Persistence**: LocalStorage API

---

## Project Structure

```
├── index.html                  # HTML entry point with Google Fonts
├── src/
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Router setup & Context Provider
│   ├── index.css               # Design tokens, grain overlay, theme CSS
│   ├── types/
│   │   └── index.ts            # TypeScript interface definitions
│   ├── lib/
│   │   ├── calculations.ts     # Core calculation engine
│   │   ├── storage.ts          # LocalStorage persistence & JSON import/export
│   │   ├── gradePresets.ts     # University grade system presets
│   │   └── constants.ts        # App constants & chart colors
│   ├── context/
│   │   └── AppContext.tsx      # Application state management (useReducer)
│   ├── hooks/
│   │   └── useTheme.ts         # Theme switcher hook (dark/light/system)
│   └── components/
│       ├── layout/             # Sidebar, MobileNav, AppLayout
│       ├── ui/                 # CustomCursor, AnimatedNumber, Toast, ConfirmDialog
│       ├── onboarding/         # Welcome hero section
│       ├── dashboard/          # Main dashboard & CGPA progress ring
│       ├── semester/           # Semester & subject CRUD management
│       ├── calculator/         # SGPA, CGPA, Target, What-If calculators
│       ├── analytics/          # Analytics & data visualization charts
│       └── settings/           # User profile, presets, theme & data management
├── package.json                # Project dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SambramMN/gradeflow-.git
   cd gradeflow-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## Development

- **TypeScript Type Check**:
  ```bash
  npx tsc --noEmit
  ```

- **Production Build**:
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## Deployment

This application is built as a pure client-side Single Page Application (SPA) with Vite.

### Vercel Deployment

1. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Netlify Deployment

1. Set **Build Command**: `npm run build`
2. Set **Publish Directory**: `dist`

---

## Future Improvements

- PDF report card / academic transcript generation
- Multi-user profiles for managing different degrees or majors
- Cloud sync backend option (Firebase / Supabase integration)
- Export performance statistics as CSV / Excel

---

## License

MIT License. Free to use for personal and educational purposes.
