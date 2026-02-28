import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

/** Points for birds with wingspan >= 65cm. */
export class LargeBirdSpecialist extends BonusCard {
  readonly name = BonusCardName.LARGE_BIRD_SPECIALIST;
  readonly displayName = 'Large Bird Specialist';
  readonly description = '1 point for each bird with a wingspan of 65cm or more.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.wingspan >= 65) {
        count++;
      }
    }
    return count;
  }
}
