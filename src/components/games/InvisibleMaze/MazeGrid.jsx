import React from 'react';
import { Key, DoorClosed, DoorOpen, Compass, Flag } from 'lucide-react';
import styles from './InvisibleMaze.module.css';

export default function MazeGrid({
  gridSize,
  start,
  keyPos,
  doorPos,
  playerPos,
  hasKey,
  isBumping,
}) {
  const cells = [];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isPlayer = playerPos.r === r && playerPos.c === c;
      const isStart = start.r === r && start.c === c;
      const isKey = keyPos.r === r && keyPos.c === c;
      const isDoor = doorPos.r === r && doorPos.c === c;

      cells.push(
        <div
          key={`cell-${r}-${c}`}
          className={`
            ${styles.mazeCell}
            ${isPlayer ? styles.cellPlayerActive : ''}
          `}
          data-row={r}
          data-col={c}
        >
          {/* Base indicators */}
          {isStart && !isPlayer && (
            <div className={styles.startMarker} title="Start Position">
              <Flag size={14} />
              <span>S</span>
            </div>
          )}

          {isKey && !hasKey && (
            <div className={styles.keyMarker} title="Collect Key">
              <Key size={18} className={styles.keyIcon} />
            </div>
          )}

          {isDoor && (
            <div
              className={`${styles.doorMarker} ${hasKey ? styles.doorUnlocked : styles.doorLocked}`}
              title={hasKey ? 'Door Unlocked — Step here to Exit!' : 'Door Locked — Find Key first!'}
            >
              {hasKey ? <DoorOpen size={20} /> : <DoorClosed size={20} />}
              <span className={styles.doorText}>{hasKey ? 'EXIT' : 'LOCKED'}</span>
            </div>
          )}

          {/* Player avatar */}
          {isPlayer && (
            <div
              className={`
                ${styles.playerToken}
                ${hasKey ? styles.playerWithKey : ''}
                ${isBumping ? styles.playerBump : ''}
              `}
            >
              <div className={styles.playerInner}>
                <Compass size={16} className={styles.playerCompass} />
              </div>
              {hasKey && (
                <div className={styles.playerKeyBadge}>
                  <Key size={10} />
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div
      className={styles.gridWrapper}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {cells}
    </div>
  );
}
