import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './InvisibleMaze.module.css';

export default function DPad({ onMove, disabled }) {
  return (
    <div className={styles.dpadContainer} role="group" aria-label="Directional controls">
      <button
        type="button"
        className={`${styles.dpadBtn} ${styles.dpadUp}`}
        onClick={() => onMove('up')}
        disabled={disabled}
        aria-label="Move Up"
      >
        <ArrowUp size={20} />
      </button>

      <div className={styles.dpadMiddleRow}>
        <button
          type="button"
          className={`${styles.dpadBtn} ${styles.dpadLeft}`}
          onClick={() => onMove('left')}
          disabled={disabled}
          aria-label="Move Left"
        >
          <ArrowLeft size={20} />
        </button>

        <div className={styles.dpadCenter}></div>

        <button
          type="button"
          className={`${styles.dpadBtn} ${styles.dpadRight}`}
          onClick={() => onMove('right')}
          disabled={disabled}
          aria-label="Move Right"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <button
        type="button"
        className={`${styles.dpadBtn} ${styles.dpadDown}`}
        onClick={() => onMove('down')}
        disabled={disabled}
        aria-label="Move Down"
      >
        <ArrowDown size={20} />
      </button>
    </div>
  );
}
