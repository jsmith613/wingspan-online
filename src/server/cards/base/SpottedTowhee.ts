import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class SpottedTowhee extends BirdCard {
  readonly name = BirdCardName.SPOTTED_TOWHEE;
  readonly commonName = 'Spotted Towhee';
  readonly scientificName = 'Pipilo maculatus';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 28;
  readonly points = 0;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 seed from the supply.';

  onActivate(player: Player, _game: Game): void {
    player.addFood(FoodType.SEED);
  }
}
