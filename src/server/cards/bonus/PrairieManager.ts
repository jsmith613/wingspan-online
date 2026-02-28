import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points for eggs in grassland. */
export class PrairieManager extends BonusCard {
  readonly name = BonusCardName.PRAIRIE_MANAGER;
  readonly displayName = 'Prairie Manager';
  readonly description = '1 point for each egg on birds in your grassland.';

  score(player: Player): number {
    return player.board.getBirdsInHabitat(HabitatType.GRASSLAND)
      .reduce((sum, b) => sum + b.eggs, 0);
  }
}
