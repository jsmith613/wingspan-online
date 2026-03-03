import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import type { BrownPowerContext } from '../BirdCard';
import { RepeatBrownPowerInHabitat } from '../../deferredActions/RepeatBrownPowerInHabitat';

export class HoodedMerganser extends BirdCard {
  readonly name = BirdCardName.HOODED_MERGANSER;
  readonly commonName = 'Hooded Merganser';
  readonly scientificName = 'Lophodytes cucullatus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 61;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Repeat 1 predator power in this habitat.';

  onActivate(player: Player, game: Game, context?: BrownPowerContext): void {
    const sourceHabitat = context?.habitat;
    const sourceSlot = context?.slotIndex;
    if (sourceHabitat === undefined || sourceSlot === undefined) return;
    game.deferredActions.push(new RepeatBrownPowerInHabitat(
      player,
      sourceHabitat,
      sourceSlot,
      'PREDATOR_ONLY',
      this.powerText,
    ));
  }
}
