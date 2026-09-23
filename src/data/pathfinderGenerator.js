/**
 * Pathfinder Game Data Generator
 * Generates 25 path-tile rearrangement puzzles (3x3 to 6x6).
 * Flow:
 * 1. Generates a valid continuous path from Start to End.
 * 2. Assigns correct fixed-orientation tiles along the path.
 * 3. Fills remaining cells with distractor tiles.
 * 4. Shuffles movable tile positions.
 * 5. Validates solvability with path tracer.
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Direction definitions & opposite connections
const OPPOSITE_DIR = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const DIR_OFFSETS = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
};

/**
 * Determine tile type and connection array given entering direction and leaving direction
 */
function getTileTypeForDirections(dirs) {
  const sorted = [...dirs].sort();
  const key = sorted.join('-');

  if (key === 'left-right') return { type: 'straight-h', connections: ['left', 'right'] };
  if (key === 'down-up') return { type: 'straight-v', connections: ['up', 'down'] };
  if (key === 'right-up') return { type: 'corner-ur', connections: ['up', 'right'] }; // └
  if (key === 'left-up') return { type: 'corner-ul', connections: ['up', 'left'] };   // ┘
  if (key === 'down-right') return { type: 'corner-dr', connections: ['down', 'right'] }; // ┌
  if (key === 'down-left') return { type: 'corner-dl', connections: ['down', 'left'] };   // ┐

  return { type: 'straight-h', connections: ['left', 'right'] };
}

/**
 * Distractor tile pool
 */
const DISTRACTOR_TEMPLATES = [
  { type: 'straight-h', connections: ['left', 'right'] },
  { type: 'straight-v', connections: ['up', 'down'] },
  { type: 'corner-ur', connections: ['up', 'right'] },
  { type: 'corner-ul', connections: ['up', 'left'] },
  { type: 'corner-dr', connections: ['down', 'right'] },
  { type: 'corner-dl', connections: ['down', 'left'] },
  { type: 't-up', connections: ['left', 'right', 'up'] },
  { type: 't-down', connections: ['left', 'right', 'down'] },
];

/**
 * Procedural random walk from Start to End without self-intersection
 */
function generateRandomWalkPath(gridSize, start, end) {
  const maxAttempts = 300;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const path = [{ r: start.r, c: start.c }];
    const visited = new Set([`${start.r},${start.c}`]);

    let curr = { ...start };
    let steps = 0;
    const minSteps = gridSize + 1; // Require non-trivial path

    while (!(curr.r === end.r && curr.c === end.c) && steps < gridSize * gridSize) {
      steps++;
      const possibleDirs = [];

      for (const dirName of ['up', 'right', 'down', 'left']) {
        const offset = DIR_OFFSETS[dirName];
        const nr = curr.r + offset.dr;
        const nc = curr.c + offset.dc;

        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
          if (!visited.has(`${nr},${nc}`)) {
            possibleDirs.push({ dirName, nr, nc });
          }
        }
      }

      if (possibleDirs.length === 0) break; // Dead end, retry

      // Weight direction towards end to guarantee convergence
      possibleDirs.sort((a, b) => {
        const distA = Math.abs(a.nr - end.r) + Math.abs(a.nc - end.c);
        const distB = Math.abs(b.nr - end.r) + Math.abs(b.nc - end.c);
        return distA + (Math.random() * 2 - 1) - (distB + (Math.random() * 2 - 1));
      });

      const next = possibleDirs[0];
      visited.add(`${next.nr},${next.nc}`);
      path.push({ r: next.nr, c: next.nc });
      curr = { r: next.nr, c: next.nc };
    }

    if (curr.r === end.r && curr.c === end.c && path.length >= minSteps) {
      return path;
    }
  }

  // Fallback manhattan path if random walk fails
  const fallback = [{ r: start.r, c: start.c }];
  let r = start.r;
  let c = start.c;
  while (c < end.c) { c++; fallback.push({ r, c }); }
  while (r < end.r) { r++; fallback.push({ r, c }); }
  return fallback;
}

/**
 * Validates whether current tile layout connects Start to End continuously
 */
export function checkPathfinderSolution(gridSize, start, end, tiles) {
  // Map coordinates to tile
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  for (const t of tiles) {
    if (t.r >= 0 && t.r < gridSize && t.c >= 0 && t.c < gridSize) {
      grid[t.r][t.c] = t;
    }
  }

  const startTile = grid[start.r][start.c];
  if (!startTile) return { solved: false, route: [] };

  // Trace from start
  const route = [`${start.r},${start.c}`];
  let curr = { r: start.r, c: start.c };
  let visited = new Set([`${start.r},${start.c}`]);

  let currentTile = startTile;

  while (true) {
    if (curr.r === end.r && curr.c === end.c) {
      return { solved: true, route };
    }

    // Find valid outbound connection from currentTile that connects to neighbor
    let foundNext = false;
    for (const dir of currentTile.connections) {
      const offset = DIR_OFFSETS[dir];
      const nr = curr.r + offset.dr;
      const nc = curr.c + offset.dc;

      if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && !visited.has(`${nr},${nc}`)) {
        const neighbor = grid[nr][nc];
        if (neighbor) {
          const neededOpposite = OPPOSITE_DIR[dir];
          if (neighbor.connections.includes(neededOpposite)) {
            // Valid continuous connection!
            visited.add(`${nr},${nc}`);
            route.push(`${nr},${nc}`);
            curr = { r: nr, c: nc };
            currentTile = neighbor;
            foundNext = true;
            break;
          }
        }
      }
    }

    if (!foundNext) {
      return { solved: false, route };
    }
  }
}

