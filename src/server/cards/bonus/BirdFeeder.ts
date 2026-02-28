import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

/** Points for food remaining in supply. */
export class BirdFeederBonus extends BonusCard {
  readonly name = BonusCardName.BIRD_FEEDER;
  readonly displayName = 'Bird Feeder';
  readonly description = '1 point for every 2 food tokens in your supply (rounded down).';

  score(player: Player): number {
    return Math.floor(player.food.length / 2);
  }
}
