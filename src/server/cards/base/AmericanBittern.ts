import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class AmericanBittern extends BirdCard {
  readonly name = BirdCardName.AMERICAN_BITTERN;
  readonly commonName = 'American Bittern';
  readonly scientificName = 'Botaurus lentiginosus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 107;
  readonly points = 7;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Player(s) with the fewest birds in their wetland draw 1 card.';

  onActivate(_player: Player, game: Game): void {
    const players = game.getPlayers();
    const minBirds = Math.min(...players.map(p => p.board.getBirdCount(HabitatType.WETLAND)));
    for (const p of players) {
      if (p.board.getBirdCount(HabitatType.WETLAND) === minBirds) {
        const card = game.drawFromDeck();
        if (card) p.addCardToHand(card);
      }
    }
  }
}
