import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';

/**
 * Dark-eyed Junco - No power.
 * Habitats: Forest, Grassland. Nest: Ground. Eggs: 3. Wingspan: 23cm. Points: 3.
 * Food: Seed, Seed.
 */
export class DarkEyedJunco extends BirdCard {
  readonly name = BirdCardName.DARK_EYED_JUNCO;
  readonly commonName = 'Dark-eyed Junco';
  readonly scientificName = 'Junco hyemalis';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 23;
  readonly points = 3;
  readonly powerType = PowerType.NONE;
  readonly powerText = '';
}
