import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class Historian extends BonusCard {
  readonly name = BonusCardName.HISTORIAN;
  readonly displayName = 'Historian';
  readonly description = "Birds named after a person (has 's in name).";
  readonly condition = "Bird common name contains 's (possessive)";
  readonly vpText = '2pts per bird';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      const commonName = card ? card.commonName.toLowerCase() : bird.name.toLowerCase().replace(/_/g, ' ');
      if (commonName.includes("'s")) {
        count++;
      }
    }
    return count * 2;
  }
}
