/**
 * Invisible Maze Game Data Generator
 * Generates 25 hidden-wall maze puzzles (4x4 to 7x7).
 * Uses BFS to validate:
 * 1. Key (K) is reachable from Start (S).
 * 2. Door (D) is reachable from Key (K).
 * 3. Wall collisions are tracked and revealed dynamically.
 * 4. Computes optimal move count for efficiency calculations.
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function edgeKey(r1, c1, r2, c2) {
  if (r1 < r2 || (r1 === r2 && c1 < c2)) {
    return `${r1},${c1}-${r2},${c2}`;
  }
  return `${r2},${c2}-${r1},${c1}`;
}

// Direction offsets: Up, Right, Down, Left
const DIRS = [
  { dr: -1, dc: 0, name: 'up' },
  { dr: 0, dc: 1, name: 'right' },
  { dr: 1, dc: 0, name: 'down' },
  { dr: 0, dc: -1, name: 'left' },
];

/**
 * BFS to find shortest path distance between start cell and target cell
 * ignoring edges present in wallSet
 */
function bfsDistance(gridSize, start, target, wallSet) {
  const queue = [{ r: start.r, c: start.c, dist: 0 }];
  const visited = new Set([`${start.r},${start.c}`]);

  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr.r === target.r && curr.c === target.c) {
      return curr.dist;
    }

    for (const d of DIRS) {
      const nr = curr.r + d.dr;
      const nc = curr.c + d.dc;

      if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
        const posKey = `${nr},${nc}`;
        const eKey = edgeKey(curr.r, curr.c, nr, nc);

        if (!visited.has(posKey) && !wallSet.has(eKey)) {
          visited.add(posKey);
          queue.push({ r: nr, c: nc, dist: curr.dist + 1 });
        }
      }
    }
  }

  return -1; // Unreachable
}

/**
 * Generates a single maze level
 */
export function generateMazeLevel(levelIndex) {
  let gridSize = 4;
  let difficulty = 'easy';
  let targetWallCount = 4;

  if (levelIndex <= 5) {
    gridSize = 4;
    difficulty = 'easy';
    targetWallCount = getRandomInt(4, 6);
  } else if (levelIndex <= 12) {
    gridSize = 5;
    difficulty = 'medium';
    targetWallCount = getRandomInt(8, 12);
  } else if (levelIndex <= 19) {
    gridSize = 6;
    difficulty = 'hard';
    targetWallCount = getRandomInt(14, 20);
  } else {
    gridSize = 7;
    difficulty = 'very_hard';
    targetWallCount = getRandomInt(22, 30);
  }

  // Setup Start, Key, Door with good separation
  const start = { r: 0, c: 0 };
  
  let key = { r: getRandomInt(1, gridSize - 1), c: getRandomInt(1, gridSize - 1) };
  while (key.r === start.r && key.c === start.c) {
    key = { r: getRandomInt(1, gridSize - 1), c: getRandomInt(1, gridSize - 1) };
  }

  let door = { r: gridSize - 1, c: gridSize - 1 };
  while ((door.r === key.r && door.c === key.c) || (door.r === start.r && door.c === start.c)) {
    door = { r: getRandomInt(0, gridSize - 1), c: getRandomInt(0, gridSize - 1) };
  }

  // Generate all possible interior edges
  const allEdges = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Right edge
      if (c + 1 < gridSize) {
        allEdges.push({ r1: r, c1: c, r2: r, c2: c + 1, direction: 'right' });
      }
      // Down edge
      if (r + 1 < gridSize) {
        allEdges.push({ r1: r, c1: c, r2: r + 1, c2: c, direction: 'down' });
      }
    }
  }

  // Shuffle edges randomly
  for (let i = allEdges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allEdges[i], allEdges[j]] = [allEdges[j], allEdges[i]];
  }

  // Incrementally place hidden walls while maintaining BFS solvability
  const wallSet = new Set();
  const hiddenWalls = [];

  for (const edge of allEdges) {
    if (hiddenWalls.length >= targetWallCount) break;

    const eKey = edgeKey(edge.r1, edge.c1, edge.r2, edge.c2);
    wallSet.add(eKey);

    // Test if S -> K and K -> D are both still solvable with reasonable distance
    const distSK = bfsDistance(gridSize, start, key, wallSet);
    const distKD = bfsDistance(gridSize, key, door, wallSet);

    if (distSK > 0 && distKD > 0) {
      // Valid wall placement! Keep it.
      hiddenWalls.push({
        r1: edge.r1,
        c1: edge.c1,
        r2: edge.r2,
        c2: edge.c2,
        direction: edge.direction,
        key: eKey,
      });
    } else {
      // Rollback wall
      wallSet.delete(eKey);
    }
  }

  const optSK = bfsDistance(gridSize, start, key, wallSet);
  const optKD = bfsDistance(gridSize, key, door, wallSet);
  const optimalMoves = optSK + optKD;

  return {
    id: `maze-${String(levelIndex).padStart(2, '0')}`,
    levelNumber: levelIndex,
    gameType: 'maze',
    difficulty,
    gridSize,
    start,
    key,
    door,
    hiddenWalls,
    optimalMoves,
    timeLimit: 180, // 3 minutes
  };
}

/**
 * Generates all 25 levels for Game 2 (Invisible Maze)
 */
export function generateAllMazeLevels() {
  const levels = [];
  for (let i = 1; i <= 25; i++) {
    levels.push(generateMazeLevel(i));
  }
  return levels;
}
