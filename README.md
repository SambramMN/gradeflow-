# GradeFlow — Academic Management & Analytics Platform

A modern, award-worthy, interactive CGPA and SGPA calculator with rich academic analytics, target goal engineering, what-if grade simulation, friend benchmarking, multi-profile student management, cloud synchronization, and academic transcript generation.

---

## Features

### 1. Multi-Profile Student System
- **Academic Profile Switcher**: Create, edit, switch, duplicate, and delete distinct academic profiles (e.g. *B.Tech CSE*, *M.Tech*, or demo student profiles).
- **Isolated Data Architecture**: Every profile maintains separate semesters, subjects, grades, SGPA, CGPA, target settings, and benchmark data.
- **Profile Metadata**: Customize student name, university, college/school, course/degree, branch/major, academic year, student ID, and avatars.

### 2. Academic Comparison & Benchmarking Hub (`/compare`)
- **My Semester Comparison**: Side-by-side comparison between any two semesters (e.g., *Semester 4 vs Semester 5*) showing SGPA delta, CGPA delta, credit difference, and percentage improvements.
- **Previous vs Current Semester Quick Progress**: Instant status badges (`↑ Improved`, `↓ Declined`, `→ Stable`) with step metrics (`7.82 → 8.61`, `+10.1%`).
- **Friend & Classmate Benchmarks**: Create and manage friend benchmark profiles (Name, Custom Title/Badge like *"Database King"*, University, Course, Semester, SGPA, CGPA, Credits, Subject Breakdown) stored 100% locally on your device.
- **Academic Leaderboard**: Non-toxic performance ranking ordered by CGPA/SGPA.
- **Subject-by-Subject Grade Matrix**: Compare subject-level scores across matching courses (`Data Structures: Me A+ vs Rahul A`), highlighting advantages and equal performances.
- **Multi-Semester Journey Timeline**: Multi-select interactive timeline displaying academic progress across all semesters.
- **Comparison History**: Save custom comparison presets with open, rename, and delete options.
- **Dynamic Insights Engine**: Automatically generates natural language insights from math calculations (e.g., *"Your CGPA is 0.31 higher than Rahul's."*, *"You performed better in 4 out of 6 shared subjects."*).

### 3. Reporting & Export Tools
- **PDF Academic Transcript**: Download an official, formatted PDF performance transcript containing Student Info, Academic Summary, Semester Breakdown, Subject Performance, and Comparison Highlights powered by `jsPDF`.
- **Excel (.xlsx) Multi-Sheet Workbooks**: Export multi-sheet Excel files containing *Profile Summary*, *Semesters*, *Subjects*, and *Friend Benchmarks* using `xlsx`.
- **CSV Dataset Export**: Download complete semester, subject, grade point, and friend benchmark data as `academic-performance-2026.csv`.
- **Shareable Text Summaries**: Copy formatted text summaries directly to clipboard.

### 4. Cloud Synchronization & Auth (Optional)
- **Supabase Integration**: Optional Supabase authentication (Sign Up, Login, Password Reset) and cloud data sync.
- **Dual Engine**: Runs in 100% private offline **Local Mode** by default, with automatic **Cloud Sync Mode** when configured.

### 5. Core Calculators & Trackers
- **SGPA & CGPA Calculators**: Instant calculations with credit-weighted grade point average algorithms (`Σ(Credit × GP) / Σ(Credits)`).
- **Semester & Subject Management**: Full CRUD capabilities — add, edit, delete, duplicate, clear semesters and subject rows with live auto-recalculation.
- **What-If Simulator**: Project how future/hypothetical semester grades will impact overall cumulative CGPA with real-time trend feedback.
- **Target CGPA Calculator**: Goal engineering engine that calculates the required SGPA needed in remaining credits to achieve a target CGPA.

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 with custom CSS design tokens
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF
- **Excel Export**: SheetJS (XLSX)
- **Cloud Backend**: Supabase JS Client (Optional)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Persistence**: LocalStorage API + Supabase Cloud Sync

---

## Project Structure

```
├── vercel.json                 # Vercel SPA rewrite configuration
├── .env.example                # Supabase configuration template
├── index.html                  # HTML entry point with Google Fonts
├── src/
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Router setup & Context Provider
│   ├── index.css               # Design tokens, grain overlay, theme CSS
│   ├── types/
│   │   └── index.ts            # TypeScript interface definitions
│   ├── lib/
│   │   ├── calculations.ts     # Core calculation engine
│   │   ├── comparisonEngine.ts # Semester & friend comparison math engine
│   │   ├── exportUtils.ts      # CSV export & jsPDF transcript generator
│   │   ├── excelExport.ts      # Multi-sheet Excel (.xlsx) generator
│   │   ├── storage.ts          # LocalStorage persistence & JSON import/export
│   │   ├── supabaseClient.ts   # Safe Supabase client initialization
│   │   ├── gradePresets.ts     # University grade system presets
│   │   └── constants.ts        # App constants & chart colors
│   ├── context/
│   │   └── AppContext.tsx      # Application state management (useReducer)
│   ├── hooks/
│   │   └── useTheme.ts         # Theme switcher hook (dark/light/system)
│   └── components/
│       ├── layout/             # Sidebar, MobileNav, AppLayout
│       ├── ui/                 # CustomCursor, AnimatedNumber, Toast, ConfirmDialog
│       ├── profile/            # ProfileSwitcher, ProfileModal
│       ├── auth/               # AuthModal (Login, Register, Reset)
│       ├── onboarding/         # Welcome hero section
│       ├── dashboard/          # Main dashboard & CGPA progress ring
│       ├── semester/           # Semester & subject CRUD management
│       ├── compare/            # Compare, FriendModal, ShareModal
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

## Development & Production Build

- **TypeScript Check**:
  ```bash
  npx tsc --noEmit
  ```

- **Production Build**:
  ```bash
  npm run build
  ```

---

## Deployment

Deploy live on Vercel:
```bash
npx vercel --prod --yes
```

---

## Future Improvements

- Native iOS & Android mobile companion apps (React Native / Capacitor)
- Direct LMS (Canvas / Blackboard / Moodle) grade sync API connectors

---

## License

MIT License. Free to use for personal and educational purposes.
