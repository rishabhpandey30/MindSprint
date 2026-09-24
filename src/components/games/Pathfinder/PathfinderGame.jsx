import React, { useState, useEffect, useCallback, useRef } from 'react';
import PathfinderGrid from './PathfinderGrid.jsx';
import {
  checkPathfinderSolution,
  rotateConnections,
  reverseConnections,
} from '../../../data/pathfinderGenerator.js';
import { RotateCw, ArrowLeftRight, Check, CheckCircle2, XCircle } from 'lucide-react';
import styles from './Pathfinder.module.css';

export default function PathfinderGame({ levelData, onLevelComplete, levelStartTime }) {
  const [tiles, setTiles] = useState(levelData.tiles);
  const [selectedId, setSelectedId] = useState(null);
  const [moves, setMoves] = useState(0);
  const [rotations, setRotations] = useState(0);
  const [dirChanges, setDirChanges] = useState(0);
  const [solvedRouteSet, setSolvedRouteSet] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState(null); // null | 'invalid'

  const isFinishedRef = useRef(false);
  const feedbackTimerRef = useRef(null);

  // Reset on level change
  useEffect(() => {
    setTiles(levelData.tiles);
    setSelectedId(null);
    setMoves(0);
    setRotations(0);
    setDirChanges(0);
    setSolvedRouteSet(new Set());
    setIsCompleted(false);
    setCheckFeedback(null);
    isFinishedRef.current = false;
    clearTimeout(feedbackTimerRef.current);
  }, [levelData]);

  // Click a tile to select it (grey tiles only)
  const handleTileClick = useCallback(
    (tile) => {
      if (isFinishedRef.current || isCompleted) return;
      if (tile.type === 'empty') return; // White cells cannot be selected
      if (tile.isStart || tile.isEnd) return;
      setSelectedId((prev) => (prev === tile.id ? null : tile.id));
      setCheckFeedback(null);
    },
    [isCompleted]
  );

  // ↻ Rotate selected tile 90° CW
  const handleRotate = useCallback(() => {
    if (isFinishedRef.current || isCompleted || !selectedId) return;

    setTiles((prev) =>
      prev.map((t) => {
        if (t.id !== selectedId) return t;
        const newConns = rotateConnections(t.connections);
        return { ...t, connections: newConns };
      })
    );
    setMoves((m) => m + 1);
    setRotations((r) => r + 1);
    setCheckFeedback(null);
  }, [isCompleted, selectedId]);

  // ⇆ Reverse selected tile direction
  const handleReverse = useCallback(() => {
    if (isFinishedRef.current || isCompleted || !selectedId) return;

    setTiles((prev) =>
      prev.map((t) => {
        if (t.id !== selectedId) return t;
        const newConns = reverseConnections(t.connections);
        return { ...t, connections: newConns };
      })
    );
    setMoves((m) => m + 1);
    setDirChanges((d) => d + 1);
    setCheckFeedback(null);
  }, [isCompleted, selectedId]);

  // ✓ Check solution via BFS
  const handleCheck = useCallback(() => {
    if (isFinishedRef.current || isCompleted) return;

    const result = checkPathfinderSolution(
      levelData.gridSize,
      levelData.start,
      levelData.end,
      tiles
    );

    if (result.solved) {
      setIsCompleted(true);
      isFinishedRef.current = true;
      setSolvedRouteSet(new Set(result.route));
      setSelectedId(null);

      const timeSpent = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));
      const totalMoves = moves + (rotations - rotations) + rotations + dirChanges; // = moves
      const optimal = levelData.optimalMoves || totalMoves || 1;
      const efficiency = Math.min(100, Math.round((optimal / Math.max(totalMoves, 1)) * 100));

      setTimeout(() => {
        onLevelComplete({
          levelId: levelData.id,
          gameType: 'pathfinder',
          difficulty: levelData.difficulty,
          timeLimit: levelData.timeLimit || 240,
          timeSpent: Math.min(timeSpent, 240),
          completed: true,
          timedOut: false,
          correct: true,
          moves,
          rotations,
          directionChanges: dirChanges,
          optimalMoves: optimal,
          efficiency,
        });
      }, 900);
    } else {
      // Flash invalid feedback for 1.8 s
      setCheckFeedback('invalid');
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => setCheckFeedback(null), 1800);
    }
  }, [
    isCompleted, levelData, levelStartTime, onLevelComplete,
    tiles, moves, rotations, dirChanges,
  ]);

  // Selected tile object
  const selectedTile = selectedId ? tiles.find((t) => t.id === selectedId) : null;
  const hasSelection = !!selectedTile;

  const efficiencyPct =
    moves > 0
      ? Math.min(100, Math.round(((levelData.optimalMoves || moves) / moves) * 100))
      : 100;

  return (
    <div className={styles.gameContainer}>
      {/* Objective banner */}
      <div className={styles.objectiveBanner}>
        <span className={styles.objectiveText}>
          Rotate or reverse tiles to connect{' '}
          <strong>Start (S)</strong> → <strong>End (E)</strong>, then press{' '}
          <strong>✓ Check</strong>
        </span>
      </div>

      {/* Grid with Start/End icons flanking it */}
      <div className={styles.gridPlayArea}>
        {/* Start icon */}
        <div className={styles.startEndIcon} data-role="start" aria-label="Start">
          <svg viewBox="0 0 40 40" width="40" height="40">
            <circle cx="20" cy="20" r="18" fill="#6366f1" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="800"
              fontFamily="system-ui,sans-serif">S</text>
          </svg>
          <span className={styles.iconLabel}>START</span>
        </div>

        <PathfinderGrid
          gridSize={levelData.gridSize}
          tiles={tiles}
          selectedId={selectedId}
          solvedRouteSet={solvedRouteSet}
          onTileClick={handleTileClick}
          disabled={isCompleted}
        />

        {/* End icon */}
        <div className={styles.startEndIcon} data-role="end" aria-label="End">
          <svg viewBox="0 0 40 40" width="40" height="40">
            <circle cx="20" cy="20" r="18" fill="#10b981" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="800"
              fontFamily="system-ui,sans-serif">E</text>
          </svg>
          <span className={styles.iconLabel}>TARGET</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsPanel}>
        {/* Action buttons */}
        <div className={styles.actionButtons}>
          <button
            className={[styles.actionBtn, !hasSelection || isCompleted ? styles.actionBtnDisabled : ''].join(' ')}
            onClick={handleRotate}
            disabled={!hasSelection || isCompleted}
            title="Rotate selected tile 90° clockwise (1 move)"
            aria-label="Rotate tile"
          >
            <RotateCw size={18} />
            <span>↻ Rotate</span>
          </button>

          <button
            className={[styles.actionBtn, !hasSelection || isCompleted ? styles.actionBtnDisabled : ''].join(' ')}
            onClick={handleReverse}
            disabled={!hasSelection || isCompleted}
            title="Reverse direction of selected tile (1 move)"
            aria-label="Reverse direction"
          >
            <ArrowLeftRight size={18} />
            <span>⇆ Reverse</span>
          </button>

          <button
            className={[
              styles.actionBtn,
              styles.actionBtnCheck,
              isCompleted ? styles.actionBtnDisabled : '',
              checkFeedback === 'invalid' ? styles.actionBtnInvalid : '',
            ].join(' ')}
            onClick={handleCheck}
            disabled={isCompleted}
            title="Check if path is complete"
            aria-label="Check path"
          >
            {checkFeedback === 'invalid' ? <XCircle size={18} /> : <Check size={18} />}
            <span>{checkFeedback === 'invalid' ? 'No Path' : '✓ Check'}</span>
          </button>
        </div>

        {/* Status / Moves row */}
        <div className={styles.statusRow}>
          <div className={styles.movesCounter}>
            <span>Moves: <strong>{moves}</strong></span>
            {levelData.optimalMoves && (
              <span className={styles.optimalHint}>(Par: {levelData.optimalMoves})</span>
            )}
          </div>

          {moves > 0 && !isCompleted && (
            <div className={styles.efficiencyBadge} data-good={String(efficiencyPct >= 70)}>
              {efficiencyPct}%
            </div>
          )}
        </div>

        {/* Hint text */}
        <div className={styles.interactionHint}>
          {isCompleted ? (
            <span className={styles.solvedHint}>
              <CheckCircle2 size={14} />
              Path connected! Well done.
            </span>
          ) : checkFeedback === 'invalid' ? (
            <span className={styles.invalidHint}>
              No continuous path found. Keep adjusting the tiles.
            </span>
          ) : hasSelection ? (
            <span>
              <strong>{selectedTile.id}</strong> selected — press{' '}
              <strong>↻ Rotate</strong> or <strong>⇆ Reverse</strong>, then <strong>✓ Check</strong>.
            </span>
          ) : (
            <span>Click a grey tile to select it, then use the buttons below.</span>
          )}
        </div>
      </div>
    </div>
  );
}
