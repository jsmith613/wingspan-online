import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';
import { createBirdCard } from '../createCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';

export class WetlandScientist extends BonusCard {
  readonly name = BonusCardName.WETLAND_SCIENTIST;
  readonly displayName = 'Wetland Scientist';
  readonly description = 'Birds that can ONLY live in wetland.';
  readonly condition = 'Bird has only wetland as its habitat (no other habitats)';
  readonly vpText = '3-4 birds: 3pts; 5+ birds: 7pts';

  score(player: Player): number {
    let count = 0;
    for (const bird of player.board.getAllBirds()) {
      const card = createBirdCard(bird.name as BirdCardName);
      if (card && card.habitats.length === 1 && card.habitats[0] === HabitatType.WETLAND) {
        count++;
      }
    }
    if (count >= 5) return 7;
    if (count >= 3) return 3;
    return 0;
  }
}
