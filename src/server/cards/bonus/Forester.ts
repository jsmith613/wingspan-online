import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points for birds in forest habitat. */
export class Forester extends BonusCard {
  readonly name = BonusCardName.FORESTER;
  readonly displayName = 'Forester';
  readonly description = '1 point for each bird in your forest habitat.';

  score(player: Player): number {
    return player.board.getBirdCount(HabitatType.FOREST);
  }
}