/**
 * Generates a single Pathfinder level
 */
export function generatePathfinderLevel(levelIndex) {
  let gridSize = 3;
  let difficulty = 'easy';

  if (levelIndex <= 5) {
    gridSize = 3;
    difficulty = 'easy';
  } else if (levelIndex <= 12) {
    gridSize = 4;
    difficulty = 'medium';
  } else if (levelIndex <= 19) {
    gridSize = 5;
    difficulty = 'hard';
  } else {
    gridSize = (levelIndex % 2 === 0) ? 6 : 5;
    difficulty = 'very_hard';
  }

  const start = { r: 0, c: 0 };
  const end = { r: gridSize - 1, c: gridSize - 1 };

  const walkPath = generateRandomWalkPath(gridSize, start, end);

  // Build solved tile map
  const solvedTiles = [];
  const pathSet = new Set(walkPath.map((p) => `${p.r},${p.c}`));

  for (let i = 0; i < walkPath.length; i++) {
    const curr = walkPath[i];
    const prev = i > 0 ? walkPath[i - 1] : null;
    const next = i < walkPath.length - 1 ? walkPath[i + 1] : null;

    const dirs = [];
    if (prev) {
      if (prev.r < curr.r) dirs.push('up');
      else if (prev.r > curr.r) dirs.push('down');
      else if (prev.c < curr.c) dirs.push('left');
      else if (prev.c > curr.c) dirs.push('right');
    } else {
      // Start tile: connect towards next tile
      if (next.r > curr.r) dirs.push('down');
      else if (next.c > curr.c) dirs.push('right');
    }

    if (next) {
      if (next.r < curr.r) dirs.push('up');
      else if (next.r > curr.r) dirs.push('down');
      else if (next.c < curr.c) dirs.push('left');
      else if (next.c > curr.c) dirs.push('right');
    } else {
      // End tile: connect from prev tile
      // dirs already has prev connection
    }

    // Determine tile properties
    let tileData;
    const isStart = (curr.r === start.r && curr.c === start.c);
    const isEnd = (curr.r === end.r && curr.c === end.c);

    if (isStart) {
      tileData = { type: 'start', connections: [...dirs] };
    } else if (isEnd) {
      tileData = { type: 'end', connections: [...dirs] };
    } else {
      tileData = getTileTypeForDirections(dirs);
    }

    solvedTiles.push({
      id: `tile-p-${curr.r}-${curr.c}`,
      r: curr.r,
      c: curr.c,
      initialSolvedR: curr.r,
      initialSolvedC: curr.c,
      isStart,
      isEnd,
      type: tileData.type,
      connections: tileData.connections,
    });
  }

  // Fill in distractor tiles for remaining non-path cells
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!pathSet.has(`${r},${c}`)) {
        const randTemplate = DISTRACTOR_TEMPLATES[getRandomInt(0, DISTRACTOR_TEMPLATES.length - 1)];
        solvedTiles.push({
          id: `tile-d-${r}-${c}`,
          r,
          c,
          initialSolvedR: r,
          initialSolvedC: c,
          isStart: false,
          isEnd: false,
          type: randTemplate.type,
          connections: randTemplate.connections,
        });
      }
    }
  }

  // Separate fixed start/end vs swappable tiles
  const swappableTiles = solvedTiles.filter((t) => !t.isStart && !t.isEnd);
  const swappablePositions = swappableTiles.map((t) => ({ r: t.r, c: t.c }));

  // Shuffle swappable tiles positions (ensuring it does not start in solved state)
  let shuffledTiles = [];
  let isAlreadySolved = true;
  let shuffleAttempts = 0;

  while (isAlreadySolved && shuffleAttempts < 50) {
    shuffleAttempts++;
    // Shuffle positions
    const posCopy = [...swappablePositions];
    for (let i = posCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [posCopy[i], posCopy[j]] = [posCopy[j], posCopy[i]];
    }

    shuffledTiles = [
      ...solvedTiles.filter((t) => t.isStart || t.isEnd),
      ...swappableTiles.map((tile, idx) => ({
        ...tile,
        r: posCopy[idx].r,
        c: posCopy[idx].c,
      })),
    ];

    const check = checkPathfinderSolution(gridSize, start, end, shuffledTiles);
    isAlreadySolved = check.solved;
  }

  const optimalMoves = Math.max(3, Math.floor(swappableTiles.length * 0.7));

  return {
    id: `path-${String(levelIndex).padStart(2, '0')}`,
    levelNumber: levelIndex,
    gameType: 'pathfinder',
    difficulty,
    gridSize,
    start,
    end,
    tiles: shuffledTiles,
    optimalMoves,
    timeLimit: 240, // 4 minutes
  };
}

/**
 * Generates all 25 levels for Game 3 (Pathfinder)
 */
export function generateAllPathfinderLevels() {
  const levels = [];
  for (let i = 1; i <= 25; i++) {
    levels.push(generatePathfinderLevel(i));
  }
  return levels;
}
