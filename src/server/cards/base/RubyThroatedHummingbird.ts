import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class RubyThroatedHummingbird extends BirdCard {
  readonly name = BirdCardName.RUBY_THROATED_HUMMINGBIRD;
  readonly commonName = 'Ruby-Throated Hummingbird';
  readonly scientificName = 'Archilochus colubris';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.WILD];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 10;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Each player gains 1 die from the birdfeeder, starting with the player of your choice.';

  onActivate(player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new GainFood(p, 1));
    }
  }
}
