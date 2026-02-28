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
 * Great Blue Heron - Brown power: Gain 1 food from the birdfeeder.
 * Habitats: Wetland. Nest: Platform. Eggs: 3. Wingspan: 183cm. Points: 5.
 * Food: Fish, Fish.
 */
export class GreatBlueHeron extends BirdCard {
  readonly name = BirdCardName.GREAT_BLUE_HERON;
  readonly commonName = 'Great Blue Heron';
  readonly scientificName = 'Ardea herodias';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 3;
  readonly wingspan = 183;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 food from the birdfeeder.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
  }
}
