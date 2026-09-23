import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext.jsx';
import { GAME_CONFIG, GAME_ORDER } from '../config/gameConfig.js';
import LevelTimer from '../components/assessment/LevelTimer.jsx';
import SelectBubblesGame from '../components/games/SelectBubbles/SelectBubblesGame.jsx';
import InvisibleMazeGame from '../components/games/InvisibleMaze/InvisibleMazeGame.jsx';
import PathfinderGame from '../components/games/Pathfinder/PathfinderGame.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import {
  ArrowRight,
  LogOut,
  Award,
  CheckCircle,
  Clock,
  Zap,
  Compass,
  Grid,
  CircleDot,
  RotateCcw,
  BarChart2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import styles from './Assessment.module.css';

const GAME_ICONS = {
  bubbles: CircleDot,
  maze: Compass,
  pathfinder: Grid,
};

export default function Assessment() {
  const navigate = useNavigate();
  const {
    games,
    selectedGameKey,
    currentLevelIndex,
    phase,
    levelRecords,
    remainingLevelTime,
    levelStartTime,
    isStarted,
    isCompleted,
    selectGame,
    completeLevel,
    endCurrentGame,
    returnToSelection,
    finishAssessment,
    abandonAssessment,
    startAssessment,
  } = useAssessment();

  const [showEndModal, setShowEndModal] = useState(false);

  // Redirect if not started or when fully finished
  useEffect(() => {
    if (!isStarted) {
      startAssessment(); // Automatically start session if navigating to /assessment
    } else if (phase === 'ALL_RESULTS') {
      navigate('/results');
    }
  }, [isStarted, phase, navigate, startAssessment]);

  if (!isStarted || !games) {
    return null;
  }

  // Active game metadata
  const currentGame = selectedGameKey ? games[selectedGameKey] : null;
  const currentLevel = currentGame?.levels[currentLevelIndex];
  const currentConfig = selectedGameKey ? GAME_CONFIG[selectedGameKey] : null;

  // Active game stats
  const activeGameRecords = selectedGameKey
    ? levelRecords.filter((r) => r.gameType === selectedGameKey)
    : [];
  const completedInActive = activeGameRecords.length;

  return (
    <div className={styles.assessmentPage}>
      {/* Top Assessment Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/dashboard" className={styles.logoBadge} title="MindSprint Dashboard">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#4F46E5" />
              <path
                d="M8 22L13 10L18 18L21 14L24 22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.logoText}>MindSprint</span>
          </Link>

          {phase === 'PLAYING' && currentConfig && (
            <div className={styles.activeGameTag}>
              <span className={styles.gameStepTag}>ACTIVE GAME</span>
              <span className={styles.activeGameName}>{currentConfig.title}</span>
            </div>
          )}
        </div>

        {phase === 'PLAYING' && currentConfig && (
          <div className={styles.headerCenter}>
            <div className={styles.levelIndicator}>
              <span className={styles.levelText}>
                Level <strong>{currentLevelIndex + 1}</strong> of 25
              </span>
              <div className={styles.progressBarWrapper}>
                <ProgressBar
                  current={currentLevelIndex + 1}
                  total={25}
                  color="var(--color-primary)"
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.headerRight}>
          {phase === 'PLAYING' && currentConfig && (
            <>
              <LevelTimer
                remainingSeconds={remainingLevelTime}
                totalSeconds={currentConfig.levelTime}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowEndModal(true)}
                className={styles.endGameBtn}
              >
                <LogOut size={16} />
                <span>End Game</span>
              </Button>
            </>
          )}

          {phase === 'GAME_SELECTION' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className={styles.exitBtn}
            >
              <span>Dashboard</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.mainContent}>
        {/* 1. GAME SELECTION SCREEN */}
        {phase === 'GAME_SELECTION' && (
          <div className={styles.selectionContainer}>
            <div className={styles.selectionHeader}>
              <Badge variant="primary" size="md">Cognitive Assessment Practice</Badge>
              <h1 className={styles.selectionTitle}>Choose an Assessment Game</h1>
              <p className={styles.selectionSubtitle}>
                Select any of the three independent cognitive games below to practice. You can complete games in any order.
              </p>
            </div>

            <div className={styles.gameCardsGrid}>
              {GAME_ORDER.map((gameKey) => {
                const config = GAME_CONFIG[gameKey];
                const Icon = GAME_ICONS[gameKey];
                const completedCount = levelRecords.filter((r) => r.gameType === gameKey).length;
                const solvedCount = levelRecords.filter((r) => r.gameType === gameKey && r.correct).length;
                const isFinished = completedCount >= 25;

                return (
                  <div key={gameKey} className={styles.gameSelectCard}>
                    <div className={styles.gameCardTop}>
                      <div className={styles.gameCardIconWrapper}>
                        <Icon size={24} />
                      </div>
                      <Badge variant={isFinished ? 'success' : completedCount > 0 ? 'warning' : 'default'}>
                        {isFinished ? 'Complete (25/25)' : completedCount > 0 ? `${completedCount}/25 Levels` : 'Not Started'}
                      </Badge>
                    </div>

                    <h2 className={styles.cardTitle}>{config.title}</h2>
                    <span className={styles.cardSubtitle}>{config.subtitle}</span>
                    <p className={styles.cardDesc}>{config.description}</p>

                    <div className={styles.cardMetaList}>
                      <div className={styles.cardMetaItem}>
                        <Zap size={14} />
                        <span>25 Levels</span>
                      </div>
                      <div className={styles.cardMetaItem}>
                        <Clock size={14} />
                        <span>{config.levelTime < 60 ? `${config.levelTime}s / level` : `${config.levelTime / 60}m / level`}</span>
                      </div>
                      <div className={styles.cardMetaItem}>
                        <ShieldCheck size={14} />
                        <span>{config.cognitiveSkill}</span>
                      </div>
                    </div>

                    <div className={styles.cardActionRow}>
                      <Button
                        variant={isFinished ? 'secondary' : 'primary'}
                        size="md"
                        fullWidth
                        onClick={() => selectGame(gameKey)}
                      >
                        <span>{isFinished ? 'Replay Game' : completedCount > 0 ? 'Resume Game' : 'Start Game'}</span>
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {levelRecords.length > 0 && (
              <div className={styles.resultsPromptSection}>
                <div className={styles.resultsPromptLeft}>
                  <strong>Assessment in progress:</strong>
                  <span> {levelRecords.length} / 75 total levels completed</span>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={finishAssessment}
                >
                  <BarChart2 size={16} />
                  <span>View Full Assessment Results</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 2. ACTIVE GAMEPLAY */}
        {phase === 'PLAYING' && currentLevel && (
          <div className={styles.gameStage}>
            {selectedGameKey === 'bubbles' && (
              <SelectBubblesGame
                key={currentLevel.id}
                levelData={currentLevel}
                onLevelComplete={completeLevel}
                levelStartTime={levelStartTime}
              />
            )}

            {selectedGameKey === 'maze' && (
              <InvisibleMazeGame
                key={currentLevel.id}
                levelData={currentLevel}
                onLevelComplete={completeLevel}
                levelStartTime={levelStartTime}
              />
            )}

            {selectedGameKey === 'pathfinder' && (
              <PathfinderGame
                key={currentLevel.id}
                levelData={currentLevel}
                onLevelComplete={completeLevel}
                levelStartTime={levelStartTime}
              />
            )}
          </div>
        )}

        {/* 3. GAME SUMMARY (AFTER 25 LEVELS OF SELECTED GAME) */}
        {phase === 'GAME_SUMMARY' && currentConfig && (
          <div className={styles.summaryCard}>
            <div className={styles.summaryIconWrapper}>
              <Award size={36} className={styles.summaryAwardIcon} />
            </div>

            <h2 className={styles.summaryTitle}>{currentConfig.title} Complete</h2>
            <p className={styles.summarySubtitle}>
              You have completed all 25 levels of {currentConfig.title}!
            </p>

            <div className={styles.summaryStatsGrid}>
              <div className={styles.statBox}>
                <CheckCircle size={20} className={styles.statIconSuccess} />
                <span className={styles.statBoxValue}>
                  {activeGameRecords.filter((r) => r.correct).length} / 25
                </span>
                <span className={styles.statBoxLabel}>Solved</span>
              </div>

              <div className={styles.statBox}>
                <Zap size={20} className={styles.statIconAccent} />
                <span className={styles.statBoxValue}>
                  {Math.round((activeGameRecords.filter((r) => r.correct).length / 25) * 100)}%
                </span>
                <span className={styles.statBoxLabel}>Accuracy</span>
              </div>

              <div className={styles.statBox}>
                <Clock size={20} className={styles.statIconClock} />
                <span className={styles.statBoxValue}>
                  {activeGameRecords.length > 0
                    ? (activeGameRecords.reduce((a, r) => a + (r.timeSpent || 0), 0) / activeGameRecords.length).toFixed(1)
                    : 0}s
                </span>
                <span className={styles.statBoxLabel}>Avg Time</span>
              </div>
            </div>

            <div className={styles.summaryActionButtons}>
              <Button
                variant="primary"
                size="lg"
                onClick={returnToSelection}
                className={styles.summaryBtn}
              >
                <span>Choose Another Game</span>
                <ArrowRight size={18} />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={finishAssessment}
                className={styles.summaryBtn}
              >
                <BarChart2 size={18} />
                <span>View Full Results</span>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* End Game Confirmation Modal */}
      {showEndModal && (
        <Modal
          isOpen={showEndModal}
          onClose={() => setShowEndModal(false)}
          title="End Game?"
        >
          <div className={styles.endModalBody}>
            <p className={styles.endModalText}>
              Your progress will be saved, but you will leave this game.
            </p>
            <div className={styles.endModalProgressCard}>
              <span>You have completed:</span>
              <strong>{completedInActive} / 25 levels</strong>
            </div>
            <div className={styles.endModalActions}>
              <Button
                variant="secondary"
                onClick={() => setShowEndModal(false)}
              >
                Continue Playing
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShowEndModal(false);
                  endCurrentGame();
                }}
              >
                End Game
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export { Assessment };
