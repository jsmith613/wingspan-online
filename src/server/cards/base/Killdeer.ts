import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

/**
 * Killdeer - Brown power: Lay 2 eggs on this bird.
 * Habitats: Grassland, Wetland. Nest: Ground. Eggs: 4. Wingspan: 63cm. Points: 2.
 * Food: Invertebrate, Seed.
 */
export class Killdeer extends BirdCard {
  readonly name = BirdCardName.KILLDEER;
  readonly commonName = 'Killdeer';
  readonly scientificName = 'Charadrius vociferus';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 63;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 2 eggs on this bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new LayEggs(player, 2));
  }
}
