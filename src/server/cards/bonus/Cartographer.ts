import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points for having birds in all 3 habitats. */
export class Cartographer extends BonusCard {
  readonly name = BonusCardName.CARTOGRAPHER;
  readonly displayName = 'Cartographer';
  readonly description = '3 points if you have birds in all 3 habitats.';

  score(player: Player): number {
    const hasForest = player.board.getBirdCount(HabitatType.FOREST) > 0;
    const hasGrassland = player.board.getBirdCount(HabitatType.GRASSLAND) > 0;
    const hasWetland = player.board.getBirdCount(HabitatType.WETLAND) > 0;
    return (hasForest && hasGrassland && hasWetland) ? 3 : 0;
  }
}
