import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

/** Points for birds that eat fruit. */
export class Viticulturist extends BonusCard {
  readonly name = BonusCardName.VITICULTURIST;
  readonly displayName = 'Viticulturist';
  readonly description = '1 point for each bird that has fruit in its food cost.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.FRUIT)) {
        count++;
      }
    }
    return count;
  }
}
