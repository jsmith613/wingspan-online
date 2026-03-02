import type { Player } from '../Player';
import { HabitatType } from '../../common/game/HabitatType';
import { FoodType } from '../../common/game/FoodType';
import { NestType } from '../../common/game/NestType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { createBirdCard } from '../cards/createCard';
import { END_OF_ROUND_GOAL_COUNT } from '../../common/constants';
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
// Base-game goal tile implementations (excluding NO GOAL)
// =========================================================================

const birdsInForest: GoalTile = {
  id: 'birds_in_forest',
  name: 'Birds in Forest',
  description: 'Most birds in your forest habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdCount(HabitatType.FOREST);
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

const birdsWithEggsInBowlNest: GoalTile = {
  id: 'birds_with_eggs_in_bowl_nest',
  name: 'Birds with Eggs in Bowl Nest',
  description: 'Most birds with at least 1 egg in bowl nests.',
  evaluate(player: Player): number {
    return countBirdsWithEggsInNestType(player, NestType.BOWL);
  },
};

const birdsWithEggsInCavityNest: GoalTile = {
  id: 'birds_with_eggs_in_cavity_nest',
  name: 'Birds with Eggs in Cavity Nest',
  description: 'Most birds with at least 1 egg in cavity nests.',
  evaluate(player: Player): number {
    return countBirdsWithEggsInNestType(player, NestType.CAVITY);
  },
};

const birdsWithEggsInGroundNest: GoalTile = {
  id: 'birds_with_eggs_in_ground_nest',
  name: 'Birds with Eggs in Ground Nest',
  description: 'Most birds with at least 1 egg in ground nests.',
  evaluate(player: Player): number {
    return countBirdsWithEggsInNestType(player, NestType.GROUND);
  },
};

const birdsWithEggsInPlatformNest: GoalTile = {
  id: 'birds_with_eggs_in_platform_nest',
  name: 'Birds with Eggs in Platform Nest',
  description: 'Most birds with at least 1 egg in platform nests.',
  evaluate(player: Player): number {
    return countBirdsWithEggsInNestType(player, NestType.PLATFORM);
  },
};

const eggsInForest: GoalTile = {
  id: 'eggs_in_forest',
  name: 'Eggs in Forest',
  description: 'Most eggs on birds in your forest habitat.',
  evaluate(player: Player): number {
    return player.board.getBirdsInHabitat(HabitatType.FOREST)
      .reduce((sum, b) => sum + b.eggs, 0);
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

const eggsInBowlNest: GoalTile = {
  id: 'eggs_in_bowl_nest',
  name: 'Eggs in Bowl Nest',
  description: 'Most eggs on birds with bowl nests.',
  evaluate(player: Player): number {
    return countEggsInNestType(player, NestType.BOWL);
  },
};

const eggsInCavityNest: GoalTile = {
  id: 'eggs_in_cavity_nest',
  name: 'Eggs in Cavity Nest',
  description: 'Most eggs on birds with cavity nests.',
  evaluate(player: Player): number {
    return countEggsInNestType(player, NestType.CAVITY);
  },
};

const eggsInGroundNest: GoalTile = {
  id: 'eggs_in_ground_nest',
  name: 'Eggs in Ground Nest',
  description: 'Most eggs on birds with ground nests.',
  evaluate(player: Player): number {
    return countEggsInNestType(player, NestType.GROUND);
  },
};

const eggsInPlatformNest: GoalTile = {
  id: 'eggs_in_platform_nest',
  name: 'Eggs in Platform Nest',
  description: 'Most eggs on birds with platform nests.',
  evaluate(player: Player): number {
    return countEggsInNestType(player, NestType.PLATFORM);
  },
};

const eggSetsInAllHabitats: GoalTile = {
  id: 'egg_sets_in_all_habitats',
  name: 'Egg Sets in All Habitats',
  description: 'Most complete sets of 1 egg in forest, grassland, and wetland.',
  evaluate(player: Player): number {
    const forestEggs = player.board.getBirdsInHabitat(HabitatType.FOREST).reduce((sum, b) => sum + b.eggs, 0);
    const grasslandEggs = player.board.getBirdsInHabitat(HabitatType.GRASSLAND).reduce((sum, b) => sum + b.eggs, 0);
    const wetlandEggs = player.board.getBirdsInHabitat(HabitatType.WETLAND).reduce((sum, b) => sum + b.eggs, 0);
    return Math.min(forestEggs, grasslandEggs, wetlandEggs);
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

const invertebratesInBirdCosts: GoalTile = {
  id: 'invertebrates_in_bird_costs',
  name: 'Invertebrates in Bird Costs',
  description: 'Most invertebrate icons in food costs of your birds.',
  evaluate(player: Player): number {
    return player.board.getAllBirds().reduce((sum, placed) => {
      const card = createBirdCard(placed.name as BirdCardName);
      if (!card) return sum;
      return sum + card.foodCost.filter(food => food === FoodType.INVERTEBRATE).length;
    }, 0);
  },
};

/** All base-game goal tiles (excluding NO GOAL). */
export const ALL_GOAL_TILES: GoalTile[] = [
  birdsInForest,
  birdsInGrassland,
  birdsInWetland,
  birdsWithEggsInBowlNest,
  birdsWithEggsInCavityNest,
  birdsWithEggsInGroundNest,
  birdsWithEggsInPlatformNest,
  eggsInForest,
  eggsInGrassland,
  eggsInWetland,
  eggsInBowlNest,
  eggsInCavityNest,
  eggsInGroundNest,
  eggsInPlatformNest,
  eggSetsInAllHabitats,
  totalBirds,
  invertebratesInBirdCosts,
];

const GOAL_BY_ID = new Map<string, GoalTile>(ALL_GOAL_TILES.map(goal => [goal.id, goal]));

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
export function scoreRoundGoal(goal: GoalTile, players: Player[], round: number = 1): Map<Player, number> {
  const scores = new Map<Player, number>();

  // Evaluate each player
  const results = players.map(p => ({
    player: p,
    value: goal.evaluate(p),
  }));

  // Sort descending
  results.sort((a, b) => b.value - a.value);

  // Award points based on rank
  const pointsByRank = getPointsByRank(round);

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

export function getGoalTileById(id: string): GoalTile | undefined {
  return GOAL_BY_ID.get(id);
}

function matchesNestType(cardNestType: NestType, target: NestType): boolean {
  return cardNestType === target || cardNestType === NestType.WILD || cardNestType === NestType.STAR;
}

function countBirdsWithEggsInNestType(player: Player, targetNestType: NestType): number {
  return player.board.getAllBirds().reduce((sum, placed) => {
    const card = createBirdCard(placed.name as BirdCardName);
    if (!card) return sum;
    if (!matchesNestType(card.nestType, targetNestType)) return sum;
    return sum + (placed.eggs > 0 ? 1 : 0);
  }, 0);
}

function countEggsInNestType(player: Player, targetNestType: NestType): number {
  return player.board.getAllBirds().reduce((sum, placed) => {
    const card = createBirdCard(placed.name as BirdCardName);
    if (!card) return sum;
    if (!matchesNestType(card.nestType, targetNestType)) return sum;
    return sum + placed.eggs;
  }, 0);
}

function getPointsByRank(round: number): number[] {
  switch (round) {
    case 1: return [4, 1, 0, 0, 0];
    case 2: return [5, 2, 1, 0, 0];
    case 3: return [6, 3, 2, 0, 0];
    case 4: return [7, 4, 3, 0, 0];
    default: return [4, 1, 0, 0, 0];
  }
}
