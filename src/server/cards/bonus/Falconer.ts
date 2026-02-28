import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

/** Points for birds with wingspan >= 100cm. */
export class Falconer extends BonusCard {
  readonly name = BonusCardName.FALCONER;
  readonly displayName = 'Falconer';
  readonly description = '2 points for each bird with a wingspan of 100cm or more.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.wingspan >= 100) {
        count++;
      }
    }
    return count * 2;
  }
}
