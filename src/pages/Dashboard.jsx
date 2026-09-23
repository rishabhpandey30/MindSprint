import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAssessmentContext } from '../context/AssessmentContext.jsx';
import { aggregateAttemptStats } from '../utils/scoring.js';
import { formatDateTime, formatDuration, formatTime } from '../utils/formatting.js';
import { ProgressBar } from '../components/common/ProgressBar.jsx';

function MetricCard({ label, value, sub }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
      {sub && <div className={styles.metricSub}>{sub}</div>}
    </div>
  );
}

function AttemptRow({ attempt, index }) {
  const navigate = useNavigate();
  const score = attempt.score ?? attempt.accuracy ?? 0;
  const timeTaken = attempt.timeTaken || 0;
  return (
    <div className={styles.attemptRow}>
      <div className={styles.attemptIndex}>#{index + 1}</div>
      <div className={styles.attemptDetails}>
        <div className={styles.attemptDate}>{formatDateTime(attempt.completedAt)}</div>
        <div className={styles.attemptMeta}>
          {attempt.results?.correct ?? '—'} / {attempt.results?.total ?? 25} correct
        </div>
      </div>
      <div className={styles.attemptStats}>
        <div className={[styles.attemptScore, score >= 70 ? styles.scoreGood : score >= 50 ? styles.scoreOk : styles.scoreLow].join(' ')}>
          {score}%
        </div>
        <div className={styles.attemptTime}>{formatDuration(timeTaken)}</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { state, startAssessment, getSavedAssessment } = useAssessmentContext();
  const { attemptHistory } = state;
  const savedAssessment = getSavedAssessment();

  const stats = aggregateAttemptStats(attemptHistory);
  const hasAttempts = attemptHistory.length > 0;

  const handleStart = () => {
    const previousIds = state.questions?.map((q) => q.id) || [];
    startAssessment(previousIds);
    navigate('/assessment');
  };

  const handleResume = () => {
    navigate('/assessment');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#4F46E5"/>
              <path d="M8 22L13 10L18 18L21 14L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>MindSprint</span>
          </Link>
          <nav className={styles.nav}>
            <a href="#" className={styles.navActive}>Dashboard</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          {/* Top section */}
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.greeting}>Good to see you.</h1>
              <p className={styles.greetingSub}>
                {hasAttempts
                  ? 'Continue building your assessment speed and accuracy.'
                  : 'Your first practice session starts here.'}
              </p>
            </div>
            <div className={styles.topActions}>
              {savedAssessment && (
                <button className={styles.resumeBtn} onClick={handleResume}>
                  Resume Assessment
                </button>
              )}
              <button className={styles.startBtn} onClick={handleStart}>
                {hasAttempts ? 'New Practice Session' : 'Start Practice'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.metricsRow}>
            <MetricCard
              label="Best Score"
              value={hasAttempts ? `${stats.bestScore}%` : '—'}
            />
            <MetricCard
              label="Average Accuracy"
              value={hasAttempts ? `${stats.averageAccuracy}%` : '—'}
            />
            <MetricCard
              label="Attempts"
              value={hasAttempts ? stats.totalAttempts : '—'}
            />
            <MetricCard
              label="Questions Completed"
              value={hasAttempts ? stats.totalQuestionsCompleted : '—'}
            />
          </div>

          <div className={styles.content}>
            {/* Recent Attempts */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Attempts</h2>
                {hasAttempts && (
                  <span className={styles.sectionCount}>{attemptHistory.length} sessions</span>
                )}
              </div>

              {!hasAttempts ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon} aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <p>No attempts yet. Start your first session to see results here.</p>
                  <button className={styles.emptyStartBtn} onClick={handleStart}>
                    Start Practice
                  </button>
                </div>
              ) : (
                <div className={styles.attemptList}>
                  {attemptHistory.slice(0, 8).map((attempt, i) => (
                    <AttemptRow key={attempt.id} attempt={attempt} index={i} />
                  ))}
                </div>
              )}
            </section>

            {/* Practice Areas */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Practice Areas</h2>
              </div>
              <div className={styles.practiceAreas}>
                {[
                  { name: 'Numerical Processing', type: 'arithmetic', key: 'arithmetic' },
                  { name: 'Spatial Reasoning', type: 'pathfinding', key: 'pathfinding' },
                  { name: 'Planning & Sequencing', type: 'gridcollection', key: 'gridcollection' },
                ].map((area) => {
                  const latestResult = hasAttempts
                    ? attemptHistory[0]?.results?.gameResults?.[area.key]
                    : null;
                  const accuracy = latestResult?.accuracy ?? null;

                  return (
                    <div key={area.key} className={styles.practiceArea}>
                      <div className={styles.practiceAreaHeader}>
                        <span className={styles.practiceAreaName}>{area.name}</span>
                        <span className={styles.practiceAreaScore}>
                          {accuracy !== null ? `${accuracy}%` : 'Not attempted'}
                        </span>
                      </div>
                      <ProgressBar
                        value={accuracy ?? 0}
                        color={accuracy === null ? 'primary' : accuracy >= 70 ? 'success' : accuracy >= 50 ? 'warning' : 'danger'}
                        size="sm"
                      />
                      {accuracy !== null && (
                        <div className={styles.practiceAreaSub}>
                          Last session: {latestResult.correct} / {latestResult.total} correct
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
