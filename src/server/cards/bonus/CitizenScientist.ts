import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

export class CitizenScientist extends BonusCard {
  readonly name = BonusCardName.CITIZEN_SCIENTIST;
  readonly displayName = 'Citizen Scientist';
  readonly description = 'Birds with tucked cards.';
  readonly condition = 'Bird has at least 1 tucked card behind it';
  readonly vpText = '4-6 birds: 3pts; 7+ birds: 6pts';

  score(player: Player): number {
    const count = player.board.getAllBirds().filter(b => b.tuckedCards > 0).length;
    if (count >= 7) return 6;
    if (count >= 4) return 3;
    return 0;
  }
}
