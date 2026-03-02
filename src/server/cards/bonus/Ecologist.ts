import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

export class Ecologist extends BonusCard {
  readonly name = BonusCardName.ECOLOGIST;
  readonly displayName = 'Ecologist';
  readonly description = 'Birds in your habitat with the fewest birds.';
  readonly condition = 'Count birds in the habitat with the fewest birds (ties count)';
  readonly vpText = '2pts per bird';

  score(player: Player): number {
    const counts = Object.values(HabitatType).map(h => player.board.getBirdCount(h));
    const min = Math.min(...counts);
    return min * 2;
  }
}
