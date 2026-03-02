import { Game } from '../../../src/server/Game';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { ALL_GOAL_TILES } from '../../../src/server/goals/GoalRegistry';
import { GameId } from '../../../src/common/Types';

describe('End-of-round goals', () => {
  it('reveals 4 round goals at game start', () => {
    const game = new Game('g1' as GameId, ['Alice', 'Bob'], 42);

    const view = game.toViewModel();

    expect(view.roundGoals).toHaveLength(4);
    expect(view.roundGoals.every(goal => goal.scores.length === 0)).toBe(true);
  });

  it('scores current round goal and locks points at round end', () => {
    const game = new Game('g2' as GameId, ['Alice', 'Bob'], 42);
    const birdsInForest = ALL_GOAL_TILES.find(g => g.id === 'birds_in_forest');
    expect(birdsInForest).toBeDefined();

    (game as any).roundGoalTiles = [birdsInForest, birdsInForest, birdsInForest, birdsInForest];
    game.startRound(); // round 1

    const p1 = game.players[0];
    const p2 = game.players[1];

    p1.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p1.board.placeBird(HabitatType.FOREST, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p2.board.placeBird(HabitatType.FOREST, { name: 'b3', eggs: 0, cachedFood: 0, tuckedCards: 0 });

    game.endRound();

    expect(p1.roundGoalPoints[0]).toBe(4);
    expect(p2.roundGoalPoints[0]).toBe(1);

    const view = game.toViewModel();
    expect(view.roundGoals[0].scores).toEqual([
      { playerId: p1.id, points: 4 },
      { playerId: p2.id, points: 1 },
    ]);
    expect(view.roundGoals[1].scores).toEqual([]);
  });

  it('uses round-dependent points (round 2: 5/2/1)', () => {
    const game = new Game('g3' as GameId, ['A', 'B', 'C'], 42);
    const birdsInForest = ALL_GOAL_TILES.find(g => g.id === 'birds_in_forest');
    expect(birdsInForest).toBeDefined();

    (game as any).roundGoalTiles = [birdsInForest, birdsInForest, birdsInForest, birdsInForest];

    game.startRound(); // round 1
    game.endRound();   // advance to round 2

    const p1 = game.players[0];
    const p2 = game.players[1];
    const p3 = game.players[2];

    p1.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p1.board.placeBird(HabitatType.FOREST, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p1.board.placeBird(HabitatType.FOREST, { name: 'b3', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p2.board.placeBird(HabitatType.FOREST, { name: 'b4', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p2.board.placeBird(HabitatType.FOREST, { name: 'b5', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p3.board.placeBird(HabitatType.FOREST, { name: 'b6', eggs: 0, cachedFood: 0, tuckedCards: 0 });

    game.endRound(); // end round 2

    expect(p1.roundGoalPoints[1]).toBe(5);
    expect(p2.roundGoalPoints[1]).toBe(2);
    expect(p3.roundGoalPoints[1]).toBe(1);
  });
});
