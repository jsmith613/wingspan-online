import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { PowerType } from '../../../common/game/PowerType';

/** Points for birds with brown powers. */
export class Ethologist extends BonusCard {
  readonly name = BonusCardName.ETHOLOGIST;
  readonly displayName = 'Ethologist';
  readonly description = '1 point for each bird with a brown power.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.powerType === PowerType.BROWN) {
        count++;
      }
    }
    return count;
  }
}
