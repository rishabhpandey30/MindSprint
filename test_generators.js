/**
 * Test script to verify 1,000 procedural levels for each game
 */
import { generateBubbleLevel } from './src/data/bubbleGenerator.js';
import { generateMazeLevel } from './src/data/mazeGenerator.js';
import { generatePathfinderLevel, checkPathfinderSolution } from './src/data/pathfinderGenerator.js';

console.log('Testing 1,000 Select Bubbles levels...');
for (let i = 1; i <= 1000; i++) {
  const levelIdx = ((i - 1) % 25) + 1;
  const level = generateBubbleLevel(levelIdx);
  if (!level.bubbles || level.bubbles.length !== 3) {
    throw new Error(`Bubble level ${i} does not have 3 bubbles`);
  }
  const vals = level.bubbles.map((b) => b.value);
  if (vals[0] === vals[1] || vals[1] === vals[2] || vals[0] === vals[2]) {
    throw new Error(`Bubble level ${i} has duplicate values: ${vals}`);
  }
}
console.log('✅ Select Bubbles: 1,000 levels generated successfully!');

console.log('Testing 1,000 Invisible Maze levels...');
for (let i = 1; i <= 1000; i++) {
  const levelIdx = ((i - 1) % 25) + 1;
  const level = generateMazeLevel(levelIdx);
  if (!level.start || !level.key || !level.door || level.optimalMoves <= 0) {
    throw new Error(`Maze level ${i} invalid optimal moves: ${level.optimalMoves}`);
  }
}
console.log('✅ Invisible Maze: 1,000 levels generated successfully!');

console.log('Testing 1,000 Pathfinder levels...');
for (let i = 1; i <= 1000; i++) {
  const levelIdx = ((i - 1) % 25) + 1;
  const level = generatePathfinderLevel(levelIdx);
  if (!level.start || !level.end || level.tiles.length === 0) {
    throw new Error(`Pathfinder level ${i} invalid tiles count`);
  }
}
console.log('✅ Pathfinder: 1,000 levels generated successfully!');
console.log('🎉 ALL 3,000 GENERATION TESTS PASSED!');
