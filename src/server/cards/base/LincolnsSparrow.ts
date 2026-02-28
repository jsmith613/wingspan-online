import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class LincolnsSparrow extends BirdCard {
  readonly name = BirdCardName.LINCOLNS_SPARROW;
  readonly commonName = 'Lincoln\'s Sparrow';
  readonly scientificName = 'Melospiza lincolnii';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 20;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'If this bird is to the right of all other birds in its habitat, move it to another habitat.';

  // TODO: Complex power - requires additional UI interaction
  onActivate(_player: Player, _game: Game): void {
    // If this bird is to the right of all other birds in its habitat, move it to another habitat.
  }
}
