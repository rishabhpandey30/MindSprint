/**
 * Random number and array utilities
 */

/** Returns a random integer between min (inclusive) and max (inclusive) */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns a random float between min and max */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/** Returns a random element from an array */
export function randomFrom(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Returns a shallow-shuffled copy of an array (Fisher-Yates) */
export function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Returns n unique random integers from [min, max] */
export function randomUniqueInts(n, min, max) {
  if (n > max - min + 1) throw new Error('Range too small for n unique values');
  const pool = [];
  for (let i = min; i <= max; i++) pool.push(i);
  return shuffle(pool).slice(0, n);
}

/** Generates a short unique ID with an optional prefix */
export function generateId(prefix = 'q') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Seeded pseudo-random number generator (simple LCG) */
export function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
