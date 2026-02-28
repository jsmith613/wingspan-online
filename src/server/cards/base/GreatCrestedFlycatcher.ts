import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class GreatCrestedFlycatcher extends BirdCard {
  readonly name = BirdCardName.GREAT_CRESTED_FLYCATCHER;
  readonly commonName = 'Great Crested Flycatcher';
  readonly scientificName = 'Myiarchus crinitus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 33;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 invertebrate from the birdfeeder, if available.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1));
  }
}
