import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

/** Points for birds that eat rodents. */
export class Rodentologist extends BonusCard {
  readonly name = BonusCardName.RODENTOLOGIST;
  readonly displayName = 'Rodentologist';
  readonly description = '2 points for each bird that has rodent in its food cost.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.RODENT)) {
        count++;
      }
    }
    return count * 2;
  }
}
