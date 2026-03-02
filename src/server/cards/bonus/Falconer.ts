import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class Falconer extends BonusCard {
  readonly name = BonusCardName.FALCONER;
  readonly displayName = 'Falconer';
  readonly description = 'Birds with a predator power.';
  readonly condition = 'Bird power text contains "predator" or hunts other birds';
  readonly vpText = '2pts per bird';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.powerText.toLowerCase().includes('predator')) {
        count++;
      }
    }
    return count * 2;
  }
}
