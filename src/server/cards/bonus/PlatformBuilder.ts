import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { NestType } from '../../../common/game/NestType';

/** Points for platform-nesting birds. */
export class PlatformBuilder extends BonusCard {
  readonly name = BonusCardName.PLATFORM_BUILDER;
  readonly displayName = 'Platform Builder';
  readonly description = '2 points for each bird with a platform nest.';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.nestType === NestType.PLATFORM) {
        count++;
      }
    }
    return count * 2;
  }
}
