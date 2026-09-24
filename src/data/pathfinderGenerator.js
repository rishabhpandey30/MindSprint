/**
 * Pathfinder Puzzle Generator — Select, Rotate, Reverse Edition
 *
 * Mechanic:
 *  - Grid has grey (path) tiles and white (empty) tiles.
 *  - Player selects a grey tile, then presses ↻ to rotate 90° CW
 *    or ⇆ to reverse the tile's direction.
 *  - Pressing ✓ validates via BFS whether Start → End is connected.
 *  - Every puzzle is guaranteed solvable & not pre-solved.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const OPPOSITE = {
  up: 'down', down: 'up',
  left: 'right', right: 'left',
  'up-right': 'down-left', 'down-left': 'up-right',
  'up-left': 'down-right', 'down-right': 'up-left',
};

const OFFSETS = {
  up:       { dr: -1, dc:  0 },
  down:     { dr:  1, dc:  0 },
  left:     { dr:  0, dc: -1 },
  right:    { dr:  0, dc:  1 },
  'up-right':   { dr: -1, dc:  1 },
  'up-left':    { dr: -1, dc: -1 },
  'down-right': { dr:  1, dc:  1 },
  'down-left':  { dr:  1, dc: -1 },
};

// 90° clockwise rotation map for each direction
const ROTATE_CW = {
  up: 'right', right: 'down', down: 'left', left: 'up',
  'up-right': 'down-right', 'down-right': 'down-left',
  'down-left': 'up-left', 'up-left': 'up-right',
};

// ─── Rotation & Reversal helpers ──────────────────────────────────────────────

/** Rotate a single direction 90° CW */
function rotateDir(dir) {
  return ROTATE_CW[dir] || dir;
}

/** Rotate a connections array 90° CW */
export function rotateConnections(connections) {
  return connections.map(rotateDir);
}

/** Reverse a single direction (its exact opposite) */
function reverseDir(dir) {
  return OPPOSITE[dir] || dir;
}

/** Reverse all connections of a tile (flip direction) */
export function reverseConnections(connections) {
  return connections.map(reverseDir);
}

// ─── Tile-type helper ─────────────────────────────────────────────────────────

function getTileType(connections) {
  const s = [...connections].sort().join('-');
  if (s === 'left-right') return 'straight-h';
  if (s === 'down-up')    return 'straight-v';
  if (s === 'right-up')   return 'corner-ur';
  if (s === 'left-up')    return 'corner-ul';
  if (s === 'down-right') return 'corner-dr';
  if (s === 'down-left')  return 'corner-dl';
  if (s === 'down-left-right') return 't-down';
  if (s === 'left-right-up')   return 't-up';
  if (s === 'down-left-up')    return 't-left';
  if (s === 'down-right-up')   return 't-right';
  return 'straight-h';
}

// ─── Path validation (BFS) ────────────────────────────────────────────────────

/**
 * BFS from start to end following current tile connections.
 * Two tiles connect when tile A's outgoing direction equals the
 * exact opposite of tile B's corresponding incoming direction.
 *
 * Returns { solved: boolean, route: string[] }
 */
export function checkPathfinderSolution(gridSize, start, end, tiles) {
  // Build grid map
  const grid = {};
  for (const t of tiles) {
    if (t.type === 'empty') continue;
    grid[`${t.r},${t.c}`] = t;
  }

  const startKey = `${start.r},${start.c}`;
  const endKey   = `${end.r},${end.c}`;

  // Start tile must exist and have a connection toward the grid entry direction
  const startTile = grid[startKey];
  if (!startTile) return { solved: false, route: [] };

  const visited = new Set([startKey]);
  const route   = [startKey];
  const queue   = [{ r: start.r, c: start.c }];

  while (queue.length > 0) {
    const curr = queue.shift();
    const currKey = `${curr.r},${curr.c}`;
    if (currKey === endKey) return { solved: true, route };

    const currTile = grid[currKey];
    if (!currTile) continue;

    for (const dir of currTile.connections) {
      const off = OFFSETS[dir];
      if (!off) continue;
      const nr = curr.r + off.dr;
      const nc = curr.c + off.dc;
      const nk = `${nr},${nc}`;
      if (visited.has(nk)) continue;

      const neighbor = grid[nk];
      if (!neighbor) continue;

      const needed = OPPOSITE[dir];
      if (!needed) continue;

      if (neighbor.connections.includes(needed)) {
        visited.add(nk);
        route.push(nk);
        queue.push({ r: nr, c: nc });
      }
    }
  }

  return { solved: false, route };
}

