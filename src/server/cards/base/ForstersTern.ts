import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class ForstersTern extends BirdCard {
  readonly name = BirdCardName.FORSTERS_TERN;
  readonly commonName = 'Forster\'s Tern';
  readonly scientificName = 'Sterna forsteri';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 2;
  readonly wingspan = 79;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 1 card. If you do, discard 1 card from your hand at the end of your turn.';

  onActivate(player: Player, game: Game): void {
    const card = game.drawFromDeck();
    if (card) player.addCardToHand(card);
    // Discard at end of turn is simplified to immediate draw only
  }
}
