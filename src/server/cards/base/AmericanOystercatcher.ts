import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class AmericanOystercatcher extends BirdCard {
  readonly name = BirdCardName.AMERICAN_OYSTERCATCHER;
  readonly commonName = 'American Oystercatcher';
  readonly scientificName = 'Haematopus palliatus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.INVERTEBRATE];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 81;
  readonly points = 5;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw card equal to the number of players +1. Starting with you and proceeding clockwise, each player selects 1 of those cards and places it in their hand. You keep the extra card.';

  onPlay(player: Player, game: Game): void {
    const count = game.getPlayers().length + 1;
    for (let i = 0; i < count; i++) {
      const card = game.drawFromDeck();
      if (card) player.addCardToHand(card);
    }
  }
}
