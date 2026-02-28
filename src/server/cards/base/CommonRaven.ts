import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class CommonRaven extends BirdCard {
  readonly name = BirdCardName.COMMON_RAVEN;
  readonly commonName = 'Common Raven';
  readonly scientificName = 'Corvus corax';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.RODENT, FoodType.WILD, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 135;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 egg from any of your other birds to gain 2 wild from the supply.';

}
