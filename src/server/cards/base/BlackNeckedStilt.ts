import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class BlackNeckedStilt extends BirdCard {
  readonly name = BirdCardName.BLACK_NECKED_STILT;
  readonly commonName = 'Black-Necked Stilt';
  readonly scientificName = 'Himantopus mexicanus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 74;
  readonly points = 4;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 card.';

  onPlay(player: Player, game: Game): void {
    for (let i = 0; i < 2; i++) {
      const card = game.drawFromDeck();
      if (card) player.addCardToHand(card);
    }
  }
}
