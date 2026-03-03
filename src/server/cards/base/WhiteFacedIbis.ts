import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { RollOutsideBirdfeederForCache } from '../../deferredActions/RollOutsideBirdfeederForCache';

export class WhiteFacedIbis extends BirdCard {
  readonly name = BirdCardName.WHITE_FACED_IBIS;
  readonly commonName = 'White-Faced Ibis';
  readonly scientificName = 'Plegadis chihi';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 91;
  readonly points = 8;
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
