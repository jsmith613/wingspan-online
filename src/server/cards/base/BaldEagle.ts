import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BaldEagle extends BirdCard {
  readonly name = BirdCardName.BALD_EAGLE;
  readonly commonName = 'Bald Eagle';
  readonly scientificName = 'Haliaeetus leucocephalus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 1;
  readonly wingspan = 203;
  readonly points = 9;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Gain all fish that are in the birdfeeder.';

  onPlay(player: Player, game: Game): void {
    let gained = true;
    while (gained) {
      gained = false;
      const food = game.birdfeeder.takeFood(FoodType.FISH);
      if (food !== null) {
        player.addFood(food);
        gained = true;
      }
    }
  }
}
