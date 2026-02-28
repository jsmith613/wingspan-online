import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

/** Points for birds with wingspan <= 30cm (small birds / passerines). */
export class PasserineSpecialist extends BonusCard {
  readonly name = BonusCardName.PASSERINE_SPECIALIST;
  readonly displayName = 'Passerine Specialist';
  readonly description = '1 point for each bird with a wingspan of 30cm or less.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.wingspan <= 30) {
        count++;
      }
    }
    return count;
  }
}