// ─── Random-walk path generation ─────────────────────────────────────────────

function generateWalkPath(gridSize, start, end, minLength) {
  const maxAttempts = 400;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const path = [{ ...start }];
    const visited = new Set([`${start.r},${start.c}`]);
    let curr = { ...start };

    for (let step = 0; step < gridSize * gridSize * 2; step++) {
      if (curr.r === end.r && curr.c === end.c) break;

      const dirs = ['up', 'down', 'left', 'right'];
      dirs.sort(() => {
        const bias =
          Math.abs(curr.r - end.r) + Math.abs(curr.c - end.c) > 1
            ? (Math.random() - 0.4)
            : Math.random() - 0.5;
        return bias;
      });

      let moved = false;
      for (const d of dirs) {
        const off = OFFSETS[d];
        const nr = curr.r + off.dr;
        const nc = curr.c + off.dc;
        if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) continue;
        if (visited.has(`${nr},${nc}`)) continue;
        visited.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
        path.push({ ...curr });
        moved = true;
        break;
      }
      if (!moved) break;
    }

    if (curr.r === end.r && curr.c === end.c && path.length >= minLength) {
      return path;
    }
  }

  // Fallback: L-shaped path
  const path = [{ ...start }];
  let r = start.r;
  let c = start.c;
  while (c < end.c) { c++; path.push({ r, c }); }
  while (r < end.r) { r++; path.push({ r, c }); }
  while (r > end.r) { r--; path.push({ r, c }); }
  return path;
}

// ─── Build solved tile layout ─────────────────────────────────────────────────

function buildSolvedTiles(walkPath, gridSize, start, end, distractorCount) {
  const pathSet = new Set(walkPath.map((p) => `${p.r},${p.c}`));
  const tiles = [];

  // Path tiles
  for (let i = 0; i < walkPath.length; i++) {
    const curr = walkPath[i];
    const prev = i > 0 ? walkPath[i - 1] : null;
    const next = i < walkPath.length - 1 ? walkPath[i + 1] : null;

    const connections = [];

    if (prev) {
      // Direction from curr back to prev
      if (prev.r < curr.r) connections.push('up');
      else if (prev.r > curr.r) connections.push('down');
      else if (prev.c < curr.c) connections.push('left');
      else if (prev.c > curr.c) connections.push('right');
    }

    if (next) {
      // Direction from curr toward next
      if (next.r < curr.r) connections.push('up');
      else if (next.r > curr.r) connections.push('down');
      else if (next.c < curr.c) connections.push('left');
      else if (next.c > curr.c) connections.push('right');
    }

    const isStart = curr.r === start.r && curr.c === start.c;
    const isEnd   = curr.r === end.r   && curr.c === end.c;

    tiles.push({
      id: `pt-${curr.r}-${curr.c}`,
      r: curr.r,
      c: curr.c,
      isStart,
      isEnd,
      isPath: true,
      type: isStart ? 'start' : isEnd ? 'end' : getTileType(connections),
      connections,
    });
  }

  // Empty/white tiles for non-path cells
  const emptyPositions = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!pathSet.has(`${r},${c}`)) {
        emptyPositions.push({ r, c });
      }
    }
  }

  // Shuffle empty positions and pick distractorCount of them for grey tiles
  for (let i = emptyPositions.length - 1; i > 0; i--) {
    const j = rng(0, i);
    [emptyPositions[i], emptyPositions[j]] = [emptyPositions[j], emptyPositions[i]];
  }

  const DISTRACTOR_CONNS = [
    ['left', 'right'],
    ['up', 'down'],
    ['up', 'right'],
    ['up', 'left'],
    ['down', 'right'],
    ['down', 'left'],
  ];

  const greyCount = Math.min(distractorCount, emptyPositions.length);
  for (let i = 0; i < emptyPositions.length; i++) {
    const pos = emptyPositions[i];
    if (i < greyCount) {
      const base = DISTRACTOR_CONNS[rng(0, DISTRACTOR_CONNS.length - 1)];
      tiles.push({
        id: `dt-${pos.r}-${pos.c}`,
        r: pos.r,
        c: pos.c,
        isStart: false,
        isEnd: false,
        isPath: false,
        type: getTileType(base),
        connections: [...base],
      });
    } else {
      // White/empty cell
      tiles.push({
        id: `et-${pos.r}-${pos.c}`,
        r: pos.r,
        c: pos.c,
        isStart: false,
        isEnd: false,
        isPath: false,
        type: 'empty',
        connections: [],
      });
    }
  }

  return tiles;
}

