import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class WoodDuck extends BirdCard {
  readonly name = BirdCardName.WOOD_DUCK;
  readonly commonName = 'Wood Duck';
  readonly scientificName = 'Aix sponsa';
  readonly habitats = [HabitatType.FOREST, HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 76;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 2 card. If you do, discard 1 card from your hand at the end of your turn.';

}
