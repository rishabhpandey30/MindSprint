import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext.jsx';
import Button from '../components/common/Button.jsx';
import { CircleDot, Compass, Grid, ArrowRight, Clock, ShieldCheck, Zap } from 'lucide-react';
import styles from './Instructions.module.css';

const GAME_INFO = [
  {
    id: 'bubbles',
    name: '1. Select Bubbles',
    count: '25 levels · 15 sec / level',
    description: 'Mental calculation under high speed. Solve 3 mathematical expressions mentally and select the bubbles in ascending numerical order (smallest to largest).',
    types: ['Addition, Subtraction, Multi-op', 'Percentages & Decimals', 'Ascending order selection (1→2→3)', 'Auto-advances on 3rd bubble'],
    color: 'var(--color-primary)',
    icon: CircleDot,
  },
  {
    id: 'maze',
    name: '2. Invisible Maze',
    count: '25 levels · 3 min / level',
    description: 'Exploratory spatial navigation. Navigate from Start to collect the Key and reach the Exit Door. Grid walls are hidden until you collide with them.',
    types: ['4×4 to 7×7 grid scaling', 'Hidden walls reveal on collision', 'Arrow keys, WASD, or D-Pad', 'Collect Key before Door opens'],
    color: 'var(--color-warning)',
    icon: Compass,
  },
  {
    id: 'pathfinder',
    name: '3. Pathfinder',
    count: '25 levels · 4 min / level',
    description: 'Spatial reasoning and tile arrangement. Click and swap scrambled track tiles to construct a continuous unbroken route connecting Start (S) to End (E).',
    types: ['3×3 to 6×6 scrambled grids', 'Click-to-select & click-to-swap', 'Fixed tile orientation (no rotation)', 'Instant continuous path check'],
    color: 'var(--color-success)',
    icon: Grid,
  },
];

export default function Instructions() {
  const navigate = useNavigate();
  const { startAssessment } = useAssessment();

  const handleStart = () => {
    startAssessment();
    navigate('/assessment');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/dashboard" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Dashboard
          </Link>
          <div className={styles.logo}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#4F46E5"/>
              <path d="M8 22L13 10L18 18L21 14L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>MindSprint</span>
          </div>
          <div className={styles.spacer} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={`container ${styles.content}`}>
          <div className={styles.intro}>
            <h1>Assessment Overview</h1>
            <p>
              Experience a game-based cognitive assessment consisting of 3 interactive games and 75 total levels.
              Each level operates on an independent countdown timer.
            </p>
          </div>

          <div className={styles.overviewCards}>
            <div className={styles.overviewCard}>
              <div className={styles.overviewIcon} aria-hidden="true">
                <Clock size={20} />
              </div>
              <div className={styles.overviewLabel}>Timing Mode</div>
              <div className={styles.overviewValue}>Per-Level Timers</div>
            </div>
            <div className={styles.overviewCard}>
              <div className={styles.overviewIcon} aria-hidden="true">
                <Zap size={20} />
              </div>
              <div className={styles.overviewLabel}>Total Levels</div>
              <div className={styles.overviewValue}>75 Interactive Levels</div>
            </div>
            <div className={styles.overviewCard}>
              <div className={styles.overviewIcon} aria-hidden="true">
                <ShieldCheck size={20} />
              </div>
              <div className={styles.overviewLabel}>Assessment Format</div>
              <div className={styles.overviewValue}>3 Cognitive Games</div>
            </div>
          </div>

          <div className={styles.gamesSection}>
            <h2>Assessment Game Modules</h2>
            <div className={styles.gameCards}>
              {GAME_INFO.map((game) => {
                const IconComponent = game.icon;
                return (
                  <div key={game.id} className={styles.gameCard}>
                    <div className={styles.gameCardHeader}>
                      <div className={styles.gameCardIcon} style={{ background: `${game.color}15`, color: game.color }}>
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <h3>{game.name}</h3>
                        <span className={styles.gameCardCount}>{game.count}</span>
                      </div>
                    </div>
                    <p className={styles.gameCardDesc}>{game.description}</p>
                    <ul className={styles.typesList}>
                      {game.types.map((type, i) => (
                        <li key={i}>
                          <span className={styles.bullet} style={{ background: game.color }} />
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.tipsSection}>
            <h2>Key Guidelines for Candidates</h2>
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <div className={styles.tipNum}>1</div>
                <div>
                  <strong>Independent Level Countdown</strong>
                  <p>Each level receives a fresh timer. Time spent does not carry over to subsequent levels.</p>
                </div>
              </div>
              <div className={styles.tipCard}>
                <div className={styles.tipNum}>2</div>
                <div>
                  <strong>Fluid Interaction</strong>
                  <p>In Select Bubbles, selecting the 3rd bubble automatically submits. In Pathfinder, click to select and swap.</p>
                </div>
              </div>
              <div className={styles.tipCard}>
                <div className={styles.tipNum}>3</div>
                <div>
                  <strong>Adaptive Complexity</strong>
                  <p>Levels scale from Easy to Very Hard with larger grids, tighter tolerances, and multi-step reasoning.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionSection}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className={styles.startBtn}
            >
              <span>Begin Assessment</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export { Instructions };
