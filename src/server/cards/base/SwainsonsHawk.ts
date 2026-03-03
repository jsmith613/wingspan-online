import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { RevealDeckCardForTuckThreshold } from '../../deferredActions/RevealDeckCardForTuckThreshold';

export class SwainsonsHawk extends BirdCard {
  readonly name = BirdCardName.SWAINSONS_HAWK;
  readonly commonName = 'Swainson\'s Hawk';
  readonly scientificName = 'Buteo swainsoni';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 130;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Look at a card from the deck. If less than 75cm, tuck it behind this bird. If not, discard it.';

  onActivate(player: Player, game: Game): void {
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    game.deferredActions.push(new RevealDeckCardForTuckThreshold(
      player,
      self,
      75,
      this.commonName,
    ));
  }
}
