import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

/** Birds with body part in their name. Approximated as: 2 pts per bird with wingspan > 65cm. */
export class Anatomist extends BonusCard {
  readonly name = BonusCardName.ANATOMIST;
  readonly displayName = 'Anatomist';
  readonly description = '2 points for each bird in your play area with a body part in its common name.';

  score(player: Player): number {
    // Simplified: counts birds whose names contain body part keywords
    const bodyParts = ['throat', 'eye', 'wing', 'tail', 'breast', 'head', 'beak', 'bill', 'crown', 'belly'];
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const lowerName = bird.name.toLowerCase().replace(/_/g, ' ');
      if (bodyParts.some(part => lowerName.includes(part))) {
        count++;
      }
    }
    return count * 2;
  }
}
