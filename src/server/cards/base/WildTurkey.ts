import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class WildTurkey extends BirdCard {
  readonly name = BirdCardName.WILD_TURKEY;
  readonly commonName = 'Wild Turkey';
  readonly scientificName = 'Meleagris gallopavo';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 5;
  readonly wingspan = 135;
  readonly points = 8;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';

}
