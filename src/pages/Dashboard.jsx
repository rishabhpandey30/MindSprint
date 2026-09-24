import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAssessmentContext } from '../context/AssessmentContext.jsx';
import { aggregateAttemptStats } from '../utils/scoring.js';
import { formatDateTime, formatDuration } from '../utils/formatting.js';
import { ProgressBar } from '../components/common/ProgressBar.jsx';

function MetricCard({ label, value }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

function AttemptRow({ attempt, index }) {
  // Support both old and new history shapes
  const accuracy = attempt.overall?.accuracy ?? attempt.score ?? attempt.accuracy ?? 0;
  const date     = attempt.date ?? attempt.completedAt ?? null;
  const solved   = attempt.overall?.totalSolved ?? attempt.results?.correct ?? '—';
  const total    = attempt.overall?.totalQuestions ?? attempt.results?.total ?? 75;

  return (
    <div className={styles.attemptRow}>
      <div className={styles.attemptIndex}>#{index + 1}</div>
      <div className={styles.attemptDetails}>
        <div className={styles.attemptDate}>
          {date ? formatDateTime(date) : 'Unknown date'}
        </div>
        <div className={styles.attemptMeta}>
          {solved} / {total} solved
        </div>
      </div>
      <div className={styles.attemptStats}>
        <div
          className={[
            styles.attemptScore,
            accuracy >= 70 ? styles.scoreGood : accuracy >= 50 ? styles.scoreOk : styles.scoreLow,
          ].join(' ')}
        >
          {accuracy}%
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  // Safely destructure — context spreads state values flat
  const ctx = useAssessmentContext();
  const attemptHistory = Array.isArray(ctx?.attemptHistory) ? ctx.attemptHistory : [];
  const startAssessment = ctx?.startAssessment;
  const getSavedAssessment = ctx?.getSavedAssessment;

  const savedAssessment = getSavedAssessment?.() ?? null;
  const stats = aggregateAttemptStats(attemptHistory);
  const hasAttempts = attemptHistory.length > 0;

  const handleStart = () => {
    startAssessment?.();
    navigate('/assessment');
  };

  const handleResume = () => {
    navigate('/assessment');
  };

  // Game-level breakdown from most recent attempt
  const latestAttempt = hasAttempts ? attemptHistory[0] : null;
  const gameBreakdown = [
    {
      key: 'bubbles',
      name: 'Select Bubbles',
      desc: 'Mental Calculation',
      color: '#6366f1',
      accuracy: latestAttempt?.bubbles?.accuracy ?? null,
      solved:   latestAttempt?.bubbles?.solved   ?? null,
      total:    latestAttempt?.bubbles?.total     ?? 25,
    },
    {
      key: 'maze',
      name: 'Invisible Maze',
      desc: 'Spatial Navigation',
      color: '#10b981',
      accuracy: latestAttempt?.maze?.accuracy ?? null,
      solved:   latestAttempt?.maze?.solved   ?? null,
      total:    latestAttempt?.maze?.total     ?? 25,
    },
    {
      key: 'pathfinder',
      name: 'Pathfinder',
      desc: 'Spatial Arrangement',
      color: '#f59e0b',
      accuracy: latestAttempt?.pathfinder?.accuracy ?? null,
      solved:   latestAttempt?.pathfinder?.solved   ?? null,
      total:    latestAttempt?.pathfinder?.total     ?? 25,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#4F46E5" />
              <path
                d="M8 22L13 10L18 18L21 14L24 22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>MindSprint</span>
          </Link>

          <nav className={styles.nav}>
            <span className={styles.navActive}>Dashboard</span>
            <Link to="/" className={styles.navLink}>Home</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Hero section */}
          <div className={styles.topSection}>
            <div>
              <h1 className={styles.greeting}>
                {hasAttempts ? 'Welcome back.' : 'Good to see you.'}
              </h1>
              <p className={styles.greetingSub}>
                {hasAttempts
                  ? `${stats.totalAttempts} session${stats.totalAttempts > 1 ? 's' : ''} completed · ${stats.totalQuestionsCompleted} total levels solved`
                  : 'Your first practice session starts here.'}
              </p>
            </div>

            <div className={styles.topActions}>
              {savedAssessment && (
                <button className={styles.resumeBtn} onClick={handleResume}>
                  Resume Session
                </button>
              )}
              <button className={styles.startBtn} onClick={handleStart}>
                {hasAttempts ? 'New Session' : 'Start Practice'}
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className={styles.metricsRow}>
            <MetricCard
              label="Best Score"
              value={hasAttempts ? `${stats.bestScore}%` : '—'}
            />
            <MetricCard
              label="Avg Accuracy"
              value={hasAttempts ? `${stats.averageAccuracy}%` : '—'}
            />
            <MetricCard
              label="Sessions"
              value={hasAttempts ? stats.totalAttempts : '—'}
            />
            <MetricCard
              label="Levels Solved"
              value={hasAttempts ? stats.totalQuestionsCompleted : '—'}
            />
          </div>

          <div className={styles.content}>
            {/* Game breakdown */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {hasAttempts ? 'Last Session — Game Breakdown' : 'Assessment Games'}
                </h2>
              </div>

              <div className={styles.practiceAreas}>
                {gameBreakdown.map((game) => (
                  <div key={game.key} className={styles.practiceArea}>
                    <div className={styles.practiceAreaHeader}>
                      <div>
                        <span className={styles.practiceAreaName}>{game.name}</span>
                        <span className={styles.practiceAreaDesc}>{game.desc}</span>
                      </div>
                      <span
                        className={styles.practiceAreaScore}
                        style={{ color: game.accuracy !== null ? game.color : 'var(--color-text-tertiary)' }}
                      >
                        {game.accuracy !== null ? `${game.accuracy}%` : 'Not played'}
                      </span>
                    </div>

                    <ProgressBar
                      value={game.accuracy ?? 0}
                      color={
                        game.accuracy === null ? 'primary'
                        : game.accuracy >= 70   ? 'success'
                        : game.accuracy >= 50   ? 'warning'
                        :                         'danger'
                      }
                      size="sm"
                    />

                    {game.accuracy !== null && (
                      <div className={styles.practiceAreaSub}>
                        {game.solved} / {game.total} solved
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Session history */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Session History</h2>
                {hasAttempts && (
                  <span className={styles.sectionCount}>{attemptHistory.length} sessions</span>
                )}
              </div>

              {!hasAttempts ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon} aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <p>No sessions yet. Start your first practice to see results here.</p>
                  <button className={styles.emptyStartBtn} onClick={handleStart}>
                    Start Practice
                  </button>
                </div>
              ) : (
                <div className={styles.attemptList}>
                  {attemptHistory.slice(0, 10).map((attempt, i) => (
                    <AttemptRow key={attempt.assessmentId ?? i} attempt={attempt} index={i} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
