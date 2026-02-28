import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class HoodedWarbler extends BirdCard {
  readonly name = BirdCardName.HOODED_WARBLER;
  readonly commonName = 'Hooded Warbler';
  readonly scientificName = 'Setophaga citrina';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 18;
  readonly points = 7;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';

}
