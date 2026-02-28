import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

/**
 * Mallard - No power.
 * Habitats: Wetland. Nest: Ground. Eggs: 5. Wingspan: 91cm. Points: 2.
 * Food: Seed, Invertebrate.
 */
export class Mallard extends BirdCard {
  readonly name = BirdCardName.MALLARD;
  readonly commonName = 'Mallard';
  readonly scientificName = 'Anas platyrhynchos';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.INVERTEBRATE];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 5;
  readonly wingspan = 91;
  readonly points = 2;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';
}
