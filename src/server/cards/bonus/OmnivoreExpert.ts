import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

/** Points for birds whose food cost contains 3 or more different food types. */
export class OmnivoreExpert extends BonusCard {
  readonly name = BonusCardName.OMNIVORE_EXPERT;
  readonly displayName = 'Omnivore Expert';
  readonly description = '2 points for each bird that requires 3+ different food types.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card) {
        const uniqueFoods = new Set(card.foodCost.filter(f => f !== FoodType.WILD));
        if (uniqueFoods.size >= 3) {
          count++;
        }
      }
    }
    return count * 2;
  }
}
