import React from 'react';
import PathTile from './PathTile.jsx';
import styles from './Pathfinder.module.css';

export default function PathfinderGrid({
  gridSize,
  tiles,
  selectedId,
  solvedRouteSet,
  onTileClick,
  disabled,
}) {
  const sortedTiles = [...tiles].sort((a, b) => a.r - b.r || a.c - b.c);

  return (
    <div
      className={styles.gridContainer}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {sortedTiles.map((tile) => (
        <PathTile
          key={tile.id}
          tile={tile}
          isSelected={selectedId === tile.id}
          isPartOfSolvedPath={solvedRouteSet.has(`${tile.r},${tile.c}`)}
          onClick={onTileClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
