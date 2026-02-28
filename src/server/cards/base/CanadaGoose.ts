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
 * Canada Goose - Brown power: Lay 1 egg on each bird in this habitat.
 * Habitats: Wetland, Grassland. Nest: Ground. Eggs: 5. Wingspan: 170cm. Points: 4.
 * Food: Seed, Seed.
 */
export class CanadaGoose extends BirdCard {
  readonly name = BirdCardName.CANADA_GOOSE;
  readonly commonName = 'Canada Goose';
  readonly scientificName = 'Branta canadensis';
  readonly habitats = [HabitatType.WETLAND, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 5;
  readonly wingspan = 170;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on each bird in this habitat.';

  onActivate(player: Player, game: Game): void {
    // Find which habitat this bird is in
    for (const habitat of this.habitats) {
      const birds = player.board.getBirdsInHabitat(habitat);
      if (birds.some(b => b.name === this.name)) {
        game.deferredActions.push(new LayEggs(player, birds.length));
        return;
      }
    }
  }
}
