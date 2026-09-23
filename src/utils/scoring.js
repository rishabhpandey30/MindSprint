/**
 * MindSprint Scoring and Analytics Engine
 * Calculates comprehensive metrics for the 3 game modules and overall assessment.
 */

export function calculateGameResults(levelRecords) {
  const records = Array.isArray(levelRecords) ? levelRecords : Object.values(levelRecords);

  const bubbleRecords = records.filter((r) => r.gameType === 'bubbles');
  const mazeRecords = records.filter((r) => r.gameType === 'maze');
  const pathRecords = records.filter((r) => r.gameType === 'pathfinder');

  const avg = (arr) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  // --- Select Bubbles Metrics ---
  const bubbleSolved = bubbleRecords.filter((r) => r.correct).length;
  const bubbleTotal = Math.max(bubbleRecords.length, 25);
  const bubbleTimes = bubbleRecords.map((r) => r.timeSpent || 0);
  const bubbleAvgTime = avg(bubbleTimes);
  const bubbleFastest = bubbleTimes.length > 0 ? Math.min(...bubbleTimes) : 0;
  const bubbleSlowest = bubbleTimes.length > 0 ? Math.max(...bubbleTimes) : 0;
  const bubbleAccuracy = Math.round((bubbleSolved / bubbleTotal) * 100);

  // --- Invisible Maze Metrics ---
  const mazeSolved = mazeRecords.filter((r) => r.correct && r.completed).length;
  const mazeTotal = Math.max(mazeRecords.length, 25);
  const mazeCollisions = mazeRecords.reduce((sum, r) => sum + (r.collisions || 0), 0);
  const mazeMoves = mazeRecords.map((r) => r.moves || 0);
  const mazeEfficiencies = mazeRecords.map((r) => r.efficiency || (r.correct ? 100 : 0));
  const mazeAvgEfficiency = Math.round(avg(mazeEfficiencies)) || (mazeSolved > 0 ? 80 : 0);
  const mazeAvgMoves = Math.round(avg(mazeMoves));

  // --- Pathfinder Metrics ---
  const pathSolved = pathRecords.filter((r) => r.correct && r.completed).length;
  const pathTotal = Math.max(pathRecords.length, 25);
  const pathSwaps = pathRecords.map((r) => r.swaps || 0);
  const pathTimes = pathRecords.map((r) => r.timeSpent || 0);
  const pathAvgSwaps = Math.round(avg(pathSwaps));
  const pathAvgTime = Math.round(avg(pathTimes));
  const pathEfficiencies = pathRecords.map((r) => r.efficiency || (r.correct ? 100 : 0));
  const pathAvgEfficiency = Math.round(avg(pathEfficiencies)) || (pathSolved > 0 ? 80 : 0);

  // --- Overall Totals ---
  const totalSolved = bubbleSolved + mazeSolved + pathSolved;
  const totalQuestions = 75;
  const overallAccuracy = Math.round((totalSolved / totalQuestions) * 100);
  const totalTimeSpent = records.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

  // --- Cognitive Skill Indicators (0-100 scale) ---
  const numericalScore = Math.min(100, Math.round(bubbleAccuracy * 0.7 + (15 - Math.min(15, bubbleAvgTime)) * 2));
  const spatialNavScore = Math.min(100, Math.round((mazeSolved / 25) * 60 + mazeAvgEfficiency * 0.4));
  const spatialArrScore = Math.min(100, Math.round((pathSolved / 25) * 60 + pathAvgEfficiency * 0.4));
  const planningScore = Math.min(100, Math.round((mazeAvgEfficiency + pathAvgEfficiency) / 2));

  const skills = [
    {
      id: 'numerical',
      name: 'Numerical Processing',
      score: numericalScore,
      description: 'Speed and accuracy in solving multi-step mental arithmetic and ordering values.',
    },
    {
      id: 'spatial_nav',
      name: 'Spatial Navigation',
      score: spatialNavScore,
      description: 'Route optimization, obstacle memory, and cognitive mapping in unseen environments.',
    },
    {
      id: 'spatial_arr',
      name: 'Spatial Arrangement',
      score: spatialArrScore,
      description: 'Mental rotation, pattern visualization, and tile path configuration.',
    },
    {
      id: 'planning',
      name: 'Planning Efficiency',
      score: planningScore,
      description: 'Deliberate decision-making and optimal move execution under time constraints.',
    },
  ];

  return {
    overall: {
      totalSolved,
      totalQuestions,
      accuracy: overallAccuracy,
      totalTimeSpent,
    },
    bubbles: {
      solved: bubbleSolved,
      total: 25,
      accuracy: bubbleAccuracy,
      avgResponseTime: Math.round(bubbleAvgTime * 10) / 10,
      fastest: bubbleFastest,
      slowest: bubbleSlowest,
    },
    maze: {
      solved: mazeSolved,
      total: 25,
      accuracy: Math.round((mazeSolved / 25) * 100),
      avgEfficiency: mazeAvgEfficiency,
      totalCollisions: mazeCollisions,
      avgMoves: mazeAvgMoves,
    },
    pathfinder: {
      solved: pathSolved,
      total: 25,
      accuracy: Math.round((pathSolved / 25) * 100),
      avgSwaps: pathAvgSwaps,
      avgSolveTime: pathAvgTime,
      avgEfficiency: pathAvgEfficiency,
    },
    skills,
    records,
  };
}

export function aggregateAttemptStats(attemptHistory = []) {
  if (!attemptHistory || attemptHistory.length === 0) {
    return {
      bestScore: 0,
      averageAccuracy: 0,
      totalAttempts: 0,
      totalQuestionsCompleted: 0,
    };
  }

  const scores = attemptHistory.map((a) => a.overall?.accuracy ?? a.score ?? a.accuracy ?? 0);
  const bestScore = Math.max(...scores);
  const averageAccuracy = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const totalQuestionsCompleted = attemptHistory.reduce(
    (sum, a) => sum + (a.overall?.totalSolved ?? a.results?.correct ?? 0),
    0
  );

  return {
    bestScore,
    averageAccuracy,
    totalAttempts: attemptHistory.length,
    totalQuestionsCompleted,
  };
}

export const calculateResults = calculateGameResults;
export const calculateSkillIndicators = (results) => results?.skills || [];
export const generateRecommendations = (results) => [
  'Focus on speed during Select Bubbles to maximize calculation throughput.',
  'Explore outer perimeter paths in Invisible Maze before cutting through center cells.',
  'Look for corner anchors when rearranging Pathfinder track tiles.',
];
