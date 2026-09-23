/**
 * MindSprint Game Assessment Configuration
 * Centralized settings for the 3 cognitive games and their independent per-level timers.
 */

export const GAME_CONFIG = {
  bubbles: {
    id: 'bubbles',
    index: 0,
    title: 'Select Bubbles',
    subtitle: 'Ascending Order Mental Math',
    description: 'Solve the 3 expressions mentally and select the bubbles in ascending order (smallest to largest).',
    levelsCount: 25,
    levelTime: 15, // 15 seconds per level
    displayFormat: 'SS',
    cognitiveSkill: 'Numerical Processing',
  },
  maze: {
    id: 'maze',
    index: 1,
    title: 'Invisible Maze',
    subtitle: 'Hidden Wall Navigation',
    description: 'Navigate through the invisible maze. Hit walls to discover them. Collect the Key and reach the Door.',
    levelsCount: 25,
    levelTime: 180, // 3 minutes (180 seconds) per level
    displayFormat: 'MM:SS',
    cognitiveSkill: 'Spatial Navigation',
  },
  pathfinder: {
    id: 'pathfinder',
    index: 2,
    title: 'Pathfinder',
    subtitle: 'Path Tile Arrangement',
    description: 'Click and swap scrambled tiles to construct a continuous connected path from Start to End.',
    levelsCount: 25,
    levelTime: 240, // 4 minutes (240 seconds) per level
    displayFormat: 'MM:SS',
    cognitiveSkill: 'Spatial Arrangement',
  },
};

export const GAME_ORDER = ['bubbles', 'maze', 'pathfinder'];

export const TOTAL_LEVELS = 75;
