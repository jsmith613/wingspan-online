import type { Player } from '../Player';
import { HabitatType } from '../../common/game/HabitatType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { createBirdCard } from '../cards/createCard';
import { NestType } from '../../common/game/NestType';
import { END_OF_ROUND_GOAL_COUNT, TOTAL_GOAL_TILES } from '../../common/constants';
import { shuffle } from '../../common/prng';

/**
 * A goal tile evaluates player progress at the end of a round.
 */
export interface GoalTile {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** Evaluate how well a player did on this goal (higher = better). */
  evaluate(player: Player): number;
}

// =========================================================================
// All 8 goal tile implementations
// =========================================================================

const eggsInForest: GoalTile = {
  id: 'eggs_in_forest',
  name: 'Eggs in Forest',
  description: 'Most eggs on birds in your forest habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdsInHabitat(HabitatType.FOREST)
      .reduce((sum, b) => sum + b.eggs, 0);
  },
};

const birdsInGrassland: GoalTile = {
  id: 'birds_in_grassland',
  name: 'Birds in Grassland',
  description: 'Most birds in your grassland habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdCount(HabitatType.GRASSLAND);
  },
};

const birdsInWetland: GoalTile = {
  id: 'birds_in_wetland',
  name: 'Birds in Wetland',
  description: 'Most birds in your wetland habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdCount(HabitatType.WETLAND);
  },
};

const birdsInForest: GoalTile = {
  id: 'birds_in_forest',
  name: 'Birds in Forest',
  description: 'Most birds in your forest habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdCount(HabitatType.FOREST);
  },
};

const eggsInGrassland: GoalTile = {
  id: 'eggs_in_grassland',
  name: 'Eggs in Grassland',
  description: 'Most eggs on birds in your grassland habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdsInHabitat(HabitatType.GRASSLAND)
      .reduce((sum, b) => sum + b.eggs, 0);
  },
};

const eggsInWetland: GoalTile = {
  id: 'eggs_in_wetland',
  name: 'Eggs in Wetland',
  description: 'Most eggs on birds in your wetland habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdsInHabitat(HabitatType.WETLAND)
      .reduce((sum, b) => sum + b.eggs, 0);
  },
};

const totalBirds: GoalTile = {
  id: 'total_birds',
  name: 'Total Birds',
  description: 'Most total birds in your play area.',
  evaluate(player: Player): number {
    return player.board.getTotalBirdCount();
  },
};

const cachedFoodOnBirds: GoalTile = {
  id: 'cached_food',
  name: 'Cached Food',
  description: 'Most cached food on birds in your play area.',
  evaluate(player: Player): number {
    return player.board.getTotalCachedFood();
  },
};

/** All 8 goal tiles. */
export const ALL_GOAL_TILES: GoalTile[] = [
  eggsInForest,
  birdsInGrassland,
  birdsInWetland,
  birdsInForest,
  eggsInGrassland,
  eggsInWetland,
  totalBirds,
  cachedFoodOnBirds,
];

/**
 * Select 4 random goal tiles for a game.
 */
export function selectGoalTiles(rng: () => number): GoalTile[] {
  const shuffled = shuffle([...ALL_GOAL_TILES], rng);
  return shuffled.slice(0, END_OF_ROUND_GOAL_COUNT);
}

/**
 * Score a round goal for all players.
 * Players are ranked; 1st gets more points than 2nd, etc.
 * 2-player scoring: 1st=4, 2nd=1. Ties split.
 */
export function scoreRoundGoal(goal: GoalTile, players: Player[]): Map<Player, number> {
  const scores = new Map<Player, number>();

  // Evaluate each player
  const results = players.map(p => ({
    player: p,
    value: goal.evaluate(p),
  }));

  // Sort descending
  results.sort((a, b) => b.value - a.value);

  // Award points based on rank
  const pointsByRank = getPointsByRank(players.length);

  let i = 0;
  while (i < results.length) {
    // Find ties
    let tieEnd = i + 1;
    while (tieEnd < results.length && results[tieEnd].value === results[i].value) {
      tieEnd++;
    }

    // Average points across tied positions
    let totalPoints = 0;
    for (let rank = i; rank < tieEnd; rank++) {
      totalPoints += pointsByRank[rank] ?? 0;
    }
    const avgPoints = Math.floor(totalPoints / (tieEnd - i));

    for (let rank = i; rank < tieEnd; rank++) {
      scores.set(results[rank].player, results[rank].value > 0 ? avgPoints : 0);
    }

    i = tieEnd;
  }

  return scores;
}

function getPointsByRank(playerCount: number): number[] {
  switch (playerCount) {
    case 2: return [4, 1];
    case 3: return [5, 2, 1];
    case 4: return [5, 3, 2, 0];
    case 5: return [7, 4, 3, 1, 0];
    default: return [4, 1];
  }
}
