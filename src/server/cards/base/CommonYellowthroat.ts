import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

export class CommonYellowthroat extends BirdCard {
  readonly name = BirdCardName.COMMON_YELLOWTHROAT;
  readonly commonName = 'Common Yellowthroat';
  readonly scientificName = 'Geothlypis trichas';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 4;
  readonly wingspan = 18;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 2 card. If you do, discard 1 card from your hand at the end of your turn.';

}
