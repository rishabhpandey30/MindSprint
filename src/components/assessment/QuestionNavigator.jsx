import styles from './QuestionNavigator.module.css';
import { padNumber } from '../../utils/formatting.js';

/**
 * QuestionNavigator — visual grid of all question states
 */
export function QuestionNavigator({ questions, answers, flaggedQuestions, visitedQuestions, currentIndex, onNavigate }) {
  const getState = (q, index) => {
    if (index === currentIndex) return 'current';
    if (flaggedQuestions.has(q.id)) return 'flagged';
    if (answers[q.id]?.answer !== null && answers[q.id]?.answer !== undefined) return 'answered';
    if (visitedQuestions.has(index)) return 'visited';
    return 'unvisited';
  };

  const getLabel = (state) => {
    const map = {
      current: 'Current question',
      flagged: 'Flagged for review',
      answered: 'Answered',
      visited: 'Visited, unanswered',
      unvisited: 'Not yet visited',
    };
    return map[state] || state;
  };

  return (
    <div className={styles.container} role="navigation" aria-label="Question navigation">
      <div className={styles.grid}>
        {questions.map((q, i) => {
          const state = getState(q, i);
          return (
            <button
              key={q.id}
              className={[styles.cell, styles[state]].join(' ')}
              onClick={() => onNavigate(i)}
              aria-label={`Question ${i + 1} — ${getLabel(state)}`}
              aria-current={state === 'current' ? 'true' : undefined}
            >
              {padNumber(i + 1)}
              {state === 'flagged' && <span className={styles.flagDot} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={[styles.dot, styles.dotCurrent].join(' ')} aria-hidden="true" />
          Current
        </span>
        <span className={styles.legendItem}>
          <span className={[styles.dot, styles.dotAnswered].join(' ')} aria-hidden="true" />
          Answered
        </span>
        <span className={styles.legendItem}>
          <span className={[styles.dot, styles.dotFlagged].join(' ')} aria-hidden="true" />
          Review
        </span>
        <span className={styles.legendItem}>
          <span className={[styles.dot, styles.dotUnvisited].join(' ')} aria-hidden="true" />
          Unvisited
        </span>
      </div>
    </div>
  );
}
