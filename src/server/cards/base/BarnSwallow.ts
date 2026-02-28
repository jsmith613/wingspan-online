import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';
import { DrawCards } from '../../deferredActions/DrawCards';

/**
 * Barn Swallow - Brown power: Tuck 1 card from hand behind this bird. If you do, draw 1 card.
 * Habitats: Grassland. Nest: Bowl. Eggs: 3. Wingspan: 34cm. Points: 1.
 * Food: Invertebrate.
 */
export class BarnSwallow extends BirdCard {
  readonly name = BirdCardName.BARN_SWALLOW;
  readonly commonName = 'Barn Swallow';
  readonly scientificName = 'Hirundo rustica';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 34;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck a card from your hand behind this bird. If you do, draw 1 card.';

  onActivate(player: Player, game: Game): void {
    const placed = player.board.getAllBirds().find(b => b.name === this.name);
    if (placed) {
      game.deferredActions.push(new TuckCard(player, 1, placed));
      game.deferredActions.push(new DrawCards(player, 1));
    }
  }
}
