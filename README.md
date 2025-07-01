# Study Timer

## Project Overview

- **App Name**: Study Timer
- **Purpose**: Helps users track and analyze their study sessions to improve productivity and build consistent study habits.
- **Target Audience**: Students, self-learners, and anyone looking to monitor and optimize their study time.
- **Brief Description**: Study Timer is a single-page React application that provides a simple timer for study sessions, tracks session history, and visualizes study analytics. It is designed for ease of use and motivation, with features like a dashboard, motivational quotes, and dark/light mode.

---

## Current Status & Features

- **Development Stage**: MVP (Minimum Viable Product)

### Completed Features
- **Study Timer**: Start, pause, resume, stop, and reset a timer. Keyboard shortcuts supported (Space, Ctrl/Cmd+S, Ctrl/Cmd+R).
- **Session Tracking**: Each session is saved with duration, start/end time, and pause time (see `src/services/dataService.js`).
- **Dashboard**: Visualizes total study time, average session, streaks, most productive hours/days, and recent sessions (see `src/components/Dashboard/Dashboard.jsx`).
- **Charts**: Study time overview chart (see `src/components/Dashboard/StudyChart.jsx`).
- **Motivational Quotes**: Random quote shown on dashboard (see `src/data/quotes.js`).
- **Responsive Sidebar Navigation**: 
  - On mobile, a glassmorphic toggle sidebar slides in with a dark overlay, elegant animated hamburger menu, and close (X) button. Navigation and theme toggle are fully functional. Background scroll is disabled while open.
  - On desktop, the sidebar is always visible as a floating glassmorphic box, with icons always visible and text labels revealed smoothly on hover (expand/collapse effect).
- **Theme Toggle**: Light/dark mode with persistent setting (see `src/contexts/ThemeContext.jsx`).
- **Offline Support**: The app detects when you are offline and displays a warning banner. All features work offline using localStorage.
- **Background Optimizations**: The timer remains accurate even when the browser tab is backgrounded, minimized, or JavaScript timers are throttled, thanks to timestamp-based tracking and visibility event handling.
- **SPA Routing for GitHub Pages**: Handles 404 and URL restoration for client-side routing (see `index.html` and `public/404.html`).
- **Local Storage Persistence**: All data is stored in the browser's localStorage.

### Partially Implemented Features
- None identified. All major MVP features are functional.

### Known Issues/Bugs
- No authentication or user accounts (single-user, local only).
- No backend or cloud sync; data is lost if browser storage is cleared.
- No mobile PWA support (works responsively, but not installable as an app).
- No automated tests implemented.

---

## Technical Architecture

### Tech Stack
- **Frontend**: React 19, Vite
- **Backend**: N/A (no backend, all logic is client-side)
- **Database**: N/A (uses browser localStorage)
- **Authentication**: N/A
- **Key Libraries**:
  - `react`, `react-dom` (UI)
  - `recharts` (charts)
  - `@vitejs/plugin-react` (Vite integration)
  - ESLint for linting

### Project Structure
```
├── src/
│   ├── components/
│   │   ├── Timer/         # Timer UI and logic
│   │   ├── Dashboard/     # Dashboard, analytics, charts
│   │   └── Sidebar/       # Sidebar navigation
│   ├── contexts/          # Theme context
│   ├── services/          # Data service (localStorage)
│   ├── data/              # Static data (quotes)
│   ├── utils/             # Utility functions (time, analytics)
│   ├── App.jsx            # Main app logic
│   └── main.jsx           # Entry point
├── public/
│   └── 404.html           # SPA redirect for GitHub Pages
├── index.html             # Main HTML, SPA routing script
├── vite.config.js         # Vite config (base path for GitHub Pages)
├── .github/workflows/     # GitHub Actions deployment
│   └── deploy.yml
├── eslint.config.js       # ESLint config
└── package.json           # Dependencies and scripts
```

### API Endpoints
- **N/A** (No backend or API endpoints)

