import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class AmericanRedstart extends BirdCard {
  readonly name = BirdCardName.AMERICAN_REDSTART;
  readonly commonName = 'American Redstart';
  readonly scientificName = 'Setophaga ruticilla';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 20;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 die from the birdfeeder.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
  }
}
