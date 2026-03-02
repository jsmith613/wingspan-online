import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class Forester extends BonusCard {
  readonly name = BonusCardName.FORESTER;
  readonly displayName = 'Forester';
  readonly description = 'Birds that can ONLY live in forest.';
  readonly condition = 'Bird has only forest as its habitat (no other habitats)';
  readonly vpText = '3-4 birds: 4pts; 5+ birds: 8pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.habitats.length === 1 && card.habitats[0] === HabitatType.FOREST) {
        count++;
      }
    }
    if (count >= 5) return 8;
    if (count >= 3) return 4;
    return 0;
  }
}
