import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

/**
 * House Finch - No power.
 * Habitats: Forest, Grassland. Nest: Bowl. Eggs: 4. Wingspan: 25cm. Points: 1.
 * Food: Seed.
 */
export class HouseFinch extends BirdCard {
  readonly name = BirdCardName.HOUSE_FINCH;
  readonly commonName = 'House Finch';
  readonly scientificName = 'Haemorhous mexicanus';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 4;
  readonly wingspan = 25;
  readonly points = 1;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';
}
