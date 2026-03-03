import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { RollOutsideBirdfeederForCache } from '../../deferredActions/RollOutsideBirdfeederForCache';

export class FerruginousHawk extends BirdCard {
  readonly name = BirdCardName.FERRUGINOUS_HAWK;
  readonly commonName = 'Ferruginous Hawk';
  readonly scientificName = 'Buteo regalis';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.RODENT, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 142;
  readonly points = 6;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Roll all dice not in birdfeeder. If any are rodent, cache 1 rodent from the supply on this bird.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new RollOutsideBirdfeederForCache(
      player,
      self,
      FoodType.RODENT,
      this.commonName,
    ));
  }
}
