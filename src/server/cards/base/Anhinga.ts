import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { RollOutsideBirdfeederForCache } from '../../deferredActions/RollOutsideBirdfeederForCache';

export class Anhinga extends BirdCard {
  readonly name = BirdCardName.ANHINGA;
  readonly commonName = 'Anhinga';
  readonly scientificName = 'Anhinga anhinga';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 114;
  readonly points = 6;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Roll all dice not in birdfeeder. If any are fish, cache 1 fish from the supply on this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new RollOutsideBirdfeederForCache(
      player,
      self,
      FoodType.FISH,
      this.commonName,
    ));
  }
}
