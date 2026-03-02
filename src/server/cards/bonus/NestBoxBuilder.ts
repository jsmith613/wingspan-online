import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { NestType } from '../../../common/game/NestType';

export class NestBoxBuilder extends BonusCard {
  readonly name = BonusCardName.NEST_BOX_BUILDER;
  readonly displayName = 'Nest Box Builder';
  readonly description = 'Birds with cavity nests.';
  readonly condition = 'Bird nest type is cavity or star (wild)';
  readonly vpText = '4-5 birds: 4pts; 6+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && (card.nestType === NestType.CAVITY || card.nestType === NestType.STAR)) {
        count++;
      }
    }
    if (count >= 6) return 7;
    if (count >= 4) return 4;
    return 0;
  }
}
