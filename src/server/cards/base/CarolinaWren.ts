import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class CarolinaWren extends BirdCard {
  readonly name = BirdCardName.CAROLINA_WREN;
  readonly commonName = 'Carolina Wren';
  readonly scientificName = 'Thryothorus ludovicianus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 5;
  readonly wingspan = 20;
  readonly points = 1;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 card.';

  onPlay(player: Player, game: Game): void {
    for (let i = 0; i < 2; i++) {
      const card = game.drawFromDeck();
      if (card) player.addCardToHand(card);
    }
  }
}
