import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class LargeBirdSpecialist extends BonusCard {
  readonly name = BonusCardName.LARGE_BIRD_SPECIALIST;
  readonly displayName = 'Large Bird Specialist';
  readonly description = 'Birds with wingspan over 65cm.';
  readonly condition = 'Bird wingspan > 65cm';
  readonly vpText = '4-5 birds: 3pts; 6+ birds: 6pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.wingspan > 65) {
        count++;
      }
    }
    if (count >= 6) return 6;
    if (count >= 4) return 3;
    return 0;
  }
}
