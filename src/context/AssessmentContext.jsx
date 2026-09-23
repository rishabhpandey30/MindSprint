/**
 * MindSprint Assessment State Management
 * Supports independent game selection (Bubbles, Maze, Pathfinder),
 * independent per-level countdown timers, safe game exit/resume, and combined results.
 */

import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { generateFreshAssessment } from '../data/questionGenerators.js';
import { calculateGameResults } from '../utils/scoring.js';
import { GAME_CONFIG, GAME_ORDER } from '../config/gameConfig.js';

const STORAGE_KEY = 'mindsprint_assessment_session';
const HISTORY_KEY = 'mindsprint_history';

const AssessmentContext = createContext(null);

const initialState = {
  assessmentId: null,
  games: null,
  selectedGameKey: null, // 'bubbles' | 'maze' | 'pathfinder' | null
  currentLevelIndex: 0, // 0..24 for the active game
  phase: 'GAME_SELECTION', // 'GAME_SELECTION' | 'PLAYING' | 'GAME_SUMMARY' | 'ALL_RESULTS'
  levelRecords: [], // array of all completed records across games
  remainingLevelTime: 15,
  levelStartTime: null,
  isStarted: false,
  isCompleted: false,
  results: null,
  attemptHistory: [],
};

function assessmentReducer(state, action) {
  switch (action.type) {
    case 'INIT_ASSESSMENT': {
      const assessmentData = action.payload;
      return {
        ...state,
        assessmentId: assessmentData.assessmentId,
        games: assessmentData.games,
        selectedGameKey: null,
        currentLevelIndex: 0,
        phase: 'GAME_SELECTION',
        levelRecords: [],
        remainingLevelTime: 15,
        levelStartTime: null,
        isStarted: true,
        isCompleted: false,
        results: null,
      };
    }

    case 'RESTORE_SESSION': {
      return {
        ...state,
        ...action.payload,
        levelStartTime: action.payload.phase === 'PLAYING' ? Date.now() : null,
      };
    }

    case 'SELECT_GAME': {
      const { gameKey } = action.payload;
      const gameConfig = GAME_CONFIG[gameKey];
      if (!gameConfig) return state;

      // Find how many levels already completed for this game
      const completedGameRecords = state.levelRecords.filter((r) => r.gameType === gameKey);
      const nextLevelIndex = Math.min(24, completedGameRecords.length);

      return {
        ...state,
        selectedGameKey: gameKey,
        currentLevelIndex: nextLevelIndex,
        phase: 'PLAYING',
        remainingLevelTime: gameConfig.levelTime,
        levelStartTime: Date.now(),
      };
    }

    case 'TICK_LEVEL_TIMER': {
      if (state.phase !== 'PLAYING' || state.remainingLevelTime <= 0) return state;
      return {
        ...state,
        remainingLevelTime: Math.max(0, state.remainingLevelTime - 1),
      };
    }

    case 'COMPLETE_LEVEL': {
      const { record } = action.payload;
      const nextRecords = [...state.levelRecords, record];
      const currentGameKey = state.selectedGameKey;

      // Check if this was the last level (24) of the current selected game
      if (state.currentLevelIndex >= 24) {
        // Current game is finished!
        const results = calculateGameResults(nextRecords);
        return {
          ...state,
          levelRecords: nextRecords,
          phase: 'GAME_SUMMARY',
          results,
        };
      }

      // Move to next level in the current game
      const nextLevelIdx = state.currentLevelIndex + 1;
      const nextGameTime = GAME_CONFIG[currentGameKey].levelTime;

      return {
        ...state,
        levelRecords: nextRecords,
        currentLevelIndex: nextLevelIdx,
        remainingLevelTime: nextGameTime,
        levelStartTime: Date.now(),
      };
    }

    case 'END_CURRENT_GAME': {
      // Returns to game selection screen while keeping all completed level records
      const results = calculateGameResults(state.levelRecords);
      return {
        ...state,
        phase: 'GAME_SELECTION',
        selectedGameKey: null,
        results,
      };
    }

    case 'RETURN_TO_SELECTION': {
      return {
        ...state,
        phase: 'GAME_SELECTION',
        selectedGameKey: null,
      };
    }

    case 'FINISH_ASSESSMENT': {
      const results = calculateGameResults(state.levelRecords);
      return {
        ...state,
        phase: 'ALL_RESULTS',
        isCompleted: true,
        results,
      };
    }

    case 'ABANDON_ASSESSMENT': {
      return {
        ...initialState,
        attemptHistory: state.attemptHistory,
      };
    }

    case 'SET_ATTEMPT_HISTORY': {
      return {
        ...state,
        attemptHistory: action.payload,
      };
    }

    default:
      return state;
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);
  const timerRef = useRef(null);

  // Load history and active session on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        dispatch({ type: 'SET_ATTEMPT_HISTORY', payload: JSON.parse(savedHistory) });
      }

      const savedSession = sessionStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.isStarted) {
          dispatch({ type: 'RESTORE_SESSION', payload: parsed });
        }
      }
    } catch (e) {
      console.error('Failed to load session from storage:', e);
    }
  }, []);

  // Save active session to sessionStorage
  useEffect(() => {
    if (state.isStarted && !state.isCompleted) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save session:', e);
      }
    } else if (state.isCompleted) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  // Save completed attempt to history
  useEffect(() => {
    if (state.isCompleted && state.results) {
      try {
        const historyItem = {
          assessmentId: state.assessmentId,
          date: new Date().toISOString(),
          overall: state.results.overall,
          bubbles: state.results.bubbles,
          maze: state.results.maze,
          pathfinder: state.results.pathfinder,
          skills: state.results.skills,
        };

        const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const updated = [historyItem, ...existing].slice(0, 50);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        dispatch({ type: 'SET_ATTEMPT_HISTORY', payload: updated });
      } catch (e) {
        console.error('Failed to save attempt history:', e);
      }
    }
  }, [state.isCompleted, state.results, state.assessmentId]);

  // Independent level countdown timer
  useEffect(() => {
    if (state.phase === 'PLAYING' && state.remainingLevelTime > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_LEVEL_TIMER' });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase, state.remainingLevelTime]);

  // Handle level timeout when timer reaches 0
  useEffect(() => {
    if (state.phase === 'PLAYING' && state.remainingLevelTime === 0 && state.games && state.selectedGameKey) {
      const currentGame = state.games[state.selectedGameKey];
      const currentLevel = currentGame?.levels[state.currentLevelIndex];
      const timeLimit = GAME_CONFIG[state.selectedGameKey].levelTime;

      if (currentLevel) {
        const timeoutRecord = {
          levelId: currentLevel.id,
          gameType: state.selectedGameKey,
          difficulty: currentLevel.difficulty,
          timeLimit,
          timeSpent: timeLimit,
          completed: false,
          timedOut: true,
          correct: false,
          moves: 0,
          collisions: 0,
          swaps: 0,
          efficiency: 0,
        };

        dispatch({ type: 'COMPLETE_LEVEL', payload: { record: timeoutRecord } });
      }
    }
  }, [state.phase, state.remainingLevelTime, state.games, state.selectedGameKey, state.currentLevelIndex]);

  // Actions
  const startAssessment = useCallback(() => {
    const assessmentData = generateFreshAssessment();
    dispatch({ type: 'INIT_ASSESSMENT', payload: assessmentData });
  }, []);

  const selectGame = useCallback((gameKey) => {
    dispatch({ type: 'SELECT_GAME', payload: { gameKey } });
  }, []);

  const completeLevel = useCallback((record) => {
    dispatch({ type: 'COMPLETE_LEVEL', payload: { record } });
  }, []);

  const endCurrentGame = useCallback(() => {
    dispatch({ type: 'END_CURRENT_GAME' });
  }, []);

  const returnToSelection = useCallback(() => {
    dispatch({ type: 'RETURN_TO_SELECTION' });
  }, []);

  const finishAssessment = useCallback(() => {
    dispatch({ type: 'FINISH_ASSESSMENT' });
  }, []);

  const abandonAssessment = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'ABANDON_ASSESSMENT' });
  }, []);

  const value = {
    ...state,
    startAssessment,
    selectGame,
    completeLevel,
    endCurrentGame,
    returnToSelection,
    finishAssessment,
    abandonAssessment,
    getSavedAssessment: () => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    },
    clearAssessment: abandonAssessment,
    state, // Backwards compatibility for state property
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}

export const useAssessmentContext = useAssessment;
