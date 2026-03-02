import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

const GEO_TERMS = [
  'american', 'atlantic', 'baltimore', 'california', 'canada', 'carolina',
  'chihuahuan', 'eastern', 'inca', 'mississippi', 'mountain', 'northern',
  'prairie', 'sandhill', 'savannah', 'western',
];

export class Cartographer extends BonusCard {
  readonly name = BonusCardName.CARTOGRAPHER;
  readonly displayName = 'Cartographer';
  readonly description = 'Birds with geography terms in their name.';
  readonly condition = 'Bird name contains a geographic term';
  readonly vpText = '2-3 birds: 3pts; 4+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      const lowerName = card ? card.commonName.toLowerCase() : bird.name.toLowerCase().replace(/_/g, ' ');
      if (GEO_TERMS.some(term => lowerName.includes(term))) {
        count++;
      }
    }
    if (count >= 4) return 7;
    if (count >= 2) return 3;
    return 0;
  }
}