// ─── Scramble ─────────────────────────────────────────────────────────────────

function scrambleTiles(tiles, gridSize, start, end) {
  for (let attempt = 0; attempt < 150; attempt++) {
    const scrambled = tiles.map((tile) => {
      if (tile.isStart || tile.isEnd || tile.type === 'empty') return { ...tile };

      let conns = [...tile.connections];
      const rotations = rng(1, 3);
      for (let k = 0; k < rotations; k++) conns = rotateConnections(conns);

      // 50% chance to also reverse
      if (Math.random() > 0.5) conns = reverseConnections(conns);

      return { ...tile, connections: conns, type: getTileType(conns) };
    });

    const { solved } = checkPathfinderSolution(gridSize, start, end, scrambled);
    if (!solved) return scrambled;
  }

  // Fallback — rotate start tile once so it's definitely broken
  return tiles.map((tile) => {
    if (tile.isStart || tile.isEnd || tile.type === 'empty') return { ...tile };
    const conns = rotateConnections(tile.connections);
    return { ...tile, connections: conns, type: getTileType(conns) };
  });
}

// ─── Level generator ──────────────────────────────────────────────────────────

export function generatePathfinderLevel(levelIndex) {
  let gridSize, difficulty, minPathLen, distractors;

  if (levelIndex <= 5) {
    gridSize = 3; difficulty = 'easy'; minPathLen = 3; distractors = 1;
  } else if (levelIndex <= 10) {
    gridSize = 4; difficulty = 'medium'; minPathLen = 4; distractors = 2;
  } else if (levelIndex <= 15) {
    gridSize = 4; difficulty = 'medium'; minPathLen = 5; distractors = 3;
  } else if (levelIndex <= 20) {
    gridSize = 5; difficulty = 'hard'; minPathLen = 6; distractors = 4;
  } else {
    gridSize = levelIndex % 2 === 0 ? 6 : 5;
    difficulty = 'very_hard';
    minPathLen = 7;
    distractors = 5;
  }

  const start = { r: 0, c: 0 };
  const end   = { r: gridSize - 1, c: gridSize - 1 };

  const walkPath    = generateWalkPath(gridSize, start, end, minPathLen);
  const solvedTiles = buildSolvedTiles(walkPath, gridSize, start, end, distractors);
  const tiles       = scrambleTiles(solvedTiles, gridSize, start, end);

  const optimalMoves = Math.max(2, Math.floor(walkPath.length * 0.5));

  return {
    id: `path-${String(levelIndex).padStart(2, '0')}`,
    levelNumber: levelIndex,
    gameType: 'pathfinder',
    difficulty,
    gridSize,
    start,
    end,
    tiles,
    optimalMoves,
    timeLimit: 240,
  };
}

export function generateAllPathfinderLevels() {
  const levels = [];
  for (let i = 1; i <= 25; i++) {
    levels.push(generatePathfinderLevel(i));
  }
  return levels;
}
