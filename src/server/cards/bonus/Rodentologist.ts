import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

export class Rodentologist extends BonusCard {
  readonly name = BonusCardName.RODENTOLOGIST;
  readonly displayName = 'Rodentologist';
  readonly description = 'Birds that eat rodent.';
  readonly condition = 'Bird food cost includes rodent';
  readonly vpText = '2pts per bird';

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
