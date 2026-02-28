import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class ProthonotaryWarbler extends BirdCard {
  readonly name = BirdCardName.PROTHONOTARY_WARBLER;
  readonly commonName = 'Prothonotary Warbler';
  readonly scientificName = 'Protonotaria citrea';
  readonly habitats = [HabitatType.FOREST, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 23;
  readonly points = 8;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';

}
