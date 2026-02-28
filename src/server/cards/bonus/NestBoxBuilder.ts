import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { NestType } from '../../../common/game/NestType';

/** Points for cavity-nesting birds. */
export class NestBoxBuilder extends BonusCard {
  readonly name = BonusCardName.NEST_BOX_BUILDER;
  readonly displayName = 'Nest Box Builder';
  readonly description = '2 points for each bird with a cavity nest.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.nestType === NestType.CAVITY) {
        count++;
      }
    }
    return count * 2;
  }
}
