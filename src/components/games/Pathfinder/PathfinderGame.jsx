import React, { useState, useEffect, useCallback, useRef } from 'react';
import PathfinderGrid from './PathfinderGrid.jsx';
import { checkPathfinderSolution } from '../../../data/pathfinderGenerator.js';
import { CheckCircle2, ArrowLeftRight } from 'lucide-react';
import styles from './Pathfinder.module.css';

export default function PathfinderGame({ levelData, onLevelComplete, levelStartTime }) {
  const [tiles, setTiles] = useState(levelData.tiles);
  const [selectedTile, setSelectedTile] = useState(null);
  const [swaps, setSwaps] = useState(0);
  const [solvedRouteSet, setSolvedRouteSet] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const isFinishedRef = useRef(false);

  // Initialize on level change
  useEffect(() => {
    setTiles(levelData.tiles);
    setSelectedTile(null);
    setSwaps(0);
    setSolvedRouteSet(new Set());
    setIsCompleted(false);
    isFinishedRef.current = false;
  }, [levelData]);

  const handleTileClick = useCallback(
    (clickedTile) => {
      if (isFinishedRef.current || isCompleted) return;

      // Cannot swap fixed Start or End terminals
      if (clickedTile.isStart || clickedTile.isEnd) return;

      if (!selectedTile) {
        // Select first tile
        setSelectedTile(clickedTile);
      } else if (selectedTile.id === clickedTile.id) {
        // Deselect
        setSelectedTile(null);
      } else {
        // Perform Swap between selectedTile and clickedTile
        const tileA = selectedTile;
        const tileB = clickedTile;

        const nextTiles = tiles.map((t) => {
          if (t.id === tileA.id) {
            return { ...t, r: tileB.r, c: tileB.c };
          }
          if (t.id === tileB.id) {
            return { ...t, r: tileA.r, c: tileA.c };
          }
          return t;
        });

        const nextSwaps = swaps + 1;
        setSwaps(nextSwaps);
        setTiles(nextTiles);
        setSelectedTile(null);

        // Check if now solved!
        const result = checkPathfinderSolution(
          levelData.gridSize,
          levelData.start,
          levelData.end,
          nextTiles
        );

        if (result.solved) {
          setIsCompleted(true);
          isFinishedRef.current = true;
          setSolvedRouteSet(new Set(result.route));

          const timeSpent = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));
          const optimal = levelData.optimalMoves || nextSwaps;
          const efficiency = Math.min(100, Math.round((optimal / nextSwaps) * 100));

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
              swaps: nextSwaps,
              efficiency,
            });
          }, 600);
        }
      }
    },
    [isCompleted, levelData, levelStartTime, onLevelComplete, selectedTile, swaps, tiles]
  );

  return (
    <div className={styles.gameContainer}>
      <div className={styles.objectiveBanner}>
        <span className={styles.objectiveText}>
          Swap path tiles to connect <strong>Start (S)</strong> to <strong>End (E)</strong>
        </span>
      </div>

      <div className={styles.gridPlayArea}>
        <PathfinderGrid
          gridSize={levelData.gridSize}
          tiles={tiles}
          selectedTile={selectedTile}
          solvedRouteSet={solvedRouteSet}
          onTileClick={handleTileClick}
          disabled={isCompleted}
        />
      </div>

      <div className={styles.footerPanel}>
        <div className={styles.swapsCounter}>
          <ArrowLeftRight size={16} className={styles.swapIcon} />
          <span>Swaps: <strong>{swaps}</strong></span>
          {levelData.optimalMoves && (
            <span className={styles.optimalHint}>(Par: {levelData.optimalMoves})</span>
          )}
        </div>

        <div className={styles.interactionHint}>
          {selectedTile ? (
            <span className={styles.swapActiveHint}>
              Tile selected. Click another tile to <strong>swap positions</strong>.
            </span>
          ) : (
            <span>Click any tile to select, then click another to swap. Tile orientation is fixed.</span>
          )}
        </div>
      </div>
    </div>
  );
}
