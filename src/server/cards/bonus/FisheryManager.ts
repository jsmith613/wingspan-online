import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

/** Points for birds that eat fish. */
export class FisheryManager extends BonusCard {
  readonly name = BonusCardName.FISHERY_MANAGER;
  readonly displayName = 'Fishery Manager';
  readonly description = '1 point for each bird that has fish in its food cost.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.FISH)) {
        count++;
      }
    }
    return count;
  }
}
