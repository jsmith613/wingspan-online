import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

const COLORS = [
  'ash', 'black', 'blue', 'bronze', 'brown', 'cerulean', 'chestnut',
  'ferruginous', 'gold', 'gray', 'green', 'indigo', 'lazuli', 'purple',
  'red', 'rose', 'roseate', 'ruby', 'ruddy', 'rufous', 'snowy', 'violet',
  'white', 'yellow',
];

export class Photographer extends BonusCard {
  readonly name = BonusCardName.PHOTOGRAPHER;
  readonly displayName = 'Photographer';
  readonly description = 'Birds with colors in their name.';
  readonly condition = 'Bird name contains a color word';
  readonly vpText = '4-5 birds: 3pts; 6+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      const lowerName = card ? card.commonName.toLowerCase() : bird.name.toLowerCase().replace(/_/g, ' ');
      if (COLORS.some(color => lowerName.includes(color))) {
        count++;
      }
    }
    if (count >= 6) return 7;
    if (count >= 4) return 3;
    return 0;
  }
}
