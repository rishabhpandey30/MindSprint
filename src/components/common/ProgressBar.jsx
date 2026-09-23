import styles from './ProgressBar.module.css';

/**
 * ProgressBar component
 * @param {number} value - 0-100
 * @param {'primary'|'success'|'warning'|'danger'} color
 * @param {'sm'|'md'|'lg'} size
 */
export function ProgressBar({
  value,
  current,
  total,
  color = 'primary',
  size = 'md',
  showLabel = false,
  animated = false,
}) {
  const calculatedValue = value !== undefined ? value : total > 0 ? (current / total) * 100 : 0;
  const clamped = Math.min(100, Math.max(0, calculatedValue));
  return (
    <div className={styles.container} role="progressbar" aria-valuenow={Math.round(clamped)} aria-valuemin={0} aria-valuemax={100}>
      <div className={[styles.track, styles[size]].join(' ')}>
        <div
          className={[styles.fill, styles[color], animated ? styles.animated : ''].join(' ')}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className={styles.label}>{Math.round(clamped)}%</span>}
    </div>
  );
}

export default ProgressBar;
