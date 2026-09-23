import React from 'react';
import styles from './SelectBubbles.module.css';

export default function Bubble({ bubble, selectionOrder, onClick, disabled, isEvaluated, isCorrect }) {
  const isSelected = selectionOrder !== null;

  let stateClass = '';
  if (isEvaluated) {
    stateClass = isCorrect ? styles.evaluatedCorrect : styles.evaluatedIncorrect;
  } else if (isSelected) {
    stateClass = styles.selected;
  }

  return (
    <button
      type="button"
      className={`${styles.bubble} ${stateClass}`}
      onClick={() => !disabled && onClick(bubble.id)}
      disabled={disabled}
      aria-label={`Bubble ${bubble.id}: ${bubble.expression}`}
    >
      <div className={styles.bubbleHeader}>
        <span className={styles.bubbleLetter}>{bubble.id}</span>
        {isSelected && (
          <div className={styles.orderBadge}>
            <span>{selectionOrder}</span>
          </div>
        )}
      </div>
      <div className={styles.expressionContainer}>
        <span className={styles.expression}>{bubble.expression}</span>
      </div>
      <div className={styles.bubbleHint}>
        {isSelected ? `Selected #${selectionOrder}` : 'Click to select'}
      </div>
    </button>
  );
}
