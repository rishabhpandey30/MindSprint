import React from 'react';
import styles from './Pathfinder.module.css';

export default function PathTile({
  tile,
  isSelected,
  isPartOfSolvedPath,
  onClick,
  disabled,
}) {
  const { isStart, isEnd, connections, type } = tile;

  // Render SVG path segments matching tile connection array
  const hasUp = connections.includes('up');
  const hasDown = connections.includes('down');
  const hasLeft = connections.includes('left');
  const hasRight = connections.includes('right');

  const strokeColor = isPartOfSolvedPath ? '#10b981' : isSelected ? '#4f46e5' : '#475569';
  const strokeWidth = isPartOfSolvedPath ? 14 : 12;

  return (
    <button
      type="button"
      className={`
        ${styles.pathTile}
        ${isSelected ? styles.tileSelected : ''}
        ${isPartOfSolvedPath ? styles.tileSolved : ''}
        ${isStart ? styles.tileStart : ''}
        ${isEnd ? styles.tileEnd : ''}
      `}
      onClick={() => !disabled && !isStart && !isEnd && onClick(tile)}
      disabled={disabled || isStart || isEnd}
      aria-label={`${type} tile at row ${tile.r} col ${tile.c}`}
    >
      <svg className={styles.tileSvg} viewBox="0 0 100 100">
        {/* Background track channel */}
        <rect x="0" y="0" width="100" height="100" rx="12" fill="transparent" />

        {/* Center hub */}
        <circle cx="50" cy="50" r={strokeWidth / 2} fill={strokeColor} />

        {/* Connection arms */}
        {hasUp && (
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="0"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
          />
        )}
        {hasDown && (
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="100"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
          />
        )}
        {hasLeft && (
          <line
            x1="50"
            y1="50"
            x2="0"
            y2="50"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
          />
        )}
        {hasRight && (
          <line
            x1="50"
            y1="50"
            x2="100"
            y2="50"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
          />
        )}

        {/* Start / End Badges */}
        {isStart && (
          <g>
            <circle cx="50" cy="50" r="22" fill="#4f46e5" />
            <text x="50" y="56" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">
              S
            </text>
          </g>
        )}

        {isEnd && (
          <g>
            <circle cx="50" cy="50" r="22" fill="#10b981" />
            <text x="50" y="56" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">
              E
            </text>
          </g>
        )}
      </svg>
    </button>
  );
}
