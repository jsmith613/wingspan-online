import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class PrairieManager extends BonusCard {
  readonly name = BonusCardName.PRAIRIE_MANAGER;
  readonly displayName = 'Prairie Manager';
  readonly description = 'Birds that can ONLY live in grassland.';
  readonly condition = 'Bird has only grassland as its habitat (no other habitats)';
  readonly vpText = '2-3 birds: 3pts; 4+ birds: 8pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.habitats.length === 1 && card.habitats[0] === HabitatType.GRASSLAND) {
        count++;
      }
    }
    if (count >= 4) return 8;
    if (count >= 2) return 3;
    return 0;
  }
}
