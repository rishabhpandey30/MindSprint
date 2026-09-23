/**
 * Formatting utilities
 */

/** Format seconds as MM:SS */
export function formatTime(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Format seconds as "Xm Ys" */
export function formatDuration(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

/** Format a Date as "Sep 23, 2026" */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/** Format a Date as "Sep 23, 2026 · 11:45 PM" */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

/** Returns "1st", "2nd", "3rd" ordinals */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Pads number with leading zero: 1 → "01" */
export function padNumber(n) {
  return String(n).padStart(2, '0');
}

/** Returns human-readable game type name */
export function formatGameType(type) {
  const map = {
    arithmetic: 'Fast Arithmetic',
    pathfinding: 'Path Finding',
    gridcollection: 'Grid Collection',
  };
  return map[type] || type;
}

/** Returns difficulty label */
export function formatDifficulty(difficulty) {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

/** Clamp number between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
