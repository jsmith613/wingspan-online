import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class GreenHeron extends BirdCard {
  readonly name = BirdCardName.GREEN_HERON;
  readonly commonName = 'Green Heron';
  readonly scientificName = 'Butorides virescens';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 3;
  readonly wingspan = 66;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Trade 1 wild for any other type from the supply.';

  // TODO: Complex power - requires additional UI interaction
  onActivate(_player: Player, _game: Game): void {
    // Trade 1 [wild] for any other type from the supply.
  }
}
