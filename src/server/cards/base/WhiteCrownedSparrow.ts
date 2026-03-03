import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import type { BrownPowerContext } from '../BirdCard';
import { MoveRightmostBird } from '../../deferredActions/MoveRightmostBird';

export class WhiteCrownedSparrow extends BirdCard {
  readonly name = BirdCardName.WHITE_CROWNED_SPARROW;
  readonly commonName = 'White-Crowned Sparrow';
  readonly scientificName = 'Zonotrichia leucophrys';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 5;
  readonly wingspan = 25;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'If this bird is to the right of all other birds in its habitat, move it to another habitat.';

  onActivate(player: Player, game: Game, context?: BrownPowerContext): void {
    const sourceHabitat = context?.habitat;
    const sourceSlot = context?.slotIndex;
    if (sourceHabitat === undefined || sourceSlot === undefined) return;

    const rightmost = player.board.getRightmostOccupiedSlot(sourceHabitat);
    if (rightmost !== sourceSlot) return;

    game.deferredActions.push(new MoveRightmostBird(
      player,
      sourceHabitat,
      sourceSlot,
      this.name,
      this.habitats,
    ));
  }
}
