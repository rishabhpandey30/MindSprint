/**
 * useKeyboardControls — handles assessment keyboard shortcuts
 */

import { useEffect } from 'react';

/**
 * @param {Object} handlers - Map of key to handler function
 * @param {boolean} enabled - Whether shortcuts are active
 */
export function useKeyboardControls(handlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Don't fire on inputs/textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key;

      // Digit keys 1-4 for answer selection
      if (['1', '2', '3', '4'].includes(key) && handlers.onSelectOption) {
        e.preventDefault();
        handlers.onSelectOption(parseInt(key) - 1);
        return;
      }

      // Navigation
      if ((key === 'n' || key === 'N') && handlers.onNext) {
        e.preventDefault();
        handlers.onNext();
        return;
      }

      if ((key === 'b' || key === 'B') && handlers.onBack) {
        e.preventDefault();
        handlers.onBack();
        return;
      }

      if (key === 'Enter' && handlers.onConfirm) {
        e.preventDefault();
        handlers.onConfirm();
        return;
      }

      if ((key === 'm' || key === 'M') && handlers.onMark) {
        e.preventDefault();
        handlers.onMark();
        return;
      }

      if (key === 'Escape' && handlers.onEscape) {
        e.preventDefault();
        handlers.onEscape();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}

/**
 * useGridKeyboardControls — handles arrow key / WASD movement for grid games
 */
export function useGridKeyboardControls(onMove, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const directionMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
      };

      const dir = directionMap[e.key];
      if (dir) {
        e.preventDefault(); // Prevent page scroll
        onMove(dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove, enabled]);
}
