import { Player } from '../../../src/server/Player';
import { PlayerId } from '../../../src/common/Types';
import { FoodType } from '../../../src/common/game/FoodType';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';

/**
 * Helper for creating test players with customizable state.
 */
export function createTestPlayer(
  name: string = 'TestPlayer',
  actionCubes: number = 8
): Player {
  return new Player(`test_${name}` as PlayerId, name, actionCubes);
}

/**
 * Give a player a set of food.
 */
export function giveFood(player: Player, foods: FoodType[]): void {
  for (const food of foods) {
    player.addFood(food);
  }
}

/**
 * Give a player a set of bird cards.
 */
export function giveCards(player: Player, cards: BirdCardName[]): void {
  for (const card of cards) {
    player.addCardToHand(card);
  }
}
