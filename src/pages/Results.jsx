import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import {
  Award,
  CheckCircle2,
  Clock,
  Zap,
  Compass,
  Grid,
  CircleDot,
  RotateCcw,
  ListOrdered,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import styles from './Results.module.css';

export default function Results() {
  const navigate = useNavigate();
  const { results, startAssessment } = useAssessment();

  if (!results) {
    navigate('/dashboard');
    return null;
  }

  const { overall, bubbles, maze, pathfinder, skills } = results;

  const handleRetake = () => {
    startAssessment();
    navigate('/assessment');
  };

  const formatTotalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.logo}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
          <div className={styles.headerActions}>
            <Link to="/review" className={styles.reviewLink}>
              Review Levels
            </Link>
            <Link to="/dashboard" className={styles.dashboardLink}>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          {/* Hero Overall Performance */}
          <div className={styles.heroCard}>
            <div className={styles.heroLeft}>
              <Badge variant="primary" size="md">
                Assessment Complete
              </Badge>
              <h1 className={styles.heroTitle}>Performance Assessment Summary</h1>
              <p className={styles.heroSubtitle}>
                You completed 75 interactive levels across 3 cognitive challenges.
              </p>

              <div className={styles.overallMetrics}>
                <div className={styles.metricItem}>
                  <span className={styles.metricValue}>
                    {overall.totalSolved} <span className={styles.metricTotal}>/ {overall.totalQuestions}</span>
                  </span>
                  <span className={styles.metricLabel}>Total Solved</span>
                </div>

                <div className={styles.metricItem}>
                  <span className={styles.metricValue}>{overall.accuracy}%</span>
                  <span className={styles.metricLabel}>Overall Accuracy</span>
                </div>

                <div className={styles.metricItem}>
                  <span className={styles.metricValue}>{formatTotalTime(overall.totalTimeSpent)}</span>
                  <span className={styles.metricLabel}>Active Time</span>
                </div>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.scoreCircle}>
                <div className={styles.scoreNumber}>{overall.accuracy}%</div>
                <div className={styles.scoreSub}>Score</div>
              </div>
            </div>
          </div>

          {/* 3 Game Breakdown Cards */}
          <div className={styles.gamesSection}>
            <h2 className={styles.sectionHeading}>Game-by-Game Breakdown</h2>
            <div className={styles.gameCardsGrid}>
              {/* Game 1: Select Bubbles */}
              <div className={styles.gameResultCard}>
                <div className={styles.gameCardTop}>
                  <div className={styles.gameIconWrapper} style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                    <CircleDot size={22} />
                  </div>
                  <div>
                    <h3 className={styles.gameCardName}>Select Bubbles</h3>
                    <span className={styles.gameCardSub}>Mental Arithmetic</span>
                  </div>
                </div>

                <div className={styles.gameScoreRow}>
                  <span className={styles.gameScoreBig}>
                    {bubbles.solved} <span className={styles.gameScoreOutOf}>/ 25</span>
                  </span>
                  <Badge variant={bubbles.accuracy >= 80 ? 'success' : 'warning'}>
                    {bubbles.accuracy}% Accuracy
                  </Badge>
                </div>

                <div className={styles.gameStatsList}>
                  <div className={styles.gameStatItem}>
                    <span>Average Response:</span>
                    <strong>{bubbles.avgResponseTime}s</strong>
                  </div>
                  <div className={styles.gameStatItem}>
                    <span>Fastest Solve:</span>
                    <strong>{bubbles.fastest}s</strong>
                  </div>
                </div>
              </div>

              {/* Game 2: Invisible Maze */}
              <div className={styles.gameResultCard}>
                <div className={styles.gameCardTop}>
                  <div className={styles.gameIconWrapper} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                    <Compass size={22} />
                  </div>
                  <div>
                    <h3 className={styles.gameCardName}>Invisible Maze</h3>
                    <span className={styles.gameCardSub}>Hidden Wall Navigation</span>
                  </div>
                </div>

                <div className={styles.gameScoreRow}>
                  <span className={styles.gameScoreBig}>
                    {maze.solved} <span className={styles.gameScoreOutOf}>/ 25</span>
                  </span>
                  <Badge variant={maze.accuracy >= 80 ? 'success' : 'warning'}>
                    {maze.accuracy}% Solved
                  </Badge>
                </div>

                <div className={styles.gameStatsList}>
                  <div className={styles.gameStatItem}>
                    <span>Path Efficiency:</span>
                    <strong>{maze.avgEfficiency}%</strong>
                  </div>
                  <div className={styles.gameStatItem}>
                    <span>Wall Collisions:</span>
                    <strong>{maze.totalCollisions}</strong>
                  </div>
                </div>
              </div>

              {/* Game 3: Pathfinder */}
              <div className={styles.gameResultCard}>
                <div className={styles.gameCardTop}>
                  <div className={styles.gameIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                    <Grid size={22} />
                  </div>
                  <div>
                    <h3 className={styles.gameCardName}>Pathfinder</h3>
                    <span className={styles.gameCardSub}>Path Tile Arrangement</span>
                  </div>
                </div>

                <div className={styles.gameScoreRow}>
                  <span className={styles.gameScoreBig}>
                    {pathfinder.solved} <span className={styles.gameScoreOutOf}>/ 25</span>
                  </span>
                  <Badge variant={pathfinder.accuracy >= 80 ? 'success' : 'warning'}>
                    {pathfinder.accuracy}% Solved
                  </Badge>
                </div>

                <div className={styles.gameStatsList}>
                  <div className={styles.gameStatItem}>
                    <span>Average Swaps:</span>
                    <strong>{pathfinder.avgSwaps}</strong>
                  </div>
                  <div className={styles.gameStatItem}>
                    <span>Average Solve Time:</span>
                    <strong>{pathfinder.avgSolveTime}s</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Skills Indicators */}
          <div className={styles.skillsSection}>
            <div className={styles.skillsHeader}>
              <h2 className={styles.sectionHeading}>Practice Performance Indicators</h2>
              <p className={styles.skillsSub}>
                Objective competency metrics derived from speed, accuracy, and path optimization.
              </p>
            </div>

            <div className={styles.skillsGrid}>
              {skills.map((skill) => (
                <div key={skill.id} className={styles.skillCard}>
                  <div className={styles.skillTop}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillScore}>{skill.score} / 100</span>
                  </div>
                  <div className={styles.skillProgressWrapper}>
                    <ProgressBar current={skill.score} total={100} color="var(--color-primary)" />
                  </div>
                  <p className={styles.skillDesc}>{skill.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsFooter}>
            <Button variant="primary" size="lg" onClick={handleRetake} className={styles.actionBtn}>
              <RotateCcw size={18} />
              <span>Practice Again</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/review')}
              className={styles.actionBtn}
            >
              <ListOrdered size={18} />
              <span>Review All 75 Levels</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className={styles.actionBtn}
            >
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export { Results };
