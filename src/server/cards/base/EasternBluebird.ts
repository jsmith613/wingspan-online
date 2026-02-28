import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

/**
 * Eastern Bluebird - Brown power: Gain 1 food from the birdfeeder.
 * Habitats: Grassland. Nest: Cavity. Eggs: 3. Wingspan: 33cm. Points: 3.
 * Food: Invertebrate.
 */
export class EasternBluebird extends BirdCard {
  readonly name = BirdCardName.EASTERN_BLUEBIRD;
  readonly commonName = 'Eastern Bluebird';
  readonly scientificName = 'Sialia sialis';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 33;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 food from the birdfeeder.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
  }
}
