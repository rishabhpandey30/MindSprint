import styles from './Button.module.css';

/**
 * Button component
 * @param {'primary'|'secondary'|'ghost'|'danger'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export default Button;
