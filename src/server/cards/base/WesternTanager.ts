import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class WesternTanager extends BirdCard {
  readonly name = BirdCardName.WESTERN_TANAGER;
  readonly commonName = 'Western Tanager';
  readonly scientificName = 'Piranga ludoviciana';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 30;
  readonly points = 6;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 invertebrate or fruit from the birdfeeder, if available.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
  }
}
