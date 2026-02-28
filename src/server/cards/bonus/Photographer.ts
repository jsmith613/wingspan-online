import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

/** Points for birds worth 4+ face-value points. */
export class Photographer extends BonusCard {
  readonly name = BonusCardName.PHOTOGRAPHER;
  readonly displayName = 'Photographer';
  readonly description = '1 point for each bird worth 4 or more points.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.points >= 4) {
        count++;
      }
    }
    return count;
  }
}
