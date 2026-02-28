import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

/**
 * Blue Jay - Brown power: Gain 1 food from the birdfeeder.
 * Habitats: Forest. Nest: Platform. Eggs: 3. Wingspan: 41cm. Points: 2.
 * Food: Seed.
 */
export class BlueJay extends BirdCard {
  readonly name = BirdCardName.BLUE_JAY;
  readonly commonName = 'Blue Jay';
  readonly scientificName = 'Cyanocitta cristata';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.SEED];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 3;
  readonly wingspan = 41;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 food from the birdfeeder.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
  }
}
