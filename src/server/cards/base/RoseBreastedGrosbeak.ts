import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class RoseBreastedGrosbeak extends BirdCard {
  readonly name = BirdCardName.ROSE_BREASTED_GROSBEAK;
  readonly commonName = 'Rose-Breasted Grosbeak';
  readonly scientificName = 'Pheucticus ludovicianus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 33;
  readonly points = 6;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 seed or fruit from the birdfeeder, if available.';

}
