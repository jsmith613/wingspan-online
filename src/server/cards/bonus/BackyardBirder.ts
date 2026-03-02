import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class BackyardBirder extends BonusCard {
  readonly name = BonusCardName.BACKYARD_BIRDER;
  readonly displayName = 'Backyard Birder';
  readonly description = 'Birds worth less than 4 points.';
  readonly condition = 'Bird face-value points are 0-3';
  readonly vpText = '5-6 birds: 3pts; 6+ birds: 6pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.points < 4) {
        count++;
      }
    }
    if (count > 6) return 6;
    if (count >= 5) return 3;
    return 0;
  }
}
