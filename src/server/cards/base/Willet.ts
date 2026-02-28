import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class Willet extends BirdCard {
  readonly name = BirdCardName.WILLET;
  readonly commonName = 'Willet';
  readonly scientificName = 'Tringa semipalmata';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 66;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Roll all dice not in birdfeeder. If any are fish, cache 1 fish from the supply on this bird.';

  onActivate(player: Player, game: Game): void {
    const result = game.birdfeeder.rollOutsideDice();
    if (result.includes(FoodType.FISH)) {
      const self = player.board.getAllBirds().find(b => b.name === this.name);
      if (self) self.cachedFood++;
    }
  }
}
