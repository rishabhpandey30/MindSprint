import styles from './AssessmentHeader.module.css';
import { formatTime } from '../../utils/formatting.js';
import { formatGameType } from '../../utils/formatting.js';

export function AssessmentHeader({ question, questionIndex, totalQuestions, remainingTime, totalTime }) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const isWarning = remainingTime <= 120 && remainingTime > 30;
  const isCritical = remainingTime <= 30;

  const timerClass = [
    styles.timer,
    isWarning ? styles.timerWarning : '',
    isCritical ? styles.timerCritical : '',
  ].filter(Boolean).join(' ');

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#4F46E5"/>
            <path d="M8 22L13 10L18 18L21 14L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>MindSprint</span>
        </div>

        <div className={styles.gameLabel}>
          {question ? formatGameType(question.type) : '—'}
        </div>

        <div className={timerClass} aria-label={`Time remaining: ${formatTime(remainingTime)}`} aria-live="polite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className={isCritical ? styles.timerPulse : ''}>{formatTime(remainingTime)}</span>
        </div>
      </div>

      <div className={styles.progressRow}>
        <div className={styles.questionCount}>
          Question <strong>{String(questionIndex + 1).padStart(2, '0')}</strong> / {String(totalQuestions).padStart(2, '0')}
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  );
}
