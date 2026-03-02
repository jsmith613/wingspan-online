import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

export class Viticulturist extends BonusCard {
  readonly name = BonusCardName.VITICULTURIST;
  readonly displayName = 'Viticulturist';
  readonly description = 'Birds that eat fruit.';
  readonly condition = 'Bird food cost includes fruit';
  readonly vpText = '2-3 birds: 3pts; 4+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.FRUIT)) {
        count++;
      }
    }
    if (count >= 4) return 7;
    if (count >= 2) return 3;
    return 0;
  }
}
