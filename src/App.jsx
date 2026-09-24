import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider, useAssessmentContext } from './context/AssessmentContext.jsx';
import { Landing } from './pages/Landing.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Instructions } from './pages/Instructions.jsx';
import { Assessment } from './pages/Assessment.jsx';
import { Results } from './pages/Results.jsx';
import { Review } from './pages/Review.jsx';

/** Route guard: redirect to /dashboard if no active assessment */
function RequireAssessment({ children }) {
  const { isStarted, isCompleted } = useAssessmentContext();
  if (!isStarted && !isCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

/** Route guard: redirect to /dashboard if no completed results */
function RequireResults({ children }) {
  const { results } = useAssessmentContext();
  if (!results) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      background: 'var(--color-bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: '12px', textTransform: 'uppercase' }}>
          404
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px', color: 'var(--color-text)' }}>
          Page not found.
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/dashboard"
          style={{
            display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 24px',
            background: 'var(--color-primary)', color: 'white', borderRadius: '8px',
            textDecoration: 'none', fontWeight: 500, fontSize: '14px',
          }}
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route
        path="/assessment"
        element={<Assessment />}
      />
      <Route
        path="/results"
        element={
          <RequireResults>
            <Results />
          </RequireResults>
        }
      />
      <Route
        path="/review"
        element={
          <RequireResults>
            <Review />
          </RequireResults>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <AppRoutes />
      </AssessmentProvider>
    </BrowserRouter>
  );
}
