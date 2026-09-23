/**
 * Select Bubbles Game Data Generator
 * Generates 25 mental math ascending order levels with 3 bubbles each.
 * All expressions are dynamically generated, accurate, and guarantee distinct numerical values.
 */

function roundValue(num) {
  // Round to at most 1 decimal place to prevent JS floating point issues
  return Math.round(num * 10) / 10;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExpression(difficulty, targetRange = null) {
  // Returns { display: string, value: number }
  const operators = ['+', '-', '×', '÷'];
  
  if (difficulty === 'easy') {
    const type = getRandomInt(1, 3);
    if (type === 1) {
      // Addition
      const a = getRandomInt(3, 20);
      const b = getRandomInt(2, 15);
      return { display: `${a} + ${b}`, value: a + b };
    } else if (type === 2) {
      // Subtraction
      const a = getRandomInt(10, 30);
      const b = getRandomInt(2, a - 2);
      return { display: `${a} − ${b}`, value: a - b };
    } else {
      // Multiplication
      const a = getRandomInt(2, 9);
      const b = getRandomInt(2, 6);
      return { display: `${a} × ${b}`, value: a * b };
    }
  }

  if (difficulty === 'medium') {
    const type = getRandomInt(1, 4);
    if (type === 1) {
      // Division
      const b = getRandomInt(3, 9);
      const quotient = getRandomInt(3, 15);
      const a = b * quotient;
      return { display: `${a} ÷ ${b}`, value: quotient };
    } else if (type === 2) {
      // Decimals Addition / Subtraction
      const a = getRandomInt(5, 25) + 0.5;
      const b = getRandomInt(1, 10) + (Math.random() > 0.5 ? 0.5 : 0);
      if (Math.random() > 0.5) {
        return { display: `${a} + ${b}`, value: roundValue(a + b) };
      } else {
        const higher = Math.max(a, b) + 5;
        return { display: `${higher} − ${b}`, value: roundValue(higher - b) };
      }
    } else if (type === 3) {
      // Multiplication + Add/Sub
      const a = getRandomInt(3, 8);
      const b = getRandomInt(2, 6);
      const c = getRandomInt(2, 12);
      if (Math.random() > 0.5) {
        return { display: `${a} × ${b} + ${c}`, value: a * b + c };
      } else {
        const prod = a * b;
        const sub = getRandomInt(1, Math.min(10, prod - 1));
        return { display: `${a} × ${b} − ${sub}`, value: prod - sub };
      }
    } else {
      // Larger multiplication or division
      const b = getRandomInt(4, 8);
      const a = b * getRandomInt(4, 12);
      const add = getRandomInt(2, 8);
      return { display: `${a} ÷ ${b} + ${add}`, value: (a / b) + add };
    }
  }

  if (difficulty === 'hard') {
    const type = getRandomInt(1, 5);
    if (type === 1) {
      // Parentheses: (a + b) × c or (a - b) × c
      const a = getRandomInt(3, 12);
      const b = getRandomInt(2, 8);
      const c = getRandomInt(2, 5);
      return { display: `(${a} + ${b}) × ${c}`, value: (a + b) * c };
    } else if (type === 2) {
      // Division with decimal result or decimals multiplication
      const a = getRandomInt(3, 9);
      const b = getRandomInt(2, 8) + 0.5;
      return { display: `${a} × ${b}`, value: roundValue(a * b) };
    } else if (type === 3) {
      // Percentage or fraction style
      const pct = [10, 20, 25, 50][getRandomInt(0, 3)];
      const base = getRandomInt(2, 10) * (100 / pct);
      const val = (pct / 100) * base;
      const add = getRandomInt(3, 15);
      return { display: `${pct}% of ${base} + ${add}`, value: roundValue(val + add) };
    } else if (type === 4) {
      // Multi-step with division
      const mult = getRandomInt(3, 7);
      const b = getRandomInt(3, 6);
      const a = b * getRandomInt(3, 8);
      const c = getRandomInt(2, 6);
      return { display: `${a} ÷ ${b} + ${mult} × ${c}`, value: (a / b) + (mult * c) };
    } else {
      // Decimals multi-op
      const a = getRandomInt(10, 30) + 0.5;
      const b = getRandomInt(4, 12);
      const c = getRandomInt(2, 6);
      return { display: `${a} − ${b} + ${c}.5`, value: roundValue(a - b + c + 0.5) };
    }
  }

  // Very Hard (Levels 20-25) - Close values, nested operations, decimals
  const type = getRandomInt(1, 4);
  if (type === 1) {
    const a = getRandomInt(20, 50);
    const b = getRandomInt(2, 8);
    const c = getRandomInt(2, 5);
    const div = getRandomInt(2, 4);
    const top = div * getRandomInt(4, 10);
    return { display: `(${a} − ${b}) ÷ ${div} + ${c}`, value: roundValue(((a - b) / div) + c) };
  } else if (type === 2) {
    const a = getRandomInt(3, 8) + 0.5;
    const b = getRandomInt(3, 7);
    const sub = getRandomInt(2, 8) + 0.5;
    return { display: `${a} × ${b} − ${sub}`, value: roundValue(a * b - sub) };
  } else if (type === 3) {
    const pct = [15, 20, 30, 40][getRandomInt(0, 3)];
    const base = getRandomInt(40, 100);
    const offset = getRandomInt(1, 9) + 0.5;
    return { display: `${pct}% of ${base} + ${offset}`, value: roundValue(((pct / 100) * base) + offset) };
  } else {
    const a = getRandomInt(30, 80);
    const b = getRandomInt(2, 6);
    const c = getRandomInt(3, 9) + 0.5;
    return { display: `${a} ÷ ${b} + ${c}`, value: roundValue((a / b) + c) };
  }
}

/**
 * Generates a single level of 3 bubbles with guaranteed distinct values
 */
export function generateBubbleLevel(levelIndex) {
  let difficulty = 'easy';
  if (levelIndex > 5 && levelIndex <= 12) difficulty = 'medium';
  else if (levelIndex > 12 && levelIndex <= 19) difficulty = 'hard';
  else if (levelIndex > 19) difficulty = 'very_hard';

  const bubbles = [];
  const usedValues = new Set();
  const bubbleIds = ['A', 'B', 'C'];

  let attempts = 0;
  while (bubbles.length < 3 && attempts < 100) {
    attempts++;
    const expr = generateExpression(difficulty);
    
    // Check if value is unique and reasonable
    if (!usedValues.has(expr.value) && !isNaN(expr.value) && isFinite(expr.value)) {
      usedValues.add(expr.value);
      bubbles.push({
        id: bubbleIds[bubbles.length],
        expression: expr.display,
        value: expr.value,
      });
    }
  }

  // If for some rare reason we didn't get 3 distinct, fill fallback
  if (bubbles.length < 3) {
    const baseVal = 10 * levelIndex;
    return {
      id: `bubble-${String(levelIndex).padStart(2, '0')}`,
      levelNumber: levelIndex,
      gameType: 'bubbles',
      difficulty,
      bubbles: [
        { id: 'A', expression: `${baseVal} + 4`, value: baseVal + 4 },
        { id: 'B', expression: `${baseVal * 2} ÷ 2 − 2`, value: baseVal - 2 },
        { id: 'C', expression: `${baseVal} + 12`, value: baseVal + 12 },
      ],
      correctOrder: ['B', 'A', 'C'],
      sortedValues: [baseVal - 2, baseVal + 4, baseVal + 12],
    };
  }

  // Calculate correct ascending order
  const sorted = [...bubbles].sort((a, b) => a.value - b.value);
  const correctOrder = sorted.map((b) => b.id);
  const sortedValues = sorted.map((b) => b.value);

  return {
    id: `bubble-${String(levelIndex).padStart(2, '0')}`,
    levelNumber: levelIndex,
    gameType: 'bubbles',
    difficulty,
    bubbles,
    correctOrder,
    sortedValues,
    timeLimit: 15,
  };
}

/**
 * Generates all 25 levels for Game 1 (Select Bubbles)
 */
export function generateAllBubbleLevels() {
  const levels = [];
  for (let i = 1; i <= 25; i++) {
    levels.push(generateBubbleLevel(i));
  }
  return levels;
}
