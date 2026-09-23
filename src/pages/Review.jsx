import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import styles from './Review.module.css';

const GAME_FILTERS = [
  { id: 'all', label: 'All Levels (75)' },
  { id: 'bubbles', label: '1. Select Bubbles (25)' },
  { id: 'maze', label: '2. Invisible Maze (25)' },
  { id: 'pathfinder', label: '3. Pathfinder (25)' },
  { id: 'correct', label: 'Solved Only' },
  { id: 'incorrect', label: 'Missed / Timed Out' },
];

export default function Review() {
  const navigate = useNavigate();
  const { results } = useAssessment();
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  if (!results) {
    navigate('/dashboard');
    return null;
  }

  const { records = [] } = results;

  const filteredRecords = records.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'bubbles') return r.gameType === 'bubbles';
    if (filter === 'maze') return r.gameType === 'maze';
    if (filter === 'pathfinder') return r.gameType === 'pathfinder';
    if (filter === 'correct') return r.correct;
    if (filter === 'incorrect') return !r.correct;
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getGameLabel = (type) => {
    if (type === 'bubbles') return 'Select Bubbles';
    if (type === 'maze') return 'Invisible Maze';
    if (type === 'pathfinder') return 'Pathfinder';
    return type;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/results" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Results Summary</span>
          </Link>
          <div className={styles.logo}>
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
          </div>
          <Link to="/dashboard" className={styles.dashboardLink}>
            Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1>Level-by-Level Assessment Review</h1>
            <p>Inspect performance metrics, completion times, and execution details for all 75 levels.</p>
          </div>

          {/* Filter Pills */}
          <div className={styles.filterTabs} role="tablist" aria-label="Filter levels">
            {GAME_FILTERS.map((f) => (
              <button
                key={f.id}
                className={`${styles.filterTab} ${filter === f.id ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(f.id)}
                role="tab"
                aria-selected={filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Records List */}
          <div className={styles.recordList}>
            {filteredRecords.length === 0 ? (
              <div className={styles.emptyFilter}>
                <p>No levels found matching this filter.</p>
              </div>
            ) : (
              filteredRecords.map((r, index) => {
                const isExpanded = expandedId === r.levelId;

                return (
                  <div key={r.levelId || index} className={styles.recordCard}>
                    <div
                      className={styles.recordSummaryRow}
                      onClick={() => toggleExpand(r.levelId)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.recordLeft}>
                        {r.correct ? (
                          <CheckCircle className={styles.iconSuccess} size={20} />
                        ) : (
                          <XCircle className={styles.iconDanger} size={20} />
                        )}
                        <div>
                          <span className={styles.recordGameType}>{getGameLabel(r.gameType)}</span>
                          <span className={styles.recordLevelId}>ID: {r.levelId}</span>
                        </div>
                      </div>

                      <div className={styles.recordMiddle}>
                        <Badge
                          variant={
                            r.difficulty === 'easy'
                              ? 'success'
                              : r.difficulty === 'medium'
                              ? 'primary'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {r.difficulty}
                        </Badge>
                        <span className={styles.recordTime}>
                          <Clock size={14} /> {r.timeSpent}s / {r.timeLimit}s
                        </span>
                      </div>

                      <div className={styles.recordRight}>
                        <Badge variant={r.correct ? 'success' : 'danger'}>
                          {r.correct ? 'Solved' : r.timedOut ? 'Timed Out' : 'Incorrect'}
                        </Badge>
                        <button className={styles.expandBtn} aria-label="Toggle details">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={styles.expandedDetails}>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Completion Status:</span>
                            <strong>{r.completed ? 'Completed' : 'Did not complete'}</strong>
                          </div>

                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Time Used:</span>
                            <strong>{r.timeSpent} seconds (Limit: {r.timeLimit}s)</strong>
                          </div>

                          {r.moves !== undefined && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Moves Taken:</span>
                              <strong>{r.moves}</strong>
                            </div>
                          )}

                          {r.collisions !== undefined && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Wall Collisions:</span>
                              <strong>{r.collisions}</strong>
                            </div>
                          )}

                          {r.swaps !== undefined && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Tile Swaps:</span>
                              <strong>{r.swaps}</strong>
                            </div>
                          )}

                          {r.efficiency !== undefined && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Route/Swap Efficiency:</span>
                              <strong>{r.efficiency}%</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export { Review };
