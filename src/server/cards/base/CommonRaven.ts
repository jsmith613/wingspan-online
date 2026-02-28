import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';
import { CacheFood } from '../../deferredActions/CacheFood';

/**
 * Common Raven - Brown power: Gain 1 food from birdfeeder and cache it on this bird.
 * Habitats: Forest. Nest: Platform. Eggs: 2. Wingspan: 124cm. Points: 4.
 * Food: Wild, Wild.
 */
export class CommonRaven extends BirdCard {
  readonly name = BirdCardName.COMMON_RAVEN;
  readonly commonName = 'Common Raven';
  readonly scientificName = 'Corvus corax';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.WILD, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 124;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 food from the birdfeeder and cache it on this bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
    const placed = player.board.getAllBirds().find(b => b.name === this.name);
    if (placed) {
      game.deferredActions.push(new CacheFood(player, placed, 1));
    }
  }
}
