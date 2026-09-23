import React from 'react';
import PathTile from './PathTile.jsx';
import styles from './Pathfinder.module.css';

export default function PathfinderGrid({
  gridSize,
  tiles,
  selectedTile,
  solvedRouteSet,
  onTileClick,
  disabled,
}) {
  // Sort tiles by row and column to ensure correct grid positioning
  const sortedTiles = [...tiles].sort((a, b) => a.r - b.r || a.c - b.c);

  return (
    <div
      className={styles.gridContainer}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {sortedTiles.map((tile) => {
        const isSelected = selectedTile?.id === tile.id;
        const isPartOfSolvedPath = solvedRouteSet.has(`${tile.r},${tile.c}`);

        return (
          <PathTile
            key={tile.id}
            tile={tile}
            isSelected={isSelected}
            isPartOfSolvedPath={isPartOfSolvedPath}
            onClick={onTileClick}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}
