import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import { GameEvent } from '../../powers/PowerEventBus';

export class EasternKingbird extends BirdCard {
  readonly name = BirdCardName.EASTERN_KINGBIRD;
  readonly commonName = 'Eastern Kingbird';
  readonly scientificName = 'Tyrannus tyrannus';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 38;
  readonly points = 2;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player plays a bird in their forest, gain 1 invertebrate from the supply.';

}
