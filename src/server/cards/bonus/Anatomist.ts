import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

const BODY_PARTS = [
  'beak', 'belly', 'bill', 'breast', 'cap', 'chin', 'collar', 'crest',
  'crown', 'eye', 'face', 'head', 'neck', 'rump', 'shoulder', 'tail',
  'throat', 'wing',
];

export class Anatomist extends BonusCard {
  readonly name = BonusCardName.ANATOMIST;
  readonly displayName = 'Anatomist';
  readonly description = 'Birds with body parts in their name.';
  readonly condition = 'Bird name contains a body part (beak, belly, bill, breast, cap, chin, collar, crest, crown, eye, face, head, neck, rump, shoulder, tail, throat, wing)';
  readonly vpText = '2-3 birds: 3pts; 4+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      const lowerName = card ? card.commonName.toLowerCase() : bird.name.toLowerCase().replace(/_/g, ' ');
      if (BODY_PARTS.some(part => lowerName.includes(part))) {
        count++;
      }
    }
    if (count >= 4) return 7;
    if (count >= 2) return 3;
    return 0;
  }
}
