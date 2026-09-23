import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import styles from './LevelTimer.module.css';

export default function LevelTimer({ remainingSeconds, totalSeconds }) {
  const percentage = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;

  // Determine state
  let timerState = styles.normal;
  if (percentage <= 10) {
    timerState = styles.critical;
  } else if (percentage <= 25) {
    timerState = styles.warning;
  }

  // Format time display
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className={`${styles.timerContainer} ${timerState}`} role="timer" aria-live="polite">
      <div className={styles.timerIconWrapper}>
        {percentage <= 10 ? (
          <AlertTriangle className={styles.icon} size={18} />
        ) : (
          <Timer className={styles.icon} size={18} />
        )}
      </div>
      <div className={styles.timerContent}>
        <span className={styles.timerLabel}>TIME LEFT</span>
        <span className={styles.timerDigits}>{formattedTime}</span>
      </div>
    </div>
  );
}
