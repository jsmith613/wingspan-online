import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class AnnasHummingbird extends BirdCard {
  readonly name = BirdCardName.ANNAS_HUMMINGBIRD;
  readonly commonName = 'Anna\'s Hummingbird';
  readonly scientificName = 'Calypte anna';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.WILD];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 13;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Each player gains 1 die from the birdfeeder, starting with the player of your choice.';

  onActivate(player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new GainFood(p, 1));
    }
  }
}
