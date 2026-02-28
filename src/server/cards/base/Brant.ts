import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class Brant extends BirdCard {
  readonly name = BirdCardName.BRANT;
  readonly commonName = 'Brant';
  readonly scientificName = 'Branta bernicla';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.SEED, FoodType.WILD];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 114;
  readonly points = 3;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw the 3 face-up card in the bird tray.';

  onPlay(player: Player, game: Game): void {
    const trayCards = game.getBirdTray();
    for (const card of trayCards) {
      const taken = game.takeFromTray(card);
      if (taken) player.addCardToHand(taken);
    }
  }
}
