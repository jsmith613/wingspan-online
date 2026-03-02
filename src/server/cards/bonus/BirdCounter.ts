import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class BirdCounter extends BonusCard {
  readonly name = BonusCardName.BIRD_COUNTER;
  readonly displayName = 'Bird Counter';
  readonly description = 'Birds with a flocking power (tuck cards).';
  readonly condition = 'Bird power text contains "tuck"';
  readonly vpText = '2pts per bird';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.powerText.toLowerCase().includes('tuck')) {
        count++;
      }
    }
    return count * 2;
  }
}
