import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

export class OmnivoreExpert extends BonusCard {
  readonly name = BonusCardName.OMNIVORE_EXPERT;
  readonly displayName = 'Omnivore Expert';
  readonly description = 'Birds that eat wild (have wild/any food symbol in cost).';
  readonly condition = 'Bird food cost includes wild food';
  readonly vpText = '2pts per bird';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.WILD)) {
        count++;
      }
    }
    return count * 2;
  }
}
