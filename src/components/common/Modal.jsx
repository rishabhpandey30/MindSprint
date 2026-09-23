import styles from './Modal.module.css';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, footer, size = 'md', hideClose = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && onClose && !hideClose) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, hideClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={!hideClose ? onClose : undefined} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className={[styles.modal, styles[size]].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || !hideClose) && (
          <div className={styles.header}>
            {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
            {!hideClose && (
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
