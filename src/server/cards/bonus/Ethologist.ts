import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class Ethologist extends BonusCard {
  readonly name = BonusCardName.ETHOLOGIST;
  readonly displayName = 'Ethologist';
  readonly description = 'In any one habitat, count the number of different power colors.';
  readonly condition = 'Power colors: brown, pink, white (no-power counts as white)';
  readonly vpText = '2pts per power color in best habitat';

  score(player: Player): number {
    let best = 0;
    for (const habitat of Object.values(HabitatType)) {
      const colors = new Set<string>();
      for (const bird of player.board.getBirdsInHabitat(habitat)) {
        const card = createBirdCard(bird.name as BirdCardName);
        if (card) {
          if (card.powerType === PowerType.BROWN) {
            colors.add('brown');
          } else if (card.powerType === PowerType.PINK) {
            colors.add('pink');
          } else {
            colors.add('white');
          }
        }
      }
      best = Math.max(best, colors.size);
    }
    return best * 2;
  }
}
