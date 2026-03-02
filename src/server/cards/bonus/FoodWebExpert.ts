import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

export class FoodWebExpert extends BonusCard {
  readonly name = BonusCardName.FOOD_WEB_EXPERT;
  readonly displayName = 'Food Web Expert';
  readonly description = 'Birds that eat ONLY invertebrate.';
  readonly condition = 'Bird food cost consists entirely of invertebrate (no wild, no other types)';
  readonly vpText = '2pts per bird';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.length > 0 &&
          card.foodCost.every(f => f === FoodType.INVERTEBRATE)) {
        count++;
      }
    }
    return count * 2;
  }
}
