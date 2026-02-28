import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { GameEvent } from '../../powers/PowerEventBus';
import { LayEggs } from '../../deferredActions/LayEggs';

/**
 * Eastern Phoebe - Pink power: When another player gains food, lay 1 egg on this bird.
 * Habitats: Forest. Nest: Platform. Eggs: 3. Wingspan: 28cm. Points: 2.
 * Food: Invertebrate.
 */
export class EasternPhoebe extends BirdCard {
  readonly name = BirdCardName.EASTERN_PHOEBE;
  readonly commonName = 'Eastern Phoebe';
  readonly scientificName = 'Sayornis phoebe';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 3;
  readonly wingspan = 28;
  readonly points = 2;
  readonly powerType = PowerType.PINK;
  readonly powerText = 'When another player gains food, lay 1 egg on this bird.';

  getTriggeredEvents(): GameEvent[] {
    return [GameEvent.FOOD_GAINED];
  }

  onTrigger(_event: GameEvent, triggeringPlayer: Player, owner: Player, game: Game): boolean {
    if (triggeringPlayer === owner) return false;
    game.deferredActions.push(new LayEggs(owner, 1));
    return true;
  }
}
