import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BroadWingedHawk extends BirdCard {
  readonly name = BirdCardName.BROAD_WINGED_HAWK;
  readonly commonName = 'Broad-Winged Hawk';
  readonly scientificName = 'Buteo platypterus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 85;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Roll all dice not in birdfeeder. If any are rodent, cache 1 rodent from the supply on this bird.';

  onActivate(player: Player, game: Game): void {
    const result = game.birdfeeder.rollOutsideDice();
    if (result.includes(FoodType.RODENT)) {
      const self = player.board.getAllBirds().find(b => b.name === this.name);
      if (self) self.cachedFood++;
    }
  }
}
