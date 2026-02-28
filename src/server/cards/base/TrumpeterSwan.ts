import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class TrumpeterSwan extends BirdCard {
  readonly name = BirdCardName.TRUMPETER_SWAN;
  readonly commonName = 'Trumpeter Swan';
  readonly scientificName = 'Cygnus buccinator';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED, FoodType.WILD];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 203;
  readonly points = 9;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';

}
