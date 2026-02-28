import { HabitatType } from '../../common/game/HabitatType';
import { ActionType } from '../../common/game/ActionType';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { DeferredAction } from '../deferredActions/DeferredAction';
import { GainFood } from '../deferredActions/GainFood';
import { LayEggs } from '../deferredActions/LayEggs';
import { DrawCards } from '../deferredActions/DrawCards';
import { ActivateBrownPower } from '../deferredActions/ActivateBrownPower';
import { createBirdCard } from '../cards/createCard';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { PowerType } from '../../common/game/PowerType';

/**
 * Maps habitat types to their corresponding actions.
 */
const HABITAT_ACTION_MAP: Record<HabitatType, ActionType> = {
  [HabitatType.FOREST]: ActionType.GAIN_FOOD,
  [HabitatType.GRASSLAND]: ActionType.LAY_EGGS,
  [HabitatType.WETLAND]: ActionType.DRAW_CARDS,
};

/**
 * Action strength scales with the number of birds in the habitat.
 * Column index: 0=base, more birds = stronger.
 * Forest (gain food):   1, 1, 2, 2, 3
 * Grassland (lay eggs): 2, 2, 3, 3, 4
 * Wetland (draw cards):  1, 1, 2, 2, 3
 */
const ACTION_STRENGTH: Record<HabitatType, ReadonlyArray<number>> = {
  [HabitatType.FOREST]:    [1, 1, 2, 2, 3],
  [HabitatType.GRASSLAND]: [2, 2, 3, 3, 4],
  [HabitatType.WETLAND]:   [1, 1, 2, 2, 3],
};

/**
 * Get the action type for a habitat.
 */
export function getHabitatActionType(habitat: HabitatType): ActionType {
  return HABITAT_ACTION_MAP[habitat];
}

/**
 * Get the action strength (count) based on how many birds are in the habitat.
 * The strength is determined by the number of birds already placed.
 */
export function getActionStrength(habitat: HabitatType, birdCount: number): number {
  const strengths = ACTION_STRENGTH[habitat];
  const index = Math.min(birdCount, strengths.length - 1);
  return strengths[index];
}

/**
 * Create the base habitat action as a deferred action.
 */
export function createHabitatAction(
  player: Player,
  habitat: HabitatType,
  game: Game
): DeferredAction {
  const birdCount = player.board.getBirdCount(habitat);
  const strength = getActionStrength(habitat, birdCount);

  switch (habitat) {
    case HabitatType.FOREST:
      return new GainFood(player, strength);
    case HabitatType.GRASSLAND:
      return new LayEggs(player, strength);
    case HabitatType.WETLAND:
      return new DrawCards(player, strength);
  }
}

/**
 * Execute a full habitat action:
 * 1. Create the base action
 * 2. Queue brown power activations (right-to-left through placed birds)
 * 3. Process the queue
 *
 * Brown powers are activated right-to-left (from the rightmost bird toward the left).
 */
export function executeHabitatAction(
  player: Player,
  habitat: HabitatType,
  game: Game
): void {
  // Base habitat action
  const baseAction = createHabitatAction(player, habitat, game);
  game.deferredActions.push(baseAction);

  // Queue brown powers right-to-left (rightmost slot first).
  // These resolve after the base action and can enqueue more deferred actions.
  const slots = player.board.getHabitat(habitat);
  for (let i = slots.length - 1; i >= 0; i--) {
    const placed = slots[i];
    if (!placed) continue;

    const card = createBirdCard(placed.name as BirdCardName);
    if (!card || card.powerType !== PowerType.BROWN) continue;

    game.deferredActions.push(new ActivateBrownPower(player, card));
  }
}
