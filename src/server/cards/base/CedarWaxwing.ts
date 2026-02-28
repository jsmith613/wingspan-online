import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GameEvent } from '../../powers/PowerEventBus';
import { DrawCards } from '../../deferredActions/DrawCards';

/**
 * Cedar Waxwing - Pink power: When another player plays a bird, draw 1 card.
 * Habitats: Forest, Grassland. Nest: Bowl. Eggs: 3. Wingspan: 30cm. Points: 2.
 * Food: Fruit.
 */
export class CedarWaxwing extends BirdCard {
  readonly name = BirdCardName.CEDAR_WAXWING;
  readonly commonName = 'Cedar Waxwing';
  readonly scientificName = 'Bombycilla cedrorum';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 30;
  readonly points = 2;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player plays a bird, draw 1 card.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.BIRD_PLAYED];
  }

  onTrigger(_event: GameEvent, triggeringPlayer: Player, owner: Player, game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    game.deferredActions.push(new DrawCards(owner, 1));
    return true;
  }
}
