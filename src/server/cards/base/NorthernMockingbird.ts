import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class NorthernMockingbird extends BirdCard {
  readonly name = BirdCardName.NORTHERN_MOCKINGBIRD;
  readonly commonName = 'Northern Mockingbird';
  readonly scientificName = 'Mimus polyglottos';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 4;
  readonly wingspan = 36;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Repeat a brown power on another bird in this habitat.';

  // TODO: Complex power - requires additional UI interaction
  onActivate(_player: Player, _game: Game): void {
    // Repeat a brown power on another bird in this habitat.
  }
}