### Database Schema
- **N/A** (All data is stored as JSON in localStorage)
- Example session object (see `src/services/dataService.js`):
```js
{
  id: 1712345678901,
  date: '2024-06-01',
  duration: 3600, // seconds
  startTime: 1712345678000, // ms timestamp
  endTime: 1712349278000,   // ms timestamp
  pauseTime: 0 // ms
}
```

---

## User Experience & Interface

### Current Pages/Screens
- **Timer**: Main timer interface with controls
- **Dashboard**: Analytics, charts, motivational quote, recent sessions

### User Flow
1. User lands on Timer page (default)
2. Can start, pause, stop, or reset timer
3. Sessions are saved automatically
4. User can switch to Dashboard to view analytics and history
5. Sidebar allows navigation and theme toggle

### UI/UX Decisions
- **Design**: Glassmorphism cards, modern minimal style (see CSS modules)
- **Styling**: CSS Modules (`App.module.css`, etc.)
- **Responsiveness**: Layout adapts to mobile/desktop, sidebar overlays on mobile
- **Accessibility**: ARIA labels on buttons, keyboard shortcuts, color theme toggle

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for timer controls
- High-contrast dark/light themes

---

## Development Details

### Setup Instructions
```bash
npm install
npm run dev
```

### Environment Variables
- **N/A** (No environment variables required)

### Installation Steps
1. Clone the repo
2. Run `npm install`
3. Start dev server with `npm run dev`

### Development Workflow
- Feature development and bugfixes on `main` branch
- Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

---

## Data & Functionality

### Data Models
- **Session**: See example above
- **Settings**: Theme preference
- **Quotes**: Static array of motivational quotes

### User Roles
- **N/A** (Single user, no roles)

### Core Workflows
- Start/pause/stop/reset timer
- Save session to localStorage
- View analytics and history on dashboard
- Switch theme and navigation

### Business Logic
- Timer logic in `src/components/Timer/Timer.jsx`
- Analytics in `src/utils/timeUtils.js` (e.g., streaks, averages)
- Data persistence in `src/services/dataService.js`

---

## External Integrations

### APIs Used
- **N/A** (No external APIs)

### Payment Processing
- **N/A**

### Cloud Services
- **N/A**

### Other Integrations
- GitHub Actions for deployment
- GitHub Pages for hosting

---

## Performance & Scalability

### Current Performance
- Fast load times (Vite, no backend)
- Responsive UI

### Scalability Considerations
- LocalStorage limits (browser-based, not suitable for large-scale or multi-user)
- No backend; not designed for multi-user or cloud sync

### Optimization
- Minimal bundle size
- Code splitting via Vite
- Only essential dependencies

---

## Testing & Quality

### Testing Strategy
- **Not implemented** (No automated tests yet)

### Code Quality
- ESLint with recommended React and hooks rules (`eslint.config.js`)
- Modern JS (ES2020+), functional React components
- CSS Modules for scoped styles

### Deployment
- GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Deploys `dist/` to GitHub Pages on push to `main`

---

## Future Roadmap

### Planned Features
- PWA support (installable app, offline)
- User authentication and cloud sync
- More analytics and export options
- Customizable session goals and reminders

### Technical Debt
- No tests; needs unit and integration tests
- No TypeScript; consider migration for type safety
- No backend; consider adding for multi-device sync

### Scaling Plans
- Add backend/cloud sync for multi-device
- Optimize for larger datasets if needed

---

## Specific Areas for Enhancement

### Pain Points
- Data loss if browser storage is cleared
- No cross-device sync
- No test coverage

### Improvement Opportunities
- Add tests (Jest, React Testing Library)
- Add backend/cloud sync
- Add PWA features
- Improve accessibility further

### User Feedback
- **N/A** (No user feedback collected yet)

---

## Questions for AI Assistant

### Specific Questions
- What are best practices for adding test coverage to a React/Vite app?
- How can I add cloud sync without overcomplicating the app?
- What are the best options for making this a PWA?

### Goals
- Improve reliability and user trust
- Enable multi-device usage
- Make the app installable and offline-capable

### Constraints
- No backend/server currently
- Limited time for major refactors
- Prefer free/low-cost hosting and services
