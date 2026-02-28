import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BarnSwallow extends BirdCard {
  readonly name = BirdCardName.BARN_SWALLOW;
  readonly commonName = 'Barn Swallow';
  readonly scientificName = 'Hirundo rustica';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 3;
  readonly wingspan = 38;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck 1 card from your hand behind this bird. If you do, draw 1 card.';

  onActivate(player: Player, game: Game): void {
    if (player.hand.length === 0) return;
    const self = player.board.getAllBirds().find(b => b.name === this.name);
    if (!self) return;
    // Auto-tuck the first card and draw
    const card = player.hand.shift();
    if (card) {
      self.tuckedCards++;
      const drawn = game.drawFromDeck();
      if (drawn) player.addCardToHand(drawn);
    }
  }
}
