import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';
import { ActionPriority } from '../../deferredActions/DeferredAction';

/**
 * American Robin - Brown power: Lay 1 egg on any bird.
 * Habitats: Forest, Grassland. Nest: Bowl. Eggs: 3. Wingspan: 43cm. Points: 1.
 * Food: Invertebrate, Fruit.
 */
export class AmericanRobin extends BirdCard {
  readonly name = BirdCardName.AMERICAN_ROBIN;
  readonly commonName = 'American Robin';
  readonly scientificName = 'Turdus migratorius';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 43;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on any bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new LayEggs(player, 1));
  }
}
