import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class NorthernFlicker extends BirdCard {
  readonly name = BirdCardName.NORTHERN_FLICKER;
  readonly commonName = 'Northern Flicker';
  readonly scientificName = 'Colaptes auratus';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 51;
  readonly points = 2;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Gain all invertebrate that are in the birdfeeder.';

  onPlay(player: Player, game: Game): void {
    let gained = true;
    while (gained) {
      gained = false;
      const food = game.birdfeeder.takeFood(FoodType.INVERTEBRATE);
      if (food !== null) {
        player.addFood(food);
        gained = true;
      }
    }
  }
}
