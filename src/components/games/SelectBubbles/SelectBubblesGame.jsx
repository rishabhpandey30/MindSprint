import React, { useState, useEffect, useRef, useCallback } from 'react';
import Bubble from './Bubble.jsx';
import styles from './SelectBubbles.module.css';

export default function SelectBubblesGame({ levelData, onLevelComplete, levelStartTime }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null); // { correct: boolean }
  const hasFinishedRef = useRef(false);

  // Reset state when level changes
  useEffect(() => {
    setSelectedIds([]);
    setIsSubmitting(false);
    setEvaluation(null);
    hasFinishedRef.current = false;
  }, [levelData.id]);

  const handleBubbleClick = useCallback((bubbleId) => {
    if (isSubmitting || hasFinishedRef.current) return;

    setSelectedIds((prev) => {
      // If already selected, remove it
      if (prev.includes(bubbleId)) {
        return prev.filter((id) => id !== bubbleId);
      }
      // Add to selection
      const nextSelection = [...prev, bubbleId];

      // If all 3 selected, trigger auto-submit
      if (nextSelection.length === 3) {
        setIsSubmitting(true);
        hasFinishedRef.current = true;

        // Check if correct order
        const isCorrect = nextSelection.every((id, idx) => id === levelData.correctOrder[idx]);
        setEvaluation({ correct: isCorrect });

        const timeSpent = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));

        // Short feedback delay before auto-advancing
        setTimeout(() => {
          onLevelComplete({
            levelId: levelData.id,
            gameType: 'bubbles',
            difficulty: levelData.difficulty,
            timeLimit: levelData.timeLimit || 15,
            timeSpent: Math.min(timeSpent, 15),
            completed: true,
            timedOut: false,
            correct: isCorrect,
            selectedOrder: nextSelection,
            correctOrder: levelData.correctOrder,
          });
        }, 400);
      }

      return nextSelection;
    });
  }, [isSubmitting, levelData, levelStartTime, onLevelComplete]);

  // Keyboard support: keys 1, 2, 3 or A, B, C
  useEffect(() => {
    function handleKeyDown(e) {
      if (isSubmitting || hasFinishedRef.current) return;
      const key = e.key.toUpperCase();
      if (key === '1' || key === 'A') handleBubbleClick('A');
      else if (key === '2' || key === 'B') handleBubbleClick('B');
      else if (key === '3' || key === 'C') handleBubbleClick('C');
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBubbleClick, isSubmitting]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.instructionBanner}>
        <span className={styles.instructionText}>
          Select bubbles in <strong>ASCENDING ORDER</strong> (Smallest → Largest)
        </span>
      </div>

      <div className={styles.bubblesGrid}>
        {levelData.bubbles.map((bubble) => {
          const selIdx = selectedIds.indexOf(bubble.id);
          const orderNum = selIdx !== -1 ? selIdx + 1 : null;

          return (
            <Bubble
              key={bubble.id}
              bubble={bubble}
              selectionOrder={orderNum}
              onClick={handleBubbleClick}
              disabled={isSubmitting}
              isEvaluated={Boolean(evaluation)}
              isCorrect={evaluation?.correct}
            />
          );
        })}
      </div>

      <div className={styles.footerInfo}>
        <div className={styles.selectionProgress}>
          <span>Selected: {selectedIds.length} / 3</span>
          {selectedIds.length > 0 && (
            <span className={styles.currentOrderBadge}>
              Order: {selectedIds.join(' → ')}
            </span>
          )}
        </div>
        <div className={styles.keyboardHint}>
          Press <strong>1, 2, 3</strong> or <strong>A, B, C</strong> to select quickly
        </div>
      </div>
    </div>
  );
}
