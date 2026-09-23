import React, { useState, useEffect, useCallback, useRef } from 'react';
import MazeGrid from './MazeGrid.jsx';
import DPad from './DPad.jsx';
import { Key, ShieldAlert, CheckCircle, RotateCcw } from 'lucide-react';
import styles from './InvisibleMaze.module.css';

function getEdgeKey(r1, c1, r2, c2) {
  if (r1 < r2 || (r1 === r2 && c1 < c2)) {
    return `${r1},${c1}-${r2},${c2}`;
  }
  return `${r2},${c2}-${r1},${c1}`;
}

export default function InvisibleMazeGame({ levelData, onLevelComplete, levelStartTime }) {
  const [playerPos, setPlayerPos] = useState(levelData.start);
  const [hasKey, setHasKey] = useState(false);
  const [moves, setMoves] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [isBumping, setIsBumping] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const hiddenWallKeys = useRef(new Set());
  const isFinishedRef = useRef(false);

  // Initialize level
  useEffect(() => {
    setPlayerPos(levelData.start);
    setHasKey(false);
    setMoves(0);
    setCollisions(0);
    setIsBumping(false);
    setStatusMessage(null);
    setIsCompleted(false);
    isFinishedRef.current = false;

    // Cache hidden wall keys internally
    const wallKeys = new Set(
      levelData.hiddenWalls.map((w) => getEdgeKey(w.r1, w.c1, w.r2, w.c2))
    );
    hiddenWallKeys.current = wallKeys;
  }, [levelData]);

  const handleMove = useCallback(
    (direction) => {
      if (isFinishedRef.current || isCompleted) return;

      const deltas = {
        up: { dr: -1, dc: 0 },
        down: { dr: 1, dc: 0 },
        left: { dr: 0, dc: -1 },
        right: { dr: 0, dc: 1 },
      };

      const delta = deltas[direction];
      if (!delta) return;

      const nr = playerPos.r + delta.dr;
      const nc = playerPos.c + delta.dc;

      // 1. Check outer boundary
      if (nr < 0 || nr >= levelData.gridSize || nc < 0 || nc >= levelData.gridSize) {
        setIsBumping(true);
        setTimeout(() => setIsBumping(false), 200);
        return;
      }

      // 2. Check hidden wall collision
      const edge = getEdgeKey(playerPos.r, playerPos.c, nr, nc);
      if (hiddenWallKeys.current.has(edge)) {
        // Hidden wall hit!
        const nextCollisions = collisions + 1;
        setCollisions(nextCollisions);
        setIsBumping(true);
        setTimeout(() => setIsBumping(false), 300);

        // Memory game rule: RESET PLAYER TO START POSITION!
        setPlayerPos(levelData.start);
        setStatusMessage({ type: 'warning', text: 'Hidden wall collision — returned to Start!' });
        setTimeout(() => setStatusMessage(null), 1800);
        return;
      }

      // 3. Valid move
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      setPlayerPos({ r: nr, c: nc });

      // Check key pickup
      let nowHasKey = hasKey;
      if (nr === levelData.key.r && nc === levelData.key.c && !hasKey) {
        nowHasKey = true;
        setHasKey(true);
        setStatusMessage({ type: 'success', text: 'Key collected! Now navigate to the Exit Door.' });
        setTimeout(() => setStatusMessage(null), 2500);
      }

      // Check door arrival
      if (nr === levelData.door.r && nc === levelData.door.c) {
        if (nowHasKey) {
          // Success!
          setIsCompleted(true);
          isFinishedRef.current = true;
          const timeSpent = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));
          const optimal = levelData.optimalMoves || nextMoves;
          const efficiency = Math.min(100, Math.round((optimal / nextMoves) * 100));

          setTimeout(() => {
            onLevelComplete({
              levelId: levelData.id,
              gameType: 'maze',
              difficulty: levelData.difficulty,
              timeLimit: levelData.timeLimit || 180,
              timeSpent: Math.min(timeSpent, 180),
              completed: true,
              timedOut: false,
              correct: true,
              moves: nextMoves,
              collisions,
              keyCollected: true,
              efficiency,
            });
          }, 500);
        } else {
          setStatusMessage({ type: 'warning', text: 'Door is locked! You must find the Key first.' });
          setTimeout(() => setStatusMessage(null), 2500);
        }
      }
    },
    [collisions, hasKey, isCompleted, levelData, levelStartTime, moves, onLevelComplete, playerPos]
  );

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') handleMove('up');
      else if (key === 'arrowdown' || key === 's') handleMove('down');
      else if (key === 'arrowleft' || key === 'a') handleMove('left');
      else if (key === 'arrowright' || key === 'd') handleMove('right');
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.objectiveBanner}>
        <div className={styles.objectiveItem}>
          <span className={styles.objectiveStep}>1</span>
          <span className={styles.objectiveText}>
            Find & Collect <strong>Key</strong>
          </span>
          {hasKey && <CheckCircle size={16} className={styles.checkIcon} />}
        </div>
        <div className={styles.objectiveDivider}>→</div>
        <div className={styles.objectiveItem}>
          <span className={styles.objectiveStep}>2</span>
          <span className={styles.objectiveText}>
            Navigate to <strong>Exit Door</strong>
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className={`${styles.statusToast} ${styles[statusMessage.type]}`}>
          {statusMessage.type === 'warning' && <RotateCcw size={16} />}
          {statusMessage.type === 'success' && <Key size={16} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className={styles.mazePlayArea}>
        <MazeGrid
          gridSize={levelData.gridSize}
          start={levelData.start}
          keyPos={levelData.key}
          doorPos={levelData.door}
          playerPos={playerPos}
          hasKey={hasKey}
          isBumping={isBumping}
        />

        <div className={styles.controlsSection}>
          <DPad onMove={handleMove} disabled={isCompleted} />

          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Moves</span>
              <span className={styles.statValue}>{moves}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Collisions</span>
              <span className={styles.statValue}>{collisions}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Key Status</span>
              <span className={`${styles.statValue} ${hasKey ? styles.keyFound : styles.keyMissing}`}>
                {hasKey ? 'Found' : 'Searching'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controlsHelp}>
        Use <strong>Arrow Keys</strong> or <strong>W A S D</strong> or the on-screen D-Pad.
        Hitting a hidden wall resets you to <strong>Start</strong> — memorize the obstacles!
      </div>
    </div>
  );
}
