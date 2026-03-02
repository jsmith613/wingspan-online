import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';

export class FisheryManager extends BonusCard {
  readonly name = BonusCardName.FISHERY_MANAGER;
  readonly displayName = 'Fishery Manager';
  readonly description = 'Birds that eat fish.';
  readonly condition = 'Bird food cost includes fish';
  readonly vpText = '2-3 birds: 3pts; 4+ birds: 8pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.foodCost.includes(FoodType.FISH)) {
        count++;
      }
    }
    if (count >= 4) return 8;
    if (count >= 2) return 3;
    return 0;
  }
}
