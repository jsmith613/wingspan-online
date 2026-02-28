import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class BlueWingedWarbler extends BirdCard {
  readonly name = BirdCardName.BLUE_WINGED_WARBLER;
  readonly commonName = 'Blue-Winged Warbler';
  readonly scientificName = 'Vermivora cyanoptera';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 20;
  readonly points = 8;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';

}
