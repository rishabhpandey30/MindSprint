import React from 'react';
import styles from './Pathfinder.module.css';

/**
 * Renders a single Pathfinder cell.
 *
 * - type === 'empty'  → white/blank cell (not selectable)
 * - isStart / isEnd  → fixed terminal tiles (not selectable)
 * - everything else  → grey selectable path tile
 *
 * Pipe arms are drawn as SVG lines from the centre hub to each edge
 * that the tile connects to.
 */
export default function PathTile({
  tile,
  isSelected,
  isPartOfSolvedPath,
  onClick,
  disabled,
}) {
  const { isStart, isEnd, connections, type } = tile;

  const isEmpty     = type === 'empty';
  const isSelectable = !isEmpty && !isStart && !isEnd && !disabled;

  const hasUp    = connections.includes('up');
  const hasDown  = connections.includes('down');
  const hasLeft  = connections.includes('left');
  const hasRight = connections.includes('right');

  // Pipe colour
  const pipeColor = isPartOfSolvedPath ? '#10b981'
    : isSelected                       ? '#f59e0b'   // yellow when selected
    : isStart                          ? '#6366f1'
    : isEnd                            ? '#10b981'
    :                                    '#64748b';   // grey default

  const pipeW   = 16;
  const hubR    = pipeW / 2 + 2;
  const opacity = isPartOfSolvedPath ? 1 : 0.75;

  // Tile button class list
  const classes = [
    styles.pathTile,
    isEmpty             ? styles.tileEmpty    : styles.tileGrey,
    isSelected          ? styles.tileSelected : '',
    isPartOfSolvedPath  ? styles.tileSolved   : '',
    isStart             ? styles.tileTerminal : '',
    isEnd               ? styles.tileTerminal : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={() => isSelectable && onClick(tile)}
      disabled={!isSelectable}
      aria-label={
        isEmpty   ? 'Empty cell'
        : isStart ? 'Start tile'
        : isEnd   ? 'End tile'
        : `Path tile at row ${tile.r}, column ${tile.c}${isSelected ? ' (selected)' : ''}`
      }
    >
      {!isEmpty && (
        <svg
          className={styles.tileSvg}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solved background glow */}
          {isPartOfSolvedPath && (
            <rect
              x="2" y="2" width="96" height="96" rx="10"
              fill="rgba(16,185,129,0.09)"
              stroke="rgba(16,185,129,0.25)"
              strokeWidth="1.5"
            />
          )}

          {/* Pipe arms */}
          {hasUp && (
            <line x1="50" y1="50" x2="50" y2="2"
              stroke={pipeColor} strokeWidth={pipeW}
              strokeLinecap="round" opacity={opacity} />
          )}
          {hasDown && (
            <line x1="50" y1="50" x2="50" y2="98"
              stroke={pipeColor} strokeWidth={pipeW}
              strokeLinecap="round" opacity={opacity} />
          )}
          {hasLeft && (
            <line x1="50" y1="50" x2="2" y2="50"
              stroke={pipeColor} strokeWidth={pipeW}
              strokeLinecap="round" opacity={opacity} />
          )}
          {hasRight && (
            <line x1="50" y1="50" x2="98" y2="50"
              stroke={pipeColor} strokeWidth={pipeW}
              strokeLinecap="round" opacity={opacity} />
          )}

          {/* Centre hub */}
          <circle cx="50" cy="50" r={hubR}
            fill={pipeColor} opacity={isPartOfSolvedPath ? 1 : 0.85} />
          <circle cx="47" cy="47" r="3.5" fill="rgba(255,255,255,0.22)" />

          {/* Start badge */}
          {isStart && (
            <g>
              <defs>
                <radialGradient id={`sg-${tile.id}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="26" fill="#6366f1" />
              <circle cx="50" cy="50" r="26" fill={`url(#sg-${tile.id})`} />
              <text x="50" y="58" textAnchor="middle" fill="white"
                fontSize="22" fontWeight="800" fontFamily="system-ui,sans-serif">S</text>
            </g>
          )}

          {/* End badge */}
          {isEnd && (
            <g>
              <defs>
                <radialGradient id={`eg-${tile.id}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="26" fill="#10b981" />
              <circle cx="50" cy="50" r="26" fill={`url(#eg-${tile.id})`} />
              <text x="50" y="58" textAnchor="middle" fill="white"
                fontSize="22" fontWeight="800" fontFamily="system-ui,sans-serif">E</text>
            </g>
          )}

          {/* "Selectable" hint — small rotate indicator on interactive tiles */}
          {isSelectable && !isSelected && !isPartOfSolvedPath && (
            <text x="85" y="19" fontSize="13" fill={pipeColor}
              textAnchor="middle" opacity="0.4"
              fontFamily="system-ui,sans-serif">↻</text>
          )}
        </svg>
      )}
    </button>
  );
}
