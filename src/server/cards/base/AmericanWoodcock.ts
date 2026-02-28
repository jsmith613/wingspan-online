import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class AmericanWoodcock extends BirdCard {
  readonly name = BirdCardName.AMERICAN_WOODCOCK;
  readonly commonName = 'American Woodcock';
  readonly scientificName = 'Scolopax minor';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 46;
  readonly points = 9;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';

}
