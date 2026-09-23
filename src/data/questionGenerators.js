/**
 * Assessment Level Coordinator
 * Generates the full 75-level session across the 3 distinct game modules:
 * 1. Select Bubbles (25 levels)
 * 2. Invisible Maze (25 levels)
 * 3. Pathfinder (25 levels)
 */

import { generateAllBubbleLevels } from './bubbleGenerator.js';
import { generateAllMazeLevels } from './mazeGenerator.js';
import { generateAllPathfinderLevels } from './pathfinderGenerator.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export function generateFreshAssessment() {
  const assessmentId = `mindsprint_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const bubbleLevels = generateAllBubbleLevels();
  const mazeLevels = generateAllMazeLevels();
  const pathfinderLevels = generateAllPathfinderLevels();

  return {
    assessmentId,
    createdAt: new Date().toISOString(),
    games: {
      bubbles: {
        ...GAME_CONFIG.bubbles,
        levels: bubbleLevels,
      },
      maze: {
        ...GAME_CONFIG.maze,
        levels: mazeLevels,
      },
      pathfinder: {
        ...GAME_CONFIG.pathfinder,
        levels: pathfinderLevels,
      },
    },
    totalLevels: 75,
  };
}
