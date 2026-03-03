import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GainFood } from '../../deferredActions/GainFood';

export class IndigoBunting extends BirdCard {
  readonly name = BirdCardName.INDIGO_BUNTING;
  readonly commonName = 'Indigo Bunting';
  readonly scientificName = 'Passerina cyanea';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 20;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 invertebrate or fruit from the birdfeeder, if available.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new GainFood(player, 1, {
      allowedFoods: [FoodType.INVERTEBRATE, FoodType.FRUIT],
      message: `${this.commonName}: Gain 1 invertebrate or fruit from the birdfeeder.`,
    }));
  }
}
