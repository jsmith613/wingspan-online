import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class BirdBander extends BonusCard {
  readonly name = BonusCardName.BIRD_BANDER;
  readonly displayName = 'Bird Bander';
  readonly description = 'Birds that can live in multiple habitats.';
  readonly condition = 'Bird has 2 or more habitats listed';
  readonly vpText = '4-5 birds: 4pts; 6+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.habitats.length >= 2) {
        count++;
      }
    }
    if (count >= 6) return 7;
    if (count >= 4) return 4;
    return 0;
  }
}
