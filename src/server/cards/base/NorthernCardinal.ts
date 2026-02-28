import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class NorthernCardinal extends BirdCard {
  readonly name = BirdCardName.NORTHERN_CARDINAL;
  readonly commonName = 'Northern Cardinal';
  readonly scientificName = 'Cardinalis cardinalis';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 5;
  readonly wingspan = 30;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 fruit from the supply.';

  onActivate(player: Player, _game: Game): void {
    player.addFood(FoodType.FRUIT);
  }
}
