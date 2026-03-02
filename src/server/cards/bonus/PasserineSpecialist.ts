import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class PasserineSpecialist extends BonusCard {
  readonly name = BonusCardName.PASSERINE_SPECIALIST;
  readonly displayName = 'Passerine Specialist';
  readonly description = 'Birds with wingspan 30cm or less.';
  readonly condition = 'Bird wingspan <= 30cm';
  readonly vpText = '4-5 birds: 3pts; 6+ birds: 6pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.wingspan <= 30) {
        count++;
      }
    }
    if (count >= 6) return 6;
    if (count >= 4) return 3;
    return 0;
  }
}
