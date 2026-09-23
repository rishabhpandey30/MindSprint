import styles from './Badge.module.css';

/**
 * Badge component
 * @param {'default'|'primary'|'success'|'warning'|'danger'} variant
 */
export function Badge({ children, variant = 'default', size = 'md' }) {
  return (
    <span className={[styles.badge, styles[variant], styles[size]].join(' ')}>
      {children}
    </span>
  );
}

export default Badge;
