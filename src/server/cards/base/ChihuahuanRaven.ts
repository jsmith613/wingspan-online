import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class ChihuahuanRaven extends BirdCard {
  readonly name = BirdCardName.CHIHUAHUAN_RAVEN;
  readonly commonName = 'Chihuahuan Raven';
  readonly scientificName = 'Corvus cryptoleucus';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.RODENT, FoodType.WILD, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 3;
  readonly wingspan = 112;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 egg from any of your other birds to gain 2 wild from the supply.';

}
