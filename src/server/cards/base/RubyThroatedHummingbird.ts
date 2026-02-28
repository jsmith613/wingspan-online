import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';

/**
 * Ruby-throated Hummingbird - Game-end power: 2 points per fruit in your supply.
 * Habitats: Forest. Nest: Bowl. Eggs: 2. Wingspan: 11cm. Points: 2.
 * Food: Wild.
 */
export class RubyThroatedHummingbird extends BirdCard {
  readonly name = BirdCardName.RUBY_THROATED_HUMMINGBIRD;
  readonly commonName = 'Ruby-throated Hummingbird';
  readonly scientificName = 'Archilochus colubris';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.WILD];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 11;
  readonly points = 2;
  readonly powerType = PowerType.GAME_END;
  readonly powerText = 'Game End: 2 points for each fruit in your supply.';

  getGameEndPoints(player: Player): number {
    return player.getFoodCount(FoodType.FRUIT) * 2;
  }
}
