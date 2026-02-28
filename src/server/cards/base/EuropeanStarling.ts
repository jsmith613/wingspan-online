import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { TuckCard } from '../../deferredActions/TuckCard';

/**
 * European Starling - Brown power: Tuck 1 card from hand behind this bird.
 * Habitats: Forest, Grassland, Wetland. Nest: Cavity. Eggs: 3. Wingspan: 40cm. Points: 2.
 * Food: Invertebrate, Fruit.
 */
export class EuropeanStarling extends BirdCard {
  readonly name = BirdCardName.EUROPEAN_STARLING;
  readonly commonName = 'European Starling';
  readonly scientificName = 'Sturnus vulgaris';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 3;
  readonly wingspan = 40;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Tuck a card from your hand behind this bird.';

  onActivate(player: Player, game: Game): void {
    const placed = player.board.getAllBirds().find(b => b.name === this.name);
    if (placed) {
      game.deferredActions.push(new TuckCard(player, 1, placed));
    }
  }
}
