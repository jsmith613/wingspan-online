import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class CommonMerganser extends BirdCard {
  readonly name = BirdCardName.COMMON_MERGANSER;
  readonly commonName = 'Common Merganser';
  readonly scientificName = 'Mergus merganser';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.WILD];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 4;
  readonly wingspan = 86;
  readonly points = 5;
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
