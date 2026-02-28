import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class NorthernShoveler extends BirdCard {
  readonly name = BirdCardName.NORTHERN_SHOVELER;
  readonly commonName = 'Northern Shoveler';
  readonly scientificName = 'Spatula clypeata';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 76;
  readonly points = 7;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players draw 1 card from the deck.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      const card = game.drawFromDeck();
      if (card) p.addCardToHand(card);
    }
  }
}
