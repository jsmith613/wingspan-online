import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

export class BirdFeederBonus extends BonusCard {
  readonly name = BonusCardName.BIRD_FEEDER;
  readonly displayName = 'Bird Feeder';
  readonly description = 'Birds that eat seed.';
  readonly condition = 'Bird food cost includes seed';
  readonly vpText = '5-7 birds: 3pts; 8+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.SEED)) {
        count++;
      }
    }
    if (count >= 8) return 7;
    if (count >= 5) return 3;
    return 0;
  }
}
